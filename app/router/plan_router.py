from fastapi import APIRouter
from app.schema.plan import PlanRequest, PlanResponse
from app.chain.plan_chain import build_plan_chain


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
