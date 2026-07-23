from pydantic import BaseModel


class RegisterIn(BaseModel):
    email: str


class RegisterOut(BaseModel):
    email: str
