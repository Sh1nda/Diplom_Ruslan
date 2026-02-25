# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# ВАЖНО: импортируем модели ДО create_all()
import app.db.init_models

# Создание таблиц (без Alembic, для простоты)
Base.metadata.create_all(bind=engine)

# Инициализация приложения
app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роуты
from app.api import (
    routes_auth,
    routes_users,
    routes_schedule,
    routes_attendance,
    routes_discipline,
    routes_documents,
    routes_courses,
    routes_groups,   # ← если добавишь группы
)

app.include_router(routes_auth.router, prefix="/api")
app.include_router(routes_users.router, prefix="/api")
app.include_router(routes_schedule.router, prefix="/api")
app.include_router(routes_attendance.router, prefix="/api")
app.include_router(routes_discipline.router, prefix="/api")
app.include_router(routes_documents.router, prefix="/api")
app.include_router(routes_courses.router, prefix="/api")
app.include_router(routes_groups.router, prefix="/api")  # ← если есть
