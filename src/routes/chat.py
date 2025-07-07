from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import json
import random
import time

chat_bp = Blueprint('chat', __name__)

# Base de connaissances simplifiée pour le diabète (prototype)
DIABETES_KNOWLEDGE = {
    "definition": {
        "question_patterns": ["qu'est-ce que", "définition", "c'est quoi", "diabète"],
        "response": "Le diabète est une maladie chronique qui survient lorsque le pancréas ne produit pas suffisamment d'insuline ou lorsque l'organisme n'utilise pas efficacement l'insuline qu'il produit. L'insuline est une hormone qui régule la glycémie (taux de sucre dans le sang)."
    },
    "symptoms": {
        "question_patterns": ["symptômes", "signes", "comment savoir"],
        "response": "Les symptômes principaux du diabète incluent : soif excessive, urination fréquente, fatigue, vision floue, cicatrisation lente des plaies, infections fréquentes, et perte de poids inexpliquée. Si vous ressentez ces symptômes, consultez un professionnel de santé."
    },
    "treatment": {
        "question_patterns": ["traitement", "soigner", "médicaments", "insuline"],
        "response": "Le traitement du diabète peut inclure : une alimentation équilibrée, de l'exercice régulier, la surveillance de la glycémie, et selon le type, des médicaments oraux ou des injections d'insuline. Le plan de traitement doit toujours être personnalisé par un médecin."
    },
    "prevention": {
        "question_patterns": ["prévention", "éviter", "prévenir"],
        "response": "Pour prévenir le diabète de type 2 : maintenez un poids santé, adoptez une alimentation équilibrée riche en fibres et pauvre en sucres raffinés, pratiquez une activité physique régulière, limitez la consommation d'alcool et ne fumez pas."
    },
    "diet": {
        "question_patterns": ["alimentation", "manger", "régime", "nourriture"],
        "response": "Une alimentation diabétique doit privilégier : les légumes, les fruits à faible index glycémique, les céréales complètes, les protéines maigres, et limiter les sucres simples, les graisses saturées et les aliments transformés. Consultez un nutritionniste pour un plan personnalisé."
    }
}

DISCLAIMER = "⚠️ Important : Ces informations sont fournies à titre éducatif uniquement et ne remplacent pas un avis médical professionnel. Consultez toujours un médecin pour un diagnostic et un traitement appropriés."

def find_best_response(user_message):
    """Trouve la meilleure réponse basée sur les mots-clés dans le message utilisateur"""
    user_message_lower = user_message.lower()
    
    best_match = None
    max_matches = 0
    
    for category, data in DIABETES_KNOWLEDGE.items():
        matches = sum(1 for pattern in data["question_patterns"] if pattern in user_message_lower)
        if matches > max_matches:
            max_matches = matches
            best_match = data["response"]
    
    if best_match:
        return f"{best_match}\n\n{DISCLAIMER}"
    else:
        return f"Je comprends votre question, mais je me spécialise actuellement dans les informations sur le diabète. Pourriez-vous reformuler votre question en relation avec le diabète ? Par exemple, vous pouvez me demander des informations sur les symptômes, le traitement, la prévention ou l'alimentation diabétique.\n\n{DISCLAIMER}"

@chat_bp.route('/chat', methods=['POST'])
@cross_origin()
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message requis'}), 400
        
        user_message = data['message'].strip()
        
        if not user_message:
            return jsonify({'error': 'Message vide'}), 400
        
        # Simulation d'un délai de traitement (comme un vrai LLM)
        time.sleep(1)
        
        # Génération de la réponse
        response = find_best_response(user_message)
        
        return jsonify({
            'response': response,
            'timestamp': time.time()
        })
        
    except Exception as e:
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@chat_bp.route('/health', methods=['GET'])
@cross_origin()
def health():
    """Point de contrôle de santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'service': 'DocIA Chat API',
        'version': '1.0.0'
    })

