from langchain_core.runnables import Runnable, RunnableLambda
from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents.middleware import wrap_tool_call

from app.core.llm import get_llm
from app.tools.simple_tools import simple_tools
from app.core.config import settings


import logging
logger = logging.getLogger("agent_tools")


@wrap_tool_call
def log_tool_calls(request, handler):
    logger.info(f"[AGENT TOOL SELECT] name={request}, input={request}")
    try:
        response = handler(request)
        logger.info(f"[AGENT TOOL DONE] name={request}, output={response}")
        return response
    except Exception as e:
        logger.exception(f"[AGENT TOOL ERROR] name={request}, error={e}")
        raise


async def build_agent_chain() -> Runnable:
    llm = get_llm()
    client = MultiServerMCPClient(
        {
            "affine": {
                "transport": "stdio",
                "command": "affine-mcp",
                "args": [],
                "env": {
                    "AFFINE_BASE_URL": settings.affine_base_url,
                    "AFFINE_EMAIL": settings.affine_email,
                    "AFFINE_PASSWORD": settings.affine_password,
                    "AFFINE_LOGIN_AT_START": "sync",
                },
            },
        }
    )

    target_tools = ["list_workspaces", "list_docs"]
    affine_tools: list = await client.get_tools(server_name="affine")
    tools = [t for t in affine_tools if t.name in target_tools]
    tools += simple_tools

    agent = create_agent(model=llm, tools=tools)
    to_str = RunnableLambda(
        lambda state: state["messages"][-1].content
    )
    return agent | to_str