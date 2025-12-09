from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import Runnable
from app.core.llm import get_llm


def build_chat_chain() -> Runnable:
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "{system_prompt}"),
            ("user", "{user_message}"),
        ]
    )
    llm = get_llm()
    parser = StrOutputParser()

    chain: Runnable = prompt | llm | parser
    return chain