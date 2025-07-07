# Configuration Supabase pour DocIA

## 1. Configuration de la base de données

### Étape 1: Exécuter le script SQL
1. Connectez-vous à votre dashboard Supabase : https://uifwchsfuywqlyhckvcy.supabase.co
2. Allez dans l'onglet "SQL Editor"
3. Créez une nouvelle requête
4. Copiez et collez le contenu du fichier `scripts/setup-supabase.sql`
5. Exécutez le script

### Étape 2: Vérifier les tables créées
Vérifiez que les tables suivantes ont été créées :
- `conversations`
- `messages` 
- `user_profiles`
- `usage_stats`
- `feedbacks`

## 2. Configuration de l'authentification Google

### Étape 1: Créer un projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ et l'API Google Identity

### Étape 2: Configurer OAuth 2.0
1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
3. Sélectionnez "Web application"
4. Ajoutez les URIs de redirection autorisées :
   - `https://uifwchsfuywqlyhckvcy.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (pour le développement)

### Étape 3: Configurer Supabase
1. Dans votre dashboard Supabase, allez dans "Authentication" > "Providers"
2. Activez "Google"
3. Ajoutez votre Client ID et Client Secret Google
4. Configurez les paramètres :
   - **Client ID**: Votre Google Client ID
   - **Client Secret**: Votre Google Client Secret
   - **Redirect URL**: `https://uifwchsfuywqlyhckvcy.supabase.co/auth/v1/callback`

## 3. Configuration des politiques RLS

Les politiques Row Level Security sont automatiquement configurées par le script SQL pour :
- Isoler les données de chaque utilisateur
- Permettre l'accès uniquement aux conversations et messages de l'utilisateur connecté
- Sécuriser les profils utilisateurs et les statistiques

## 4. Variables d'environnement

Créez un fichier `.env.local` avec :

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://uifwchsfuywqlyhckvcy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZndjaHNmdXl3cWx5aGNrdmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTI0NzAsImV4cCI6MjA2NzQ2ODQ3MH0.CwpoWdb0Cr9T6Q_f3yp1mJPepWeOtiXraSADP5vW0nk
MISTRAL_API_KEY=your_mistral_api_key
\`\`\`

## 5. Test de la configuration

### Test de connexion à la base de données
\`\`\`sql
-- Exécutez cette requête dans l'éditeur SQL pour tester
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
\`\`\`

### Test de l'authentification
1. Lancez votre application en local : `npm run dev`
2. Allez sur `http://localhost:3000/auth`
3. Testez la connexion Google
4. Vérifiez que le profil utilisateur est créé automatiquement

## 6. Monitoring et maintenance

### Vues de statistiques disponibles
- `conversation_stats` : Statistiques des conversations par jour
- `message_stats` : Statistiques des messages et performances

### Requêtes utiles pour le monitoring
\`\`\`sql
-- Nombre d'utilisateurs actifs
SELECT COUNT(DISTINCT user_id) as active_users 
FROM conversations 
WHERE created_at >= NOW() - INTERVAL '7 days';

-- Messages par jour
SELECT 
  DATE(created_at) as date,
  COUNT(*) as message_count
FROM messages 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Temps de réponse moyen
SELECT 
  AVG(response_time_ms) as avg_response_time,
  MAX(response_time_ms) as max_response_time
FROM messages 
WHERE role = 'assistant' 
AND created_at >= NOW() - INTERVAL '24 hours';
\`\`\`

## 7. Sécurité et bonnes pratiques

### Politiques RLS activées
- ✅ Isolation des données par utilisateur
- ✅ Accès sécurisé aux conversations
- ✅ Protection des profils utilisateurs
- ✅ Audit trail avec usage_stats

### Recommandations
- Surveillez les logs d'authentification
- Mettez à jour régulièrement les clés API
- Sauvegardez régulièrement la base de données
- Monitorer les performances des requêtes

## 8. Dépannage

### Problèmes courants

**Erreur d'authentification Google**
- Vérifiez que les URIs de redirection sont correctes
- Assurez-vous que l'API Google+ est activée
- Vérifiez les clés Client ID/Secret dans Supabase

**Erreur RLS**
- Vérifiez que l'utilisateur est bien authentifié
- Contrôlez que les politiques RLS sont activées
- Testez avec un utilisateur admin si nécessaire

**Performance lente**
- Vérifiez que les index sont créés
- Analysez les requêtes lentes avec EXPLAIN
- Considérez l'ajout d'index supplémentaires si nécessaire

## Support

Pour toute question sur la configuration Supabase :
- Documentation officielle : https://supabase.com/docs
- Support DocIA : support@docai.health
\`\`\`

Guide de déploiement sur Vercel :
