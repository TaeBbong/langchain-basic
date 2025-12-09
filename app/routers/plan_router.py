from fastapi import APIRouter
from app.schemas.plan import PlanRequest, PlanResponse
from app.chains.plan_chain import build_plan_chain


router = APIRouter(prefix="/plan", tags=["plan"])


@router.post("", response_model=PlanResponse)
async def create_plan(req: PlanRequest):
    chain = build_plan_chain()
    plan = await chain.ainvoke(
        {
            "goal": req.goal,
            "available_hours": req.available_hours,
            "level": req.level,
        }
    )
    return PlanResponse(plan=plan)
