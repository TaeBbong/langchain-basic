from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.chains.chat_chain import build_chat_chain


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    chain = build_chat_chain()
    reply: str = await chain.ainvoke(
        {
            "system_prompt": req.system_prompt,
            "user_message": req.user_message,
        }
    )
    return ChatResponse(reply=reply)