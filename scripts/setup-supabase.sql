-- Configuration complète de la base de données DocIA pour Supabase
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Créer la table des conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT FALSE
);

-- 3. Créer la table des messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0
);

-- 4. Créer la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'fr',
  medical_conditions TEXT[],
  emergency_contact TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Créer la table des statistiques d'utilisation
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Créer la table des feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Créer la table des protocoles médicaux du DGH
CREATE TABLE IF NOT EXISTS medical_protocols (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'Douala General Hospital',
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Index pour les protocoles médicaux
CREATE INDEX IF NOT EXISTS idx_medical_protocols_category ON medical_protocols(category);
CREATE INDEX IF NOT EXISTS idx_medical_protocols_keywords ON medical_protocols USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_medical_protocols_language ON medical_protocols(language);
CREATE INDEX IF NOT EXISTS idx_medical_protocols_active ON medical_protocols(is_active);

-- Politiques RLS pour les protocoles médicaux (lecture publique pour les utilisateurs authentifiés)
ALTER TABLE medical_protocols ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view medical protocols" ON medical_protocols;
CREATE POLICY "Authenticated users can view medical protocols" ON medical_protocols
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Insérer quelques protocoles médicaux de base
INSERT INTO medical_protocols (title, category, keywords, content) VALUES
('Gestion du Diabète Type 2', 'Endocrinologie', ARRAY['diabète', 'glycémie', 'insuline', 'hba1c'], 
 'Protocole de prise en charge du diabète de type 2 au DGH : surveillance glycémique, adaptation thérapeutique, éducation patient.'),

('Hypertension Artérielle', 'Cardiologie', ARRAY['hypertension', 'tension', 'pression artérielle'], 
 'Prise en charge de l''HTA : mesures hygiéno-diététiques, traitement médicamenteux, surveillance.'),

('Paludisme Simple', 'Médecine Tropicale', ARRAY['paludisme', 'malaria', 'fièvre', 'plasmodium'], 
 'Diagnostic et traitement du paludisme simple : TDR, microscopie, artemisinine, surveillance.'),

('Diarrhée Aiguë', 'Gastroentérologie', ARRAY['diarrhée', 'gastroentérite', 'déshydratation'], 
 'Prise en charge de la diarrhée aiguë : réhydratation, probiotiques, surveillance des signes de gravité.'),

('Fièvre Typhoïde', 'Médecine Tropicale', ARRAY['typhoïde', 'salmonelle', 'fièvre prolongée'], 
 'Diagnostic et traitement de la fièvre typhoïde : hémoculture, antibiothérapie, prévention.');

-- 7. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);

CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_stats_user_id ON usage_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_created_at ON usage_stats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_stats_action_type ON usage_stats(action_type);

CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_message_id ON feedbacks(message_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);

-- 8. Activer Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 9. Créer les politiques de sécurité pour les conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
CREATE POLICY "Users can insert their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;
CREATE POLICY "Users can delete their own conversations" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Créer les politiques de sécurité pour les messages
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON messages;
CREATE POLICY "Users can view messages from their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON messages;
CREATE POLICY "Users can insert messages to their conversations" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- 11. Créer les politiques de sécurité pour les profils utilisateurs
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- 12. Créer les politiques de sécurité pour les statistiques d'utilisation
DROP POLICY IF EXISTS "Users can view their own usage stats" ON usage_stats;
CREATE POLICY "Users can view their own usage stats" ON usage_stats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own usage stats" ON usage_stats;
CREATE POLICY "Users can insert their own usage stats" ON usage_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. Créer les politiques de sécurité pour les feedbacks
DROP POLICY IF EXISTS "Users can manage their own feedbacks" ON feedbacks;
CREATE POLICY "Users can manage their own feedbacks" ON feedbacks
  FOR ALL USING (auth.uid() = user_id);

-- 14. Créer les fonctions utilitaires
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 15. Créer les triggers pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 16. Créer une fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Créer le trigger pour les nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 18. Créer des vues utiles pour les statistiques
CREATE OR REPLACE VIEW conversation_stats AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_conversations,
  COUNT(DISTINCT user_id) as unique_users
FROM conversations
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW message_stats AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  role,
  COUNT(*) as message_count,
  AVG(response_time_ms) as avg_response_time,
  SUM(tokens_used) as total_tokens
FROM messages
GROUP BY DATE_TRUNC('day', created_at), role
ORDER BY date DESC, role;

-- 19. Insérer des données de test (optionnel)
-- Décommentez les lignes suivantes pour ajouter des données de test

/*
-- Exemple de conversation de test
INSERT INTO conversations (user_id, title) 
VALUES (auth.uid(), 'Conversation de test - Diabète');

-- Exemple de messages de test
INSERT INTO messages (conversation_id, role, content) 
VALUES 
  ((SELECT id FROM conversations WHERE title = 'Conversation de test - Diabète' LIMIT 1), 'user', 'Quels sont les symptômes du diabète ?'),
  ((SELECT id FROM conversations WHERE title = 'Conversation de test - Diabète' LIMIT 1), 'assistant', 'Les principaux symptômes du diabète incluent...');
*/

-- 20. Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Configuration DocIA terminée avec succès !';
  RAISE NOTICE 'Tables créées: conversations, messages, user_profiles, usage_stats, feedbacks, medical_protocols';
  RAISE NOTICE 'Politiques RLS activées pour la sécurité';
  RAISE NOTICE 'Index créés pour optimiser les performances';
  RAISE NOTICE 'Triggers configurés pour la maintenance automatique';
END $$;
