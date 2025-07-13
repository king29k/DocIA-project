from fastapi import FastAPI
from pydantic import BaseModel
import json
from transformers import AutoModelForCausalLM, AutoTokenizer
from sentence_transformers import SentenceTransformer
import torch
from typing import Literal

# Initialize FastAPI
app = FastAPI()

# Load medical KB
with open("medical_kb.json.json", "r", encoding="utf-8") as f:
    MEDICAL_KB = json.load(f)

# Device selection
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize Mistral (run on GPU if available)
model_name = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,
    device_map="auto" if DEVICE == "cuda" else None
)

# Initialize embeddings model
encoder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

class Query(BaseModel):
    text: str
    language: Literal["en", "fr"] = "fr"

def retrieve_medical_context(query: str, language: str) -> str:
    """Semantic search through medical KB"""
    query_embed = encoder.encode(query)
    best_score = -1
    best_context = ""
    
    for condition in MEDICAL_KB:
        if language in MEDICAL_KB[condition]:
            for key, value in MEDICAL_KB[condition][language].items():
                if isinstance(value, list):
                    text = ", ".join(str(x) for x in value)
                else:
                    text = str(value)
                
                embed = encoder.encode(text)
                similarity = torch.nn.functional.cosine_similarity(
                    torch.tensor(query_embed), 
                    torch.tensor(embed), 
                    dim=0
                )
                
                if similarity > best_score:
                    best_score = similarity
                    best_context = text
    
    return best_context if best_score > 0.5 else "No specific context found."

def generate_safe_response(prompt: str) -> str:
    """Generate response with Mistral using guardrails"""
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)
    outputs = model.generate(
        **inputs,
        max_new_tokens=150,
        temperature=0.3,
        do_sample=True,
        top_p=0.9,
        repetition_penalty=1.1
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

@app.post("/ask")
async def ask_question(query: Query):
    # Retrieve relevant medical context
    context = retrieve_medical_context(query.text, query.language)
    
    # Craft the prompt
    prompt = f"""
    [INST] You are DocIA, a medical assistant for Douala General Hospital.
    Strictly follow these rules:
    1. ONLY use this context: {context}
    2. Respond in {query.language}
    3. Never diagnose - say "I'm not a doctor"
    4. Always add: "⚠️ Consult a real doctor"
    
    Question: {query.text}
    Answer: [/INST]
    """
    
    # Generate response
    response = generate_safe_response(prompt)
    
    # Post-process to remove extra text
    clean_response = response.split("Answer:")[-1].strip()
    
    return {"answer": clean_response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
