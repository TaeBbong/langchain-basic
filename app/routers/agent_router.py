from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.chains.chat_chain import build_chat_chain
from app.chains.agent_chain import build_agent_chain


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    agent = build_agent_chain()
    result = await agent.ainvoke(
        {
            "messages": [
                {
                    "role": "system",
                    "content": req.system_prompt,
                },
                {
                    "role": "user",
                    "content": req.user_message,
                },
            ]
        }
    )
    return ChatResponse(reply=result)