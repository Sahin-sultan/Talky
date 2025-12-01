import os
from dotenv import load_dotenv

load_dotenv()

class ModelConfig:
    API_KEY = os.getenv("API_KEY", ">>> INSERT_API_KEY_HERE <<<")
    # You can change the model name here (e.g., gpt-4, gpt-3.5-turbo, claude-3, gemini-pro)
    MODEL_NAME = "gemini-2.0-flash" 
    TEMPERATURE = 0.7
    MAX_TOKENS = 1000
    
    SYSTEM_PROMPT = """
    You are a helpful, polite, and clear AI chatbot assistant.
    Your goals are:
    - Answer questions accurately and maintain context.
    - Handle step-by-step explanations.
    - Avoid giving wrong or unsafe information.
    - Provide code examples when asked.
    - Format content neatly using Markdown.
    - If the topic is unknown, respond safely and admit lack of knowledge.
    - Keep answers simple and clean.
    - Avoid a robotic tone.
    """
