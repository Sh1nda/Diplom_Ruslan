# backend/app/api/routes_discipline.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db, require_role
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

    records = q.order_by(models.DisciplineRecord.created_at.desc()).all()

    return [
        DisciplineRecordOut(
            id=r.id,

            group_id=r.group_id,
            group_name=r.group.name,

            cadet_id=r.cadet_id,
            cadet_name=r.cadet.full_name,

            commander_id=r.commander_id,
            commander_name=r.commander.full_name,

            violation_type=r.violation_type,
            comment=r.comment,
            created_at=r.created_at,
        )
        for r in records
    ]


@router.post("/", response_model=DisciplineRecordOut)
def create_discipline(
    record_in: DisciplineCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    record = models.DisciplineRecord(
        cadet_id=record_in.cadet_id,
        group_id=record_in.group_id,
        violation_type=record_in.violation_type,
        description=record_in.description,
        action_taken=record_in.action_taken,
        comment=record_in.comment,

        commander_id=user.id,
        created_by_id=user.id,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return DisciplineRecordOut(
        id=record.id,

        group_id=record.group_id,
        group_name=record.group.name,

        cadet_id=record.cadet_id,
        cadet_name=record.cadet.full_name,

        commander_id=record.commander_id,
        commander_name=record.commander.full_name,

        violation_type=record.violation_type,
        comment=record.comment,
        created_at=record.created_at,
    )


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
