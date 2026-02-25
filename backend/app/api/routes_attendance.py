# backend/app/api/routes_attendance.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import UserRole, User
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/", response_model=AttendanceOut)
def mark_attendance(
    att_in: AttendanceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.TEACHER, UserRole.COMMANDER)),
):
    record = Attendance(**att_in.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/", response_model=List[AttendanceOut])
def list_attendance(
    schedule_item_id: int | None = None,
    cadet_id: int | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER)),
):
    q = db.query(Attendance)
    if schedule_item_id:
        q = q.filter(Attendance.schedule_item_id == schedule_item_id)
    if cadet_id:
        q = q.filter(Attendance.cadet_id == cadet_id)
    return q.all()
