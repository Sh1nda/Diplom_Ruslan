from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, get_current_user, require_role
from app import models
from app.schemas.discipline import DisciplineCreate, DisciplineRecordOut
from app.models.user import UserRole

router = APIRouter(prefix="/discipline", tags=["discipline"])


@router.get("/", response_model=List[DisciplineRecordOut])
def list_discipline(
    group_id: Optional[int] = None,
    cadet_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    q = db.query(models.DisciplineRecord)

    if group_id:
        q = q.filter(models.DisciplineRecord.group_id == group_id)

    if cadet_id:
        q = q.filter(models.DisciplineRecord.cadet_id == cadet_id)

    return q.order_by(models.DisciplineRecord.created_at.desc()).all()


@router.post("/", response_model=DisciplineRecordOut)
def create_discipline(
    record_in: DisciplineCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    # Формируем запись вручную, чтобы гарантировать корректные обязательные поля
    record = models.DisciplineRecord(
        cadet_id=record_in.cadet_id,
        group_id=record_in.group_id,
        violation_type=record_in.violation_type,
        description=record_in.description,
        action_taken=record_in.action_taken,
        comment=record_in.comment,

        # обязательные поля, которых нет во входной схеме
        commander_id=user.id,
        created_by_id=user.id,
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_discipline(
    record_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    record = db.query(models.DisciplineRecord).get(record_id)
    if not record:
        raise HTTPException(404, "Record not found")

    db.delete(record)
    db.commit()
    return {"ok": True}
