from fastapi import APIRouter, HTTPException

from app import crud
from app.models import User

router = APIRouter()


@router.post("/", response_model=None)
def create_user(email: str, full_name: str | None = None) -> User:
    existing = crud.get_user_by_email(email=email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return crud.create_user(email=email, full_name=full_name)


@router.get("/{email}")
def read_user(email: str) -> User:
    user = crud.get_user_by_email(email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
