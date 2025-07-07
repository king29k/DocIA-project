import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cache } from "@/lib/cache"

// Types pour une meilleure gestion des erreurs
interface APIError {
  code: string
  message: string
  details?: any
}

interface ChatResponse {
  message: string
  sources: string[]
  confidence?: number
  suggestions?: string[]
  metadata?: {
    responseTime: number
    model: string
    tokens?: number
  }
}

// Fonction pour appeler l'API Mistral avec retry et timeout
async function callMistralAPIWithRetry(messages: any[], retries = 3): Promise<any> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: `Tu es DocIA, un assistant médical intelligent et empathique du Douala General Hospital au Cameroun.

CONTEXTE MÉDICAL CAMEROUNAIS:
- Maladies tropicales courantes : paludisme, fièvre typhoïde, dengue
- Défis sanitaires locaux : accès aux soins, prévention, éducation sanitaire
- Ressources limitées : optimisation des traitements disponibles
- Diversité culturelle : respect des croyances et pratiques locales

DOMAINES D'EXPERTISE ÉTENDUS:
- Médecine générale et médecine tropicale
- Pédiatrie et santé maternelle
- Maladies chroniques (diabète, hypertension, VIH/SIDA)
- Nutrition et malnutrition
- Santé mentale et bien-être
- Prévention et vaccination
- Pharmacologie et interactions médicamenteuses
- Premiers secours et urgences médicales

SOURCES DE DONNÉES:
- Base de connaissances médicales validées
- Protocoles du Douala General Hospital
- Recommandations OMS pour l'Afrique
- OpenFDA pour les informations pharmaceutiques
- Littérature médicale récente

STYLE DE COMMUNICATION:
- Empathique et rassurant
- Langage accessible (éviter le jargon médical)
- Culturellement sensible au contexte camerounais
- Bilingue français/anglais selon la langue de l'utilisateur
- Toujours inclure un avertissement de non-diagnostic

STRUCTURE DE RÉPONSE:
1. Réponse principale claire et structurée
2. Conseils pratiques adaptés au contexte local
3. Quand consulter un professionnel
4. Ressources disponibles au DGH si pertinent
5. Avertissement de non-diagnostic obligatoire

GESTION DES URGENCES:
Si l'utilisateur décrit des symptômes d'urgence, orienter immédiatement vers les services d'urgence du DGH ou composer le 15 (SAMU Cameroun).`,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1200,
          top_p: 0.9,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API Mistral Error ${response.status}: ${errorData.message || "Unknown error"}`)
      }

      return await response.json()
    } catch (error: any) {
      if (attempt === retries) {
        throw error
      }

      // Attendre avant de réessayer (backoff exponentiel)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}

// Fonction enrichie pour OpenFDA avec plus de détails
async function enrichWithHealthAPIs(query: string) {
  const results: any = {
    fda: null,
    who: null,
    dgh: null,
  }

  try {
    // Recherche OpenFDA pour les médicaments
    if (query.toLowerCase().includes("médicament") || query.toLowerCase().includes("drug")) {
      const fdaResponse = await fetch(
        `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=3`,
        { signal: AbortSignal.timeout(10000) },
      )

      if (fdaResponse.ok) {
        const fdaData = await fdaResponse.json()
        results.fda = fdaData.results?.[0] || null
      }
    }

    // Recherche dans la base de données locale DGH via Supabase
    const supabase = createClient()
    const { data: dghProtocols } = await supabase
      .from("medical_protocols")
      .select("*")
      .ilike("keywords", `%${query.toLowerCase()}%`)
      .limit(3)

    if (dghProtocols && dghProtocols.length > 0) {
      results.dgh = dghProtocols
    }
  } catch (error) {
    console.error("Erreur lors de l'enrichissement des données:", error)
  }

  return results
}

// Fonction pour générer des suggestions de suivi
function generateFollowUpSuggestions(userMessage: string, assistantResponse: string): string[] {
  const suggestions: string[] = []
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("diabète")) {
    suggestions.push(
      "Comment surveiller ma glycémie au quotidien ?",
      "Quels aliments éviter en cas de diabète ?",
      "Exercices recommandés pour les diabétiques",
    )
  }

  if (lowerMessage.includes("hypertension") || lowerMessage.includes("tension")) {
    suggestions.push(
      "Comment mesurer correctement sa tension ?",
      "Alimentation anti-hypertensive",
      "Gestion du stress et hypertension",
    )
  }

  if (lowerMessage.includes("médicament") || lowerMessage.includes("traitement")) {
    suggestions.push(
      "Que faire en cas d'oubli de médicament ?",
      "Interactions médicamenteuses à surveiller",
      "Comment bien conserver ses médicaments ?",
    )
  }

  return suggestions.slice(0, 3)
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = createClient()

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentification requise" } },
        { status: 401 },
      )
    }

    const { messages, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Messages requis" } }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]

    // Vérifier le cache pour des réponses similaires
    const cacheKey = `chat_${Buffer.from(lastMessage.content).toString("base64").slice(0, 50)}`
    const cachedResponse = cache.get<ChatResponse>(cacheKey)

    if (cachedResponse) {
      return NextResponse.json({
        ...cachedResponse,
        metadata: {
          ...cachedResponse.metadata,
          cached: true,
          responseTime: Date.now() - startTime,
        },
      })
    }

    // Enrichir avec des données externes
    const externalData = await enrichWithHealthAPIs(lastMessage.content)

    // Préparer le contexte enrichi
    const enrichedMessages = [...messages]
    if (externalData.fda) {
      enrichedMessages.push({
        role: "system",
        content: `Informations FDA disponibles: ${JSON.stringify({
          brand_names: externalData.fda.openfda?.brand_name || [],
          generic_names: externalData.fda.openfda?.generic_name || [],
          indications: externalData.fda.indications_and_usage || [],
          warnings: externalData.fda.warnings || [],
        })}`,
      })
    }

    // Appeler Mistral AI avec retry
    const mistralResponse = await callMistralAPIWithRetry(enrichedMessages)
    const assistantMessage = mistralResponse.choices[0].message.content

    // Générer des suggestions de suivi
    const suggestions = generateFollowUpSuggestions(lastMessage.content, assistantMessage)

    // Ajouter l'avertissement de non-diagnostic avec contexte local
    const finalMessage = `${assistantMessage}

