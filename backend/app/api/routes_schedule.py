# backend/app/api/routes_schedule.py
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.models.schedule import ScheduleItem
from app.schemas.schedule import ScheduleItemCreate, ScheduleItemOut

router = APIRouter(prefix="/schedule", tags=["schedule"])


@router.post("/", response_model=ScheduleItemOut)
def create_schedule_item(
    item_in: ScheduleItemCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    if item_in.start_time >= item_in.end_time:
        raise HTTPException(status_code=400, detail="Некорректный интервал времени")
    item = ScheduleItem(
        course_id=item_in.course_id,
        teacher_id=item_in.teacher_id,
        group_name=item_in.group_name,
        start_time=item_in.start_time,
        end_time=item_in.end_time,
        room=item_in.room,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[ScheduleItemOut])
def list_schedule(
    group_name: str | None = None,
    from_time: datetime | None = None,
    to_time: datetime | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER, UserRole.CADET)),
):
    q = db.query(ScheduleItem)
    if group_name:
        q = q.filter(ScheduleItem.group_name == group_name)
    if from_time:
        q = q.filter(ScheduleItem.start_time >= from_time)
    if to_time:
        q = q.filter(ScheduleItem.end_time <= to_time)
    return q.order_by(ScheduleItem.start_time).all()
