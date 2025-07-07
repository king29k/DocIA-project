-- Script pour peupler la base de données avec des protocoles médicaux spécifiques au Cameroun
-- À exécuter après setup-supabase.sql

-- Protocoles de médecine tropicale
INSERT INTO medical_protocols (title, category, keywords, content, language) VALUES
('Paludisme Grave', 'Urgences Tropicales', 
 ARRAY['paludisme grave', 'coma', 'convulsions', 'artesunate'], 
 'Prise en charge du paludisme grave : Artésunate IV, surveillance neurologique, correction des troubles métaboliques. Critères de gravité : coma, convulsions, ictère, insuffisance rénale.', 'fr'),

('Méningite Bactérienne', 'Neurologie', 
 ARRAY['méningite', 'céphalées', 'raideur nucale', 'photophobie'], 
 'Diagnostic et traitement de la méningite bactérienne : ponction lombaire, antibiothérapie empirique (Ceftriaxone), corticothérapie si indiquée.', 'fr'),

('Tuberculose Pulmonaire', 'Pneumologie', 
 ARRAY['tuberculose', 'toux chronique', 'hémoptysie', 'sueurs nocturnes'], 
 'Diagnostic TB : crachats BAAR, GeneXpert, radiographie thoracique. Traitement : RHZE 2 mois puis RH 4 mois. Surveillance hépatique.', 'fr'),

('Drépanocytose - Crise Vaso-Occlusive', 'Hématologie', 
 ARRAY['drépanocytose', 'crise douloureuse', 'vaso-occlusive'], 
 'Prise en charge de la CVO : hydratation, antalgiques (éviter Aspirine), oxygénothérapie si besoin, recherche facteur déclenchant.', 'fr'),

('VIH/SIDA - Initiation ARV', 'Infectiologie', 
 ARRAY['vih', 'sida', 'antirétroviraux', 'cd4'], 
 'Initiation ARV : bilan pré-thérapeutique (CD4, CV, bilan hépatique), schéma TDF+3TC+EFV, éducation thérapeutique, suivi.', 'fr');

-- Protocoles pédiatriques
INSERT INTO medical_protocols (title, category, keywords, content, language) VALUES
('Malnutrition Aiguë Sévère', 'Pédiatrie', 
 ARRAY['malnutrition', 'kwashiorkor', 'marasme', 'pédiatrie'], 
 'PEC MAS : stabilisation (F75), transition (F100), réhabilitation nutritionnelle, traitement complications, suivi anthropométrique.', 'fr'),

('Déshydratation Infantile', 'Pédiatrie', 
 ARRAY['déshydratation', 'diarrhée', 'vomissements', 'enfant'], 
 'Évaluation degré déshydratation, SRO si toléré, perfusion si sévère (Ringer Lactate), surveillance poids et diurèse.', 'fr'),

('Convulsions Fébriles', 'Pédiatrie Neurologie', 
 ARRAY['convulsions', 'fièvre', 'enfant', 'épilepsie'], 
 'PEC convulsions fébriles : refroidissement, Diazépam rectal si prolongées, recherche foyer infectieux, éducation parents.', 'fr');

-- Protocoles obstétricaux
INSERT INTO medical_protocols (title, category, keywords, content, language) VALUES
('Éclampsie', 'Obstétrique', 
 ARRAY['éclampsie', 'pré-éclampsie', 'convulsions', 'grossesse'], 
 'Urgence obstétricale : Sulfate de Magnésium, contrôle TA (Nifédipine), extraction fœtale urgente, surveillance neurologique.', 'fr'),

('Hémorragie du Post-Partum', 'Obstétrique', 
 ARRAY['hémorragie', 'post-partum', 'utérus', 'accouchement'], 
 'HPP : massage utérin, Ocytocine, révision utérine, compression bimanuelle, transfusion si besoin, chirurgie si échec médical.', 'fr'),

('Paludisme et Grossesse', 'Obstétrique', 
 ARRAY['paludisme', 'grossesse', 'quinine', 'artémisinine'], 
 'Traitement paludisme chez la femme enceinte : Quinine IV (1er trimestre), Artémisinine (2e-3e trimestre), surveillance fœtale.', 'fr');

-- Protocoles d'urgence
INSERT INTO medical_protocols (title, category, keywords, content, language) VALUES
('Choc Septique', 'Réanimation', 
 ARRAY['choc septique', 'hypotension', 'infection', 'lactates'], 
 'Bundle sepsis : hémocultures, antibiothérapie précoce, remplissage vasculaire, vasopresseurs si besoin, source control.', 'fr'),

('Infarctus du Myocarde', 'Cardiologie', 
 ARRAY['infarctus', 'douleur thoracique', 'ecg', 'troponine'], 
 'STEMI : Aspirine, Clopidogrel, Héparine, thrombolyse si pas de contre-indication, surveillance ECG, transfert si possible.', 'fr'),

('AVC Ischémique', 'Neurologie', 
 ARRAY['avc', 'hémiplégie', 'aphasie', 'scanner'], 
 'AVC aigu : scanner cérébral urgent, thrombolyse si <4h30 et pas de CI, Aspirine 300mg, surveillance neurologique.', 'fr');

-- Protocoles de prévention
INSERT INTO medical_protocols (title, category, keywords, content, language) VALUES
('Vaccination Adulte Cameroun', 'Prévention', 
 ARRAY['vaccination', 'adulte', 'fièvre jaune', 'hépatite'], 
 'Calendrier vaccinal adulte : Fièvre jaune (obligatoire), Hépatite B, Tétanos-Diphtérie (rappel 10 ans), Méningite A+C.', 'fr'),

('Prévention Paludisme', 'Médecine Tropicale', 
 ARRAY['prévention', 'paludisme', 'moustiquaire', 'chimioprophylaxie'], 
 'Prévention paludisme : MILD (moustiquaires imprégnées), élimination gîtes larvaires, chimioprophylaxie si voyage.', 'fr'),

('Dépistage Cancer Col', 'Gynécologie', 
 ARRAY['cancer', 'col utérus', 'frottis', 'hpv'], 
 'Dépistage cancer col utérin : frottis cervico-vaginal tous les 3 ans (25-65 ans), test HPV si disponible.', 'fr');

-- Protocoles en anglais pour les patients anglophones
INSERT INTO medical_protocols (title, category, keywords, content, language) VALUES
('Malaria Management', 'Tropical Medicine', 
 ARRAY['malaria', 'fever', 'artemisinin', 'rdt'], 
 'Malaria management: RDT confirmation, Artemisinin-based therapy, monitor for complications, prevention counseling.', 'en'),

('Hypertension Management', 'Cardiology', 
 ARRAY['hypertension', 'blood pressure', 'amlodipine'], 
 'HTN management: lifestyle modifications, ACE inhibitors or ARBs first line, monitor BP regularly, cardiovascular risk assessment.', 'en'),

('Diabetes Type 2', 'Endocrinology', 
 ARRAY['diabetes', 'glucose', 'metformin', 'hba1c'], 
 'T2DM management: Metformin first line, lifestyle counseling, HbA1c target <7%, regular monitoring for complications.', 'en');

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Protocoles médicaux ajoutés avec succès !';
  RAISE NOTICE 'Total protocoles français: %', (SELECT COUNT(*) FROM medical_protocols WHERE language = 'fr');
  RAISE NOTICE 'Total protocoles anglais: %', (SELECT COUNT(*) FROM medical_protocols WHERE language = 'en');
END $$;
