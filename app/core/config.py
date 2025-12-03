from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    llm_backend: str = Field(default="ollama", description="ollama | openai_compatible")
    temperature: float = 0.3
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "qwen3:4b"
    openai_base_url: str = "http://localhost:8000/v1"
    openai_api_key: str = "dummy-key"
    openai_model: str = "local-model"

    class Config:
        env_file = ".env"


settings = Settings()