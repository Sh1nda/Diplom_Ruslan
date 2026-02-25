# backend/app/core/config.py
from pydantic_settings import BaseSettings



class Settings(BaseSettings):
    PROJECT_NAME: str = "Military Training Center IS"
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_USER: str = "mtc_user"
    POSTGRES_PASSWORD: str = "mtc_password"
    POSTGRES_DB: str = "mtc_db"

    SECRET_KEY: str = "CHANGE_ME_SUPER_SECRET"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"


settings = Settings()
