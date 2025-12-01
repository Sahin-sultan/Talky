# AI Chatbot Project

This is a complete AI chatbot system with a Python FastAPI backend and a vanilla JavaScript frontend.

## Project Structure

- `backend/`: Contains the FastAPI application, models, and configuration.
- `frontend/`: Contains the HTML/CSS/JS for the user interface.
- `.env.example`: Template for environment variables.

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure your API Key:
    - The `.env` file has been automatically created with your provided API key.
    - The system is configured to use **Google Gemini** models.

4.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

1.  Open `frontend/index.html` in your browser.
2.  You can simply double-click the file, or serve it using a simple HTTP server (e.g., `python -m http.server` inside the frontend folder).

## API Endpoints

-   **POST /api/chat**: Main chat endpoint. Accepts a list of messages and returns the assistant's response.
-   **POST /api/generate**: Simple text generation endpoint. Accepts a single prompt.

## Customization

-   **Model Behavior**: Edit `backend/config.py` to change the `SYSTEM_PROMPT`, `MODEL_NAME`, or `TEMPERATURE`.
-   **UI**: Edit `frontend/index.html` and `frontend/script.js` to change the look and feel.
