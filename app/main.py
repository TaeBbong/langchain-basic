from fastapi import FastAPI

from app.core.logging import setup_logging
from app.routers import chat_router


app = FastAPI(title="LangChain Playground API")

@app.on_event("startup")
def startup_event():
    """
    Application startup event handler.
    """
    setup_logging()


app.include_router(chat_router.router)