from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.chains.chat_chain import build_chat_chain
from app.chains.agent_chain import build_agent_chain
from app.core.callbacks import AgentDebugHandler


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    agent = await build_agent_chain()
    handler = AgentDebugHandler()
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
        },
        config={"callbacks": [handler]}
    )
    return ChatResponse(reply=result)

    chain = build_chat_chain()
    reply: str = await chain.ainvoke(
        {
            "system_prompt": req.system_prompt,
            "user_message": req.user_message,
        }
    )
    return ChatResponse(reply=reply)