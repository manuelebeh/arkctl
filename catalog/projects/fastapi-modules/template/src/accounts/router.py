from fastapi import APIRouter

from .schemas import RegisterIn, RegisterOut
from .service import register_account

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.post("/register", response_model=RegisterOut)
def register(body: RegisterIn) -> RegisterOut:
    return RegisterOut(**register_account(email=body.email))
