# backend/app/api/routes_users.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db,
    get_current_user,
    require_role,
)
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])


# -----------------------------
#  ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ /users/me
# -----------------------------
@router.get("/me", response_model=UserOut)
def read_users_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


# -----------------------------
#  СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ
# -----------------------------
@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    user = User(
        username=user_in.username,
        full_name=user_in.full_name,
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# -----------------------------
#  СПИСОК ПОЛЬЗОВАТЕЛЕЙ
# -----------------------------
@router.get("/", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    return db.query(User).all()


# -----------------------------
#  ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЯ ПО ID
# -----------------------------
@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

@router.get("/teachers", response_model=List[UserOut])
def list_teachers(
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER)),
):
    return db.query(User).filter(User.role == UserRole.TEACHER).all()

# -----------------------------
#  ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
# -----------------------------
@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user_in.full_name is not None:
        user.full_name = user_in.full_name
    if user_in.role is not None:
        user.role = user_in.role
    if user_in.is_active is not None:
        user.is_active = user_in.is_active

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
