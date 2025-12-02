import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from models import ChatRequest, ChatResponse, GenerateRequest, GenerateResponse, Message
from config import ModelConfig

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Chatbot API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5500",
        "http://localhost:5501",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Groq client
if ModelConfig.API_KEY and ModelConfig.API_KEY != ">>> INSERT_API_KEY_HERE <<<":
    groq_client = Groq(api_key=ModelConfig.API_KEY)
else:
    groq_client = None
    logger.warning("API Key not configured. Chat endpoints will return mock responses.")

@app.get("/")
async def root():
    return {"message": "AI Chatbot API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API key configuration.
    """
    if ModelConfig.API_KEY == ">>> INSERT_API_KEY_HERE <<<" or not ModelConfig.API_KEY:
        return {"status": "warning", "message": "API Key not configured"}
    return {"status": "ok", "message": "System operational"}

@app.get("/api/health")
async def api_health_check():
    """
    Health check endpoint for frontend (matches /api/health path).
    """
    if ModelConfig.API_KEY == ">>> INSERT_API_KEY_HERE <<<" or not ModelConfig.API_KEY:
        return {"status": "warning", "message": "API Key not configured"}
    return {"status": "ok", "message": "System operational"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handles chat completion with conversation history using Groq API.
    """
    try:
        if ModelConfig.API_KEY == ">>> INSERT_API_KEY_HERE <<<" or not ModelConfig.API_KEY or not groq_client:
             # Mock response if no key is provided
            logger.info("Returning mock response due to missing API key.")
            return ChatResponse(
                response="I am ready to help! Please configure your Groq API key in the .env file to get real AI responses.",
                model=ModelConfig.MODEL_NAME
            )

        # Prepare messages with system prompt
        messages = [{"role": "system", "content": ModelConfig.SYSTEM_PROMPT}]
        
        # Add conversation history
        for msg in request.messages:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Generate response using Groq
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model=request.model or ModelConfig.MODEL_NAME,
            temperature=ModelConfig.TEMPERATURE,
            max_tokens=ModelConfig.MAX_TOKENS
        )
        
        return ChatResponse(
            response=chat_completion.choices[0].message.content,
            model=ModelConfig.MODEL_NAME
        )

    except Exception as e:
        logger.error(f"Backend Error: {e}", exc_info=True)
        error_msg = str(e)
        
        # Check for common API key errors
        if "invalid_api_key" in error_msg.lower() or "unauthorized" in error_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="API Key Error: Your Groq API key is invalid. Please get a new API key from https://console.groq.com/keys and update it in backend/.env file"
            )
        elif "rate_limit" in error_msg.lower() or "quota" in error_msg.lower():
            raise HTTPException(
                status_code=429,
                detail="API Quota Exceeded: You've reached your API usage limit. Please wait or upgrade your plan."
            )
        else:
            raise HTTPException(status_code=500, detail=f"AI Error: {error_msg}")

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_endpoint(request: GenerateRequest):
    """
    Simple generation endpoint for single prompts.
    """
    try:
        # Reuse the chat logic for generation
        chat_req = ChatRequest(messages=[Message(role="user", content=request.prompt)])
        chat_res = await chat_endpoint(chat_req)
        return GenerateResponse(text=chat_res.response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
