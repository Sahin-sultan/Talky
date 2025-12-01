import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from models import ChatRequest, ChatResponse, GenerateRequest, GenerateResponse, Message
from config import ModelConfig

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Chatbot API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
if ModelConfig.API_KEY and ModelConfig.API_KEY != ">>> INSERT_API_KEY_HERE <<<":
    genai.configure(api_key=ModelConfig.API_KEY)
else:
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

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handles chat completion with conversation history using Google Gemini.
    """
    try:
        if ModelConfig.API_KEY == ">>> INSERT_API_KEY_HERE <<<" or not ModelConfig.API_KEY:
             # Mock response if no key is provided
            logger.info("Returning mock response due to missing API key.")
            return ChatResponse(
                response="I am ready to help! Please configure your API key in the .env file to get real AI responses.",
                model=ModelConfig.MODEL_NAME
            )

        # Prepare the model
        model = genai.GenerativeModel(
            model_name=request.model or ModelConfig.MODEL_NAME,
            system_instruction=ModelConfig.SYSTEM_PROMPT
        )

        # Convert OpenAI-style messages to Gemini history format
        gemini_history = []
        last_user_message = ""

        # Iterate through messages to separate history from the current prompt
        for i, msg in enumerate(request.messages):
            role = "user" if msg.role == "user" else "model"
            
            # If it's the last message and it's from the user, treat it as the new prompt
            if i == len(request.messages) - 1 and role == "user":
                last_user_message = msg.content
            else:
                gemini_history.append({"role": role, "parts": [msg.content]})

        # Fallback: If the last message wasn't a user message (unexpected), try to pop from history
        if not last_user_message:
             if gemini_history and gemini_history[-1]["role"] == "user":
                 last = gemini_history.pop()
                 last_user_message = last["parts"][0]
             else:
                 raise HTTPException(status_code=400, detail="Conversation must end with a user message.")

        # Start chat session with history
        chat = model.start_chat(history=gemini_history)
        
        # Generate response
        response = await chat.send_message_async(
            last_user_message,
            generation_config=genai.types.GenerationConfig(
                temperature=ModelConfig.TEMPERATURE,
                max_output_tokens=ModelConfig.MAX_TOKENS
            )
        )
        
        return ChatResponse(
            response=response.text,
            model=ModelConfig.MODEL_NAME
        )

    except Exception as e:
        logger.error(f"Backend Error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

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
