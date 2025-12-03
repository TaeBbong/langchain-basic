from .config import settings

from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel


def get_llm() -> BaseChatModel:
    if settings.llm_backend == "ollama":
        return ChatOllama(
            base_url=settings.ollama_base_url,
            model=settings.ollama_model,
            temperature=settings.temperature,
        )
    elif settings.llm_backend == "openai_compatible":
        return ChatOpenAI(
            base_url=settings.openai_base_url,
            api_key=settings.openai_api_key,
            model=settings.openai_model,
            temperature=settings.temperature,
        )
    else:
        raise ValueError(f"Unknown llm_backend: {settings.llm_backend}")