# DocIA - Votre Assistant Santé Intelligent

DocIA est un assistant médical intelligent développé pour le Douala General Hospital dans le cadre du Hackathon de l'IA de la Santé. Il utilise l'intelligence artificielle pour fournir des informations médicales fiables et personnalisées aux patients.

## 🚀 Fonctionnalités

- **Interface conversationnelle intuitive** - Chat en temps réel avec l'assistant IA
- **Authentification sécurisée** - Connexion via Google OAuth ou email/mot de passe
- **Historique des conversations** - Sauvegarde et accès à toutes vos conversations
- **Réponses personnalisées** - Informations adaptées à vos questions de santé
- **Support multilingue** - Français et anglais
- **Sources fiables** - Intégration avec OpenFDA et bases de données médicales validées
- **Interface responsive** - Optimisée pour mobile et desktop

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **IA**: Mistral AI, OpenFDA API
- **Authentification**: Supabase Auth avec Google OAuth
- **Base de données**: PostgreSQL (Supabase)
- **Déploiement**: Vercel

## 📋 Prérequis

- Node.js 18+ 
- Compte Supabase
- Clé API Mistral AI
- Configuration Google OAuth

## 🔧 Installation

1. **Cloner le repository**
\`\`\`bash
git clone https://github.com/votre-username/docai.git
cd docai
\`\`\`

2. **Installer les dépendances**
\`\`\`bash
npm install
\`\`\`

3. **Configuration des variables d'environnement**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Remplir les variables dans `.env.local`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MISTRAL_API_KEY=your_mistral_api_key
\`\`\`

4. **Configuration de la base de données**
- Exécuter le script SQL dans `scripts/create-tables.sql` dans votre console Supabase
- Configurer Google OAuth dans les paramètres d'authentification Supabase

5. **Lancer le serveur de développement**
\`\`\`bash
npm run dev
\`\`\`

L'application sera disponible sur `http://localhost:3000`

## 🏗️ Architecture

\`\`\`
docai/
├── app/                    # Pages Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Page d'authentification
│   ├── chat/              # Interface de chat
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configurations
├── public/               # Assets statiques
└── scripts/              # Scripts SQL et utilitaires
\`\`\`

## 🔒 Sécurité et Confidentialité

- **Chiffrement des données** - Toutes les communications sont chiffrées
- **Authentification sécurisée** - OAuth 2.0 et JWT
- **Isolation des données** - Row Level Security (RLS) activé
- **Avertissements médicaux** - Rappels constants que l'IA ne remplace pas un médecin
- **Conformité RGPD** - Respect des principes de protection des données

## 📊 Utilisation

1. **Inscription/Connexion** - Créer un compte ou se connecter avec Google
2. **Nouvelle conversation** - Cliquer sur "Nouvelle conversation"
3. **Poser des questions** - Taper vos questions de santé dans le chat
4. **Recevoir des réponses** - L'IA analyse et répond avec des informations fiables
5. **Historique** - Accéder à toutes vos conversations précédentes

## ⚠️ Avertissements Importants

- DocIA ne remplace pas une consultation médicale professionnelle
- Toujours consulter un médecin pour un diagnostic ou traitement
- Les informations fournies sont à titre éducatif uniquement
- En cas d'urgence médicale, contacter immédiatement les services d'urgence

## 🤝 Contribution

Ce projet a été développé dans le cadre du Hackathon de l'IA de la Santé du Douala General Hospital en partenariat avec Data Science Without Borders (DSWB).

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support technique, contactez l'équipe DocIA à l'adresse: support@docai.health

---

**Développé avec ❤️ pour améliorer l'accès aux soins de santé au Cameroun**
