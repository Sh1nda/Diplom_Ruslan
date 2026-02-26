from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import UserRole, User
from app.models.attendance import Attendance
from app.models.schedule import ScheduleItem
from app.schemas.attendance import AttendanceCreate, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


# ---------------------------------------------------------
# Создать или обновить посещаемость
# ---------------------------------------------------------
@router.post("/", response_model=AttendanceOut)
def mark_attendance(
    att_in: AttendanceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(
        UserRole.ADMIN,
        UserRole.TEACHER,
        UserRole.COMMANDER
    )),
):
    # Проверка занятия
    item = db.query(ScheduleItem).get(att_in.schedule_item_id)
    if not item:
        raise HTTPException(404, "Занятие не найдено")

    # Проверка кадета
    cadet = db.query(User).get(att_in.cadet_id)
    if not cadet or cadet.role != UserRole.CADET:
        raise HTTPException(400, "Указанный пользователь не является кадетом")

    # Проверка существующей записи
    existing = db.query(Attendance).filter(
        Attendance.schedule_item_id == att_in.schedule_item_id,
        Attendance.cadet_id == att_in.cadet_id
    ).first()

    # Если запись уже есть — обновляем
    if existing:
        existing.present = att_in.present
        db.commit()
        db.refresh(existing)
        return existing

    # Создаём новую запись
    record = Attendance(**att_in.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ---------------------------------------------------------
# Получить посещаемость
# ---------------------------------------------------------
@router.get("/", response_model=List[AttendanceOut])
def list_attendance(
    schedule_item_id: int | None = None,
    cadet_id: int | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(
        UserRole.ADMIN,
        UserRole.COMMANDER,
        UserRole.TEACHER
    )),
):
    q = db.query(Attendance)

    if schedule_item_id:
        q = q.filter(Attendance.schedule_item_id == schedule_item_id)

    if cadet_id:
        q = q.filter(Attendance.cadet_id == cadet_id)

    return q.all()
