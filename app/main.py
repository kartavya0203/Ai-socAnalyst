# app/main.py
from fastapi import FastAPI
from app.database import Base, engine
from app.routes.logs import router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)