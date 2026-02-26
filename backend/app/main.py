from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

import app.db.init_models

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Абсолютный путь к uploads (НЕ зависит от рабочей директории)
# ---------------------------------------------------------

# Путь к файлу main.py → backend/app
APP_DIR = os.path.dirname(os.path.abspath(__file__))

# Путь к backend/
BACKEND_DIR = os.path.abspath(os.path.join(APP_DIR, ".."))

# Путь к backend/uploads
UPLOAD_DIR = os.path.join(BACKEND_DIR, "uploads")

# Создаём папку, если её нет
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Монтируем uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ---------------------------------------------------------
# Роуты
# ---------------------------------------------------------
from app.api import (
    routes_auth,
    routes_users,
    routes_schedule,
    routes_attendance,
    routes_discipline,
    routes_documents,
    routes_courses,
    routes_groups,
)

app.include_router(routes_auth.router, prefix="/api")
app.include_router(routes_users.router, prefix="/api")
app.include_router(routes_schedule.router, prefix="/api")
app.include_router(routes_attendance.router, prefix="/api")
app.include_router(routes_discipline.router, prefix="/api")
app.include_router(routes_documents.router, prefix="/api")
app.include_router(routes_courses.router, prefix="/api")
app.include_router(routes_groups.router, prefix="/api")
