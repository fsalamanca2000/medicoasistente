import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import subprocess
import json

app = FastAPI()

# Montar el directorio estático
app.mount("/static", StaticFiles(directory="static"), name="static")

class Question(BaseModel):
    question: str

@app.post("/chat")
async def chat(question: Question):
    try:
        # Prompt modificado para incluir la restricción de responder solo preguntas médicas en español
        modified_prompt = f"Por favor, responde solo preguntas relacionadas con medicina en español. Pregunta: {question.question}"

        # Construir el comando curl
        command = [
            "curl",
            "-X", "POST", "http://localhost:11434/api/generate",
            "-H", "Content-Type: application/json",
            "-d", json.dumps({"prompt": modified_prompt, "model": "llama2", "stream": True})
        ]

        # Ejecutar el comando curl y capturar la salida
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=result.stderr)

        data = json.loads(result.stdout)

        # Obtiene la respuesta de la API de Ollama
        answer = data.get("response")
        if not answer:
            raise HTTPException(status_code=500, detail="No se pudo obtener una respuesta")

        return {"response": answer}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(question: Question):
    response = obtener_respuesta(question.question)
    return {"response": response}

@app.get("/")
async def get():
    return HTMLResponse(open("index.html").read())

def obtener_respuesta(pregunta):
    url = 'http://localhost:11434/api/generate'
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        'prompt': pregunta,
        'max_tokens': 150,
        'temperature': 0.7
    }

    try:
        # Construir el comando curl
        command = [
            "curl",
            "-X", "POST", url,
            "-H", "Content-Type: application/json",
            "-d", json.dumps(data)
        ]

        # Ejecutar el comando curl y capturar la salida
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            return f"Ocurrió un error: {result.stderr}"

        respuesta = json.loads(result.stdout)
        return respuesta['choices'][0]['text'].strip()
    except subprocess.CalledProcessError as e:
        return f"Ocurrió un error: {str(e)}"
