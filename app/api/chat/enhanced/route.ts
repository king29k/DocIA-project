import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Configuration pour le modèle gratuit
const MODEL_CONFIG = {
  model: "gemini-1.5-flash", // Modèle gratuit avec quotas plus élevés
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
}

const SYSTEM_PROMPT = `Tu es DocIA, un assistant médical intelligent du Douala General Hospital au Cameroun. 

INSTRUCTIONS IMPORTANTES :
- Tu fournis des informations médicales générales et éducatives
- Tu ne remplaces JAMAIS un médecin ou un diagnostic médical professionnel
- Tu recommandes toujours de consulter un professionnel de santé pour des problèmes sérieux
- Tu peux analyser des documents médicaux, images et symptômes décrits
- Tu réponds en français de manière claire et empathique
- Tu utilises tes connaissances médicales pour donner des conseils préventifs
- En cas d'urgence, tu recommandes immédiatement de contacter les services d'urgence

CONTEXTE MÉDICAL :
- Hôpital : Douala General Hospital, Cameroun
- Spécialités : Médecine générale, cardiologie, neurologie, pédiatrie
- Protocoles : Standards internationaux adaptés au contexte africain

Réponds de manière professionnelle, bienveillante et informative.`

async function convertFileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return buffer.toString("base64")
}

async function processFileForGemini(file: File) {
  const base64Data = await convertFileToBase64(file)

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  }
}

async function callGeminiAPI(messages: any[], files: File[] = []) {
  try {
    const model = genAI.getGenerativeModel(MODEL_CONFIG)

    // Préparer le contexte de conversation
    const conversationHistory = messages.slice(-10) // Limiter à 10 derniers messages pour économiser les tokens

    let prompt = SYSTEM_PROMPT + "\n\nHistorique de la conversation:\n"

    conversationHistory.forEach((msg, index) => {
      prompt += `${msg.role === "user" ? "Patient" : "DocIA"}: ${msg.content}\n`
    })

    const lastMessage = messages[messages.length - 1]
    prompt += `\nNouvelle question du patient: ${lastMessage.content}`

    // Préparer les parties du message (texte + fichiers)
    const parts = [{ text: prompt }]

    // Ajouter les fichiers s'il y en a
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          const filePart = await processFileForGemini(file)
          parts.push(filePart)
          parts.push({ text: `\nAnalyse ce document/image: ${file.name}` })
        }
      }
    }

    const result = await model.generateContent(parts)
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      message: text,
      metadata: {
        model: "gemini-1.5-flash",
        tokensUsed: text.length, // Approximation
        confidence: 85,
      },
    }
  } catch (error: any) {
    console.error("Erreur Gemini API:", error)

    // Gestion spécifique des erreurs de quota
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return {
        success: false,
        error: "Quota API dépassé. Veuillez patienter quelques minutes avant de réessayer.",
        retryAfter: 60,
      }
    }

    // Autres erreurs
    return {
      success: false,
      error: error.message || "Erreur lors de la génération de la réponse",
      retryAfter: 10,
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: { message: "Non autorisé" } }, { status: 401 })
    }

    // Traiter la requête (FormData pour les fichiers ou JSON)
    let messages: any[] = []
    let conversationId = ""
    const files: File[] = []

    const contentType = request.headers.get("content-type")

    if (contentType?.includes("multipart/form-data")) {
      // Requête avec fichiers
      const formData = await request.formData()

      const messagesData = formData.get("messages") as string
      messages = JSON.parse(messagesData)
      conversationId = formData.get("conversationId") as string

      // Extraire les fichiers
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("file_") && value instanceof File) {
          files.push(value)
        }
      }
    } else {
      // Requête JSON normale
      const body = await request.json()
      messages = body.messages || []
      conversationId = body.conversationId || ""
    }

    if (!messages.length) {
      return NextResponse.json({ error: { message: "Messages requis" } }, { status: 400 })
    }

    // Appeler l'API Gemini
    const result = await callGeminiAPI(messages, files)

    if (!result.success) {
      return NextResponse.json({ error: { message: result.error } }, { status: result.retryAfter ? 429 : 500 })
    }

    // Sauvegarder les messages en base de données
    if (conversationId) {
      try {
        // Sauvegarder le message utilisateur
        const userMessage = messages[messages.length - 1]
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: userMessage.role,
          content: userMessage.content,
          metadata: files.length > 0 ? { hasFiles: true, fileCount: files.length } : null,
        })

        // Sauvegarder la réponse de l'assistant
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: result.message,
          metadata: result.metadata,
        })

        // Mettre à jour la conversation
        await supabase
          .from("conversations")
          .update({
            updated_at: new Date().toISOString(),
            message_count: messages.length + 1,
          })
          .eq("id", conversationId)
      } catch (dbError) {
        console.error("Erreur sauvegarde DB:", dbError)
        // Continue même si la sauvegarde échoue
      }
    }

    return NextResponse.json({
      message: result.message,
      metadata: result.metadata,
    })
  } catch (error: any) {
    console.error("Erreur API chat:", error)
    return NextResponse.json({ error: { message: "Erreur interne du serveur" } }, { status: 500 })
  }
}
