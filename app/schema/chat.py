from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    user_message: str = Field(..., description="Message from user")
    system_prompt: Optional[str] = Field(
        default="You are a helpful AI assistant",
        description="Prompt to set role/tone for model"
    )


class ChatResponse(BaseModel):
    reply: str = Field(..., description="Output from model")