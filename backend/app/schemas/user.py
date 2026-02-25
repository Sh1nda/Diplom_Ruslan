# backend/app/schemas/user.py
from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    COMMANDER = "COMMANDER"
    TEACHER = "TEACHER"
    CADET = "CADET"


class UserBase(BaseModel):
    username: str
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


class UserOut(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
