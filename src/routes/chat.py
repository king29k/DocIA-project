from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import json
import time

from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch

chat_bp = Blueprint("chat", __name__)





# Chargement du modèle TinyLlama (modèle léger, open source, adapté aux PC standards)
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32)
    model = model.to(DEVICE)
    print(f"TinyLlama loaded on {DEVICE}!")
except Exception as e:
    print(f"Error loading TinyLlama: {e}")
    model = None
    tokenizer = None

DISCLAIMER = "⚠️ Important : Ces informations sont fournies à titre éducatif uniquement et ne remplacent pas un avis médical professionnel. Consultez toujours un médecin pour un diagnostic et un traitement approprié."

@chat_bp.route("/chat", methods=["POST"])
@cross_origin()
def chat():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"error": "Message requis"}), 400

        user_message = data["message"].strip()

        if not user_message:
            return jsonify({"error": "Message vide"}), 400




        # Utilisation du modèle TinyLlama pour générer la réponse
        if model and tokenizer:
            try:
                # TinyLlama attend aussi un prompt instruct (format Llama)
                prompt = f"[INST] {user_message} [/INST]"
                input_ids = tokenizer.encode(prompt, return_tensors="pt").to(DEVICE)
                output = model.generate(
                    input_ids,
                    max_new_tokens=100,
                    do_sample=True,
                    temperature=0.7,
                    top_p=0.95,
                    pad_token_id=tokenizer.eos_token_id
                )
                response_llm = tokenizer.decode(output[0], skip_special_tokens=True)
                # Nettoyage : retirer le prompt si répété
                if response_llm.startswith(prompt):
                    response_llm = response_llm[len(prompt):].strip()
                final_response = f"{response_llm}\n\n{DISCLAIMER}"
            except Exception as llm_error:
                print(f"Error during TinyLlama generation: {llm_error}")
                final_response = f"Désolé, une erreur est survenue lors de la génération de la réponse. Veuillez réessayer. {DISCLAIMER}"
        else:
            final_response = f"Le service de génération de réponse est actuellement indisponible. {DISCLAIMER}"

        return jsonify({
            "response": final_response,
            "timestamp": time.time()
        })

    except Exception as e:
        print(f"Internal server error: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

@chat_bp.route("/health", methods=["GET"])
@cross_origin()
def health():
    """Point de contrôle de santé de l'API"""
    return jsonify({
        "status": "healthy",
        "service": "DocIA Chat API",
        "version": "1.0.0",
        "llm_status": "loaded" if model else "failed to load",
        "model_name": MODEL_NAME
    })
