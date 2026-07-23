from fastapi import FastAPI

from src.accounts.router import router as accounts_router

app = FastAPI(title="{{project_name}}")
app.include_router(accounts_router)
