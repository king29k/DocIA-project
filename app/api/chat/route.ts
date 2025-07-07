import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// Fonction pour appeler l'API Mistral
async function callMistralAPI(messages: any[]) {
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
          content: `Tu es DocIA, un assistant médical intelligent et empathique du Douala General Hospital. 

IMPORTANT: Tu ne remplaces PAS un médecin. Toujours rappeler aux utilisateurs de consulter un professionnel de santé pour un diagnostic ou traitement.

Tes capacités:
- Fournir des informations médicales générales fiables
- Expliquer les symptômes, maladies et traitements courants
- Donner des conseils de prévention et de bien-être
- Répondre aux questions sur les médicaments (posologie, effets secondaires)
- Orienter vers les services appropriés du DGH

Sources d'information:
- Base de données médicales validées
- Recommandations de l'OMS
- Protocoles du Douala General Hospital
- API OpenFDA pour les informations sur les médicaments
- Connaissances médicales générales actualisées

Ton style:
- Empathique et rassurant
- Langage clair et accessible
- Culturellement sensible au contexte camerounais
- Toujours inclure un avertissement de non-diagnostic
- Répondre en français ou anglais selon la langue de l'utilisateur

Domaines couverts:
- Médecine générale
- Pédiatrie
- Gynécologie
- Cardiologie
- Diabétologie
- Hypertension
- Maladies tropicales courantes
- Prévention et hygiène
- Nutrition et bien-être`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    throw new Error("Erreur lors de l'appel à l'API Mistral")
  }

  return response.json()
}

// Fonction pour enrichir la réponse avec des données OpenFDA si nécessaire
async function enrichWithOpenFDA(query: string) {
  try {
    // Recherche de médicaments dans OpenFDA
    const response = await fetch(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=1`)

    if (response.ok) {
      const data = await response.json()
      return data.results?.[0] || null
    }
  } catch (error) {
    console.error("Erreur OpenFDA:", error)
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { messages, conversationId } = await request.json()

    // Enrichir avec des données externes si nécessaire
    const lastMessage = messages[messages.length - 1]
    const fdaData = await enrichWithOpenFDA(lastMessage.content)

    // Ajouter le contexte FDA si disponible
    if (fdaData) {
      messages.push({
        role: "system",
        content: `Informations complémentaires FDA: ${JSON.stringify(fdaData.openfda || {})}`,
      })
    }

    // Appeler Mistral AI
    const mistralResponse = await callMistralAPI(messages)
    const assistantMessage = mistralResponse.choices[0].message.content

    // Ajouter l'avertissement de non-diagnostic
    const finalMessage = `${assistantMessage}

⚠️ **Avertissement important**: Ces informations sont fournies à titre éducatif uniquement et ne remplacent pas une consultation médicale professionnelle. Consultez toujours un médecin du Douala General Hospital ou un professionnel de santé qualifié pour un diagnostic et un traitement appropriés.`

    // Sauvegarder les messages dans Supabase
    if (conversationId) {
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

      // Mettre à jour la date de dernière modification de la conversation
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)
    }

    return NextResponse.json({
      message: finalMessage,
      sources: fdaData ? ["OpenFDA", "Mistral AI", "Base médicale DocIA"] : ["Mistral AI", "Base médicale DocIA"],
    })
  } catch (error) {
    console.error("Erreur API chat:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
