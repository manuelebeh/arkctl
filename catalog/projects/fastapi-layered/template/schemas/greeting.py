from pydantic import BaseModel


class HelloOut(BaseModel):
    message: str
