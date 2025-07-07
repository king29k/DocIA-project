# Documentation API DocIA

## Authentification

Toutes les routes API nécessitent une authentification via Supabase. L'utilisateur doit être connecté pour accéder aux endpoints.

### Headers requis
\`\`\`
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
\`\`\`

## Endpoints

### POST /api/chat/enhanced

Envoie un message au chatbot DocIA et reçoit une réponse intelligente.

#### Paramètres de requête

\`\`\`json
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "conversationId": "string" // UUID de la conversation (optionnel)
}
\`\`\`

#### Réponse de succès (200)

\`\`\`json
{
  "message": "string", // Réponse de l'assistant
  "sources": ["string"], // Sources utilisées
  "confidence": "number", // Score de confiance (0-100)
  "suggestions": ["string"], // Suggestions de suivi
  "metadata": {
    "responseTime": "number", // Temps de réponse en ms
    "model": "string", // Modèle utilisé
    "tokens": "number", // Nombre de tokens utilisés
    "cached": "boolean" // Si la réponse vient du cache
  }
}
\`\`\`

#### Réponse d'erreur

\`\`\`json
{
  "error": {
    "code": "string", // Code d'erreur
    "message": "string", // Message d'erreur
    "details": "any" // Détails additionnels (dev uniquement)
  }
}
\`\`\`

#### Codes d'erreur

- `UNAUTHORIZED` (401): Utilisateur non authentifié
- `INVALID_INPUT` (400): Paramètres de requête invalides
- `RATE_LIMITED` (429): Trop de requêtes
- `INTERNAL_ERROR` (500): Erreur interne du serveur

### GET /api/admin/stats

Récupère les statistiques d'utilisation (admin uniquement).

#### Paramètres de requête

- `range`: Période d'analyse (`24h`, `7d`, `30d`, `90d`)

#### Réponse

\`\`\`json
{
  "totalUsers": "number",
  "totalConversations": "number",
  "totalMessages": "number",
  "averageResponseTime": "number",
  "topQuestions": [
    {
      "question": "string",
      "count": "number"
    }
  ],
  "userGrowth": [
    {
      "date": "string",
      "users": "number"
    }
  ],
  "responseAccuracy": "number",
  "systemHealth": "healthy" | "warning" | "critical"
}
\`\`\`

## Modèles de données

### Conversation

\`\`\`typescript
interface Conversation {
  id: string // UUID
  user_id: string // UUID de l'utilisateur
  title: string // Titre de la conversation
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}
\`\`\`

### Message

\`\`\`typescript
interface Message {
  id: string // UUID
  conversation_id: string // UUID de la conversation
  role: "user" | "assistant"
  content: string // Contenu du message
  created_at: string // ISO 8601
}
\`\`\`

## Limites et quotas

- **Requêtes par minute**: 60 par utilisateur
- **Taille maximale du message**: 4000 caractères
- **Conversations simultanées**: 10 par utilisateur
- **Historique**: 30 jours de conservation

## Exemples d'utilisation

### Envoyer un message simple

\`\`\`javascript
const response = await fetch('/api/chat/enhanced', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Quels sont les symptômes du diabète ?' }
    ]
  })
})

const data = await response.json()
console.log(data.message) // Réponse de DocIA
\`\`\`

### Continuer une conversation

\`\`\`javascript
const response = await fetch('/api/chat/enhanced', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Quels sont les symptômes du diabète ?' },
      { role: 'assistant', content: 'Les principaux symptômes...' },
      { role: 'user', content: 'Comment le prévenir ?' }
    ],
    conversationId: 'uuid-de-la-conversation'
  })
})
\`\`\`

## Gestion des erreurs

Toutes les erreurs suivent le format standard :

\`\`\`javascript
try {
  const response = await fetch('/api/chat/enhanced', options)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error.message)
  }
  
  const data = await response.json()
  // Traiter la réponse
} catch (error) {
  console.error('Erreur:', error.message)
  // Gérer l'erreur
}
\`\`\`

## Webhooks (à venir)

DocIA supportera bientôt les webhooks pour notifier votre application des événements importants :

- Nouvelle conversation créée
- Message reçu
- Erreur système détectée
- Maintenance programmée

## Support

Pour toute question sur l'API, contactez l'équipe technique à api-support@docai.health
