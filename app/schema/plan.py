from pydantic import BaseModel, Field
from typing import List, Literal


class TimeSlot(BaseModel):
    start_time: str = Field(..., examples=["09:00"])
    end_time: str = Field(..., examples=["10:00"])
    task: str = Field(..., examples=["Read LangChain tutorial"])
    category: Literal["study", "rest", "exercise", "etc"] = "study"


class StudyPlan(BaseModel):
    title: str = Field(..., examples=["Today's langchain study"])
    total_hours: float = Field(..., examples=[3.0])
    focus_topic: str = Field(..., examples=["LangChain base usage, LCEL"])
    slots: List[TimeSlot] = Field(default_factory=list)
    tips: List[str] = Field(
        default_factory=list,
        examples=["15min study, 5min break"],
    )


class PlanRequest(BaseModel):
    goal: str = Field(..., examples=["I want to study LangChain within 3 hours"])
    available_hours: float = Field(..., examples=[3.0])
    level: str = Field(default="intermediate", description="beginner / intermediate / advanced")


class PlanResponse(BaseModel):
    plan: StudyPlan