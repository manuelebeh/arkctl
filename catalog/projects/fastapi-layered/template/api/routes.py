from fastapi import APIRouter

from schemas.greeting import HelloOut
from services.greet import greet

router = APIRouter()


@router.get("/hello", response_model=HelloOut)
def hello(name: str = "world") -> HelloOut:
    return HelloOut(message=greet(name))
