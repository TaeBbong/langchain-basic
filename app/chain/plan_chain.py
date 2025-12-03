from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable
from langchain_core.output_parsers import PydanticOutputParser

from app.core.llm import get_llm
from app.schema.plan import StudyPlan


def build_plan_chain() -> Runnable:
    parser = PydanticOutputParser(pydantic_object=StudyPlan)
    format_instructions = parser.get_format_instructions()

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are an expert study coach for programmers."
             "Create a realistic and focused study plan."),
            (
                "user", (
                    "사용자의 목표와 시간 정보를 바탕으로 공부 계획을 만들어줘.\n"
                    "User goal: {goal}\n"
                    "Available hours: {available_hours}\n"
                    "User level: {level}\n\n"
                    "반드시 아래 형식에 맞게 응답해:\n"
                    "{format_instructions}"
                )
            )
        ]
    ).partial(format_instructions=format_instructions)

    llm = get_llm()
    
    chain: Runnable = prompt | llm | parser
    return chain