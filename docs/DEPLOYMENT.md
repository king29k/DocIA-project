# Guide de déploiement DocIA sur Vercel

## 1. Préparation du déploiement

### Prérequis
- Compte Vercel (gratuit)
- Repository GitHub avec le code DocIA
- Configuration Supabase terminée
- Clé API Mistral AI

### Vérifications avant déploiement
- [ ] Tests locaux passent
- [ ] Variables d'environnement configurées
- [ ] Base de données Supabase opérationnelle
- [ ] Authentification Google configurée

## 2. Déploiement automatique depuis GitHub

### Étape 1: Connecter le repository
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub DocIA
4. Sélectionnez le framework "Next.js"

### Étape 2: Configuration des variables d'environnement
Dans les paramètres du projet Vercel, ajoutez :

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://uifwchsfuywqlyhckvcy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZndjaHNmdXl3cWx5aGNrdmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTI0NzAsImV4cCI6MjA2NzQ2ODQ3MH0.CwpoWdb0Cr9T6Q_f3yp1mJPepWeOtiXraSADP5vW0nk

# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key_here

# Application
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
\`\`\`

### Étape 3: Configuration du build
Vercel détecte automatiquement Next.js. Configuration par défaut :
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 3. Configuration post-déploiement

### Mise à jour des URLs de redirection
1. **Supabase** : Ajoutez votre URL Vercel dans les URLs de redirection
   - `https://your-app-name.vercel.app/auth/callback`
   
2. **Google OAuth** : Ajoutez l'URL dans Google Cloud Console
   - `https://your-app-name.vercel.app/auth/callback`

### Test du déploiement
1. Visitez votre URL Vercel
2. Testez l'authentification Google
3. Créez une conversation de test
4. Vérifiez les logs dans Vercel Dashboard

## 4. Optimisations de production

### Performance
\`\`\`javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['uifwchsfuywqlyhckvcy.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}

export default nextConfig
\`\`\`

### Sécurité
\`\`\`javascript
// middleware.ts - Ajout d'headers de sécurité
export function middleware(request) {
  const response = NextResponse.next()
  
  // Headers de sécurité
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}
\`\`\`

## 5. Monitoring et analytics

### Vercel Analytics
\`\`\`bash
npm install @vercel/analytics
\`\`\`

\`\`\`javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### Monitoring des erreurs
\`\`\`javascript
// lib/monitoring.ts
export function logError(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Envoyer à votre service de monitoring
    console.error('Production Error:', error, context)
  }
}
\`\`\`

## 6. CI/CD et automatisation

### GitHub Actions (optionnel)
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## 7. Domaine personnalisé

### Configuration d'un domaine
1. Dans Vercel Dashboard > Settings > Domains
2. Ajoutez votre domaine (ex: docai.health)
3. Configurez les DNS selon les instructions Vercel
4. Mettez à jour les URLs dans Supabase et Google OAuth

### SSL automatique
Vercel configure automatiquement SSL avec Let's Encrypt.

## 8. Maintenance et mises à jour

### Déploiements automatiques
- Chaque push sur `main` déclenche un déploiement
- Les pull requests créent des previews automatiques
- Rollback possible en un clic

### Monitoring de production
\`\`\`javascript
// app/api/health/route.ts
export async function GET() {
  try {
    // Vérifier la connexion Supabase
    const { data, error } = await supabase
      .from('conversations')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    return Response.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    return Response.json({ 
      status: 'unhealthy',
      error: error.message 
    }, { status: 500 })
  }
}
\`\`\`

## 9. Checklist de déploiement

### Avant le déploiement
- [ ] Tests unitaires passent
- [ ] Tests d'intégration OK
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Authentification testée

### Après le déploiement
- [ ] URL accessible
- [ ] Authentification fonctionne
- [ ] Chat opérationnel
- [ ] Monitoring activé
- [ ] Domaine configuré (si applicable)
- [ ] SSL actif

### Surveillance continue
- [ ] Logs d'erreur
- [ ] Performance des API
- [ ] Utilisation des ressources
- [ ] Feedback utilisateurs

## 10. Dépannage

### Erreurs courantes

**Build failed**
\`\`\`bash
# Vérifier les dépendances
npm ci
npm run build
\`\`\`

**Variables d'environnement manquantes**
- Vérifiez dans Vercel Dashboard > Settings > Environment Variables
- Redéployez après ajout de variables

**Erreur 500 en production**
- Consultez les logs Vercel
- Vérifiez les connexions API externes
- Testez les endpoints individuellement

### Support
- Documentation Vercel : https://vercel.com/docs
- Support DocIA : support@docai.health
- Logs en temps réel : Vercel Dashboard > Functions
\`\`\`

Script de test de déploiement :
