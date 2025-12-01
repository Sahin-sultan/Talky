"""
Simple script to start the FastAPI backend server
"""
import uvicorn
import sys
import os

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=" * 50)
    print("Starting Talky Backend Server")
    print("=" * 50)
    print("Server will be available at: http://localhost:8000")
    print("API Docs available at: http://localhost:8000/docs")
    print("Press CTRL+C to stop the server")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
