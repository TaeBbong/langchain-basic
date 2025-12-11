from langchain_core.runnables import Runnable, RunnableLambda
from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient

from app.core.llm import get_llm
from app.tools.simple_tools import simple_tools
from app.core.config import settings


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
            "ida": {
                "transport": "stdio",
                "command": settings.ida_command,
                "args": [settings.ida_args],
            }
        }
    )

    target_affine_tools = ["list_workspaces", "list_docs"]
    target_ida_tools = ["get_metadata", "get_current_function", "list_functions", "get_entry_points"]

    affine_tools: list = await client.get_tools(server_name="affine")
    ida_tools: list = await client.get_tools(server_name="ida")

    tools = []
    tools += simple_tools
    tools += [t for t in affine_tools if t.name in target_affine_tools]
    tools += [t for t in ida_tools if t.name in target_ida_tools]

    agent = create_agent(model=llm, tools=tools)
    to_str = RunnableLambda(
        lambda state: state["messages"][-1].content
    )
    return agent | to_str