---

⚠️ **AVERTISSEMENT MÉDICAL IMPORTANT**

Ces informations sont fournies à titre éducatif uniquement par DocIA, l'assistant santé du Douala General Hospital. Elles ne remplacent en aucun cas :
- Une consultation médicale avec un professionnel de santé qualifié
- Un diagnostic médical professionnel
- Un traitement médical prescrit par un médecin

**En cas d'urgence médicale :**
- Contactez immédiatement le service d'urgences du DGH : +237 233 42 24 69
- Ou composez le 15 (SAMU Cameroun)

**Pour une consultation :**
- Prenez rendez-vous au Douala General Hospital
- Consultez votre médecin traitant
- En cas de doute, demandez toujours l'avis d'un professionnel de santé

Votre santé est précieuse. Ne prenez aucun risque.`

    // Calculer un score de confiance basique
    const confidence = Math.min(95, Math.max(70, 85 + (externalData.fda ? 5 : 0) + (suggestions.length > 0 ? 5 : 0)))

    const response: ChatResponse = {
      message: finalMessage,
      sources: ["Mistral AI", "Base médicale DocIA", ...(externalData.fda ? ["OpenFDA"] : []), "Protocoles DGH"],
      confidence,
      suggestions,
      metadata: {
        responseTime: Date.now() - startTime,
        model: "mistral-large-latest",
        tokens: mistralResponse.usage?.total_tokens,
      },
    }

    // Mettre en cache la réponse
    cache.set(cacheKey, response, 60) // Cache pendant 1 heure

    // Sauvegarder dans Supabase
    if (conversationId) {
      try {
        // Sauvegarder le message utilisateur
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: lastMessage.content,
        })

        // Sauvegarder la réponse de l'assistant
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: finalMessage,
        })

        // Mettre à jour la conversation
        await supabase
          .from("conversations")
          .update({
            updated_at: new Date().toISOString(),
            title: lastMessage.content.slice(0, 50) + (lastMessage.content.length > 50 ? "..." : ""),
          })
          .eq("id", conversationId)
      } catch (dbError) {
        console.error("Erreur lors de la sauvegarde:", dbError)
        // Ne pas faire échouer la requête pour une erreur de sauvegarde
      }
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Erreur API chat:", error)

    const apiError: APIError = {
      code: "INTERNAL_ERROR",
      message: "Une erreur interne s'est produite. Veuillez réessayer.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    }

    return NextResponse.json({ error: apiError }, { status: 500 })
  }
}
