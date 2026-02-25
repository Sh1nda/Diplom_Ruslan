# backend/app/api/routes_discipline.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import UserRole, User
from app.models.discipline import DisciplineRecord
from app.schemas.discipline import DisciplineCreate, DisciplineOut

router = APIRouter(prefix="/discipline", tags=["discipline"])


@router.post("/", response_model=DisciplineOut)
def create_record(
    record_in: DisciplineCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.COMMANDER)),
):
    record = DisciplineRecord(**record_in.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=List[DisciplineOut])
def list_records(
    cadet_id: int | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    q = db.query(DisciplineRecord)
    if cadet_id:
        q = q.filter(DisciplineRecord.cadet_id == cadet_id)
    return q.order_by(DisciplineRecord.created_at.desc()).all()
