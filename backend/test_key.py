import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("API_KEY")
print(f"Testing API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

if not api_key or api_key == ">>> INSERT_API_KEY_HERE <<<":
    print("API Key not set.")
    exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

try:
    response = model.generate_content("Hello, are you working?")
    print("Success!")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
