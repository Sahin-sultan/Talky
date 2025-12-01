from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    model: str

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    text: str
