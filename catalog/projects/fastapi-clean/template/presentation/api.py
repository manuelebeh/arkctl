from fastapi import FastAPI

from application.greet import greet

app = FastAPI(title="{{project_name}}")


@app.get("/hello")
def hello(name: str = "world") -> dict:
    return {"message": greet(name)}
