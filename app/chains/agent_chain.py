from langchain_core.runnables import Runnable, RunnableLambda
from langchain.agents import create_agent
from app.core.llm import get_llm
from app.tools.simple_tools import tools


def build_agent_chain() -> Runnable:
    llm = get_llm()
    agent = create_agent(model=llm, tools=tools)

    to_str = RunnableLambda(
        lambda state: state["messages"][-1].content
    )
    return agent | to_str