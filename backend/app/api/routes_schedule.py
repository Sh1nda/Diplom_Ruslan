from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import User, UserRole
from app.models.schedule import ScheduleItem
from app.schemas.schedule import (
    ScheduleItemCreate,
    ScheduleItemUpdate,
    ScheduleItemOut,
)

router = APIRouter(prefix="/schedule", tags=["schedule"])


# -----------------------------
# Создание занятия
# -----------------------------
@router.post("/", response_model=ScheduleItemOut)
def create_schedule_item(
    item_in: ScheduleItemCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    if item_in.start_time >= item_in.end_time:
        raise HTTPException(400, "Некорректный интервал времени")

    item = ScheduleItem(**item_in.dict())
    db.add(item)
    db.commit()
    db.refresh(item)

    return ScheduleItemOut(
        id=item.id,
        course_id=item.course_id,
        course_name=item.course.title,
        teacher_id=item.teacher_id,
        teacher_name=item.teacher.full_name,
        group_id=item.group_id,
        group_name=item.group.name,
        start_time=item.start_time,
        end_time=item.end_time,
        room=item.room,
    )


# -----------------------------
# Обновление занятия
# -----------------------------
@router.put("/{item_id}", response_model=ScheduleItemOut)
def update_schedule_item(
    item_id: int,
    item_in: ScheduleItemUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    item = db.query(ScheduleItem).get(item_id)
    if not item:
        raise HTTPException(404, "Schedule item not found")

    for field, value in item_in.dict().items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return ScheduleItemOut(
        id=item.id,
        course_id=item.course_id,
        course_name=item.course.title,
        teacher_id=item.teacher_id,
        teacher_name=item.teacher.full_name,
        group_id=item.group_id,
        group_name=item.group.name,
        start_time=item.start_time,
        end_time=item.end_time,
        room=item.room,
    )


# -----------------------------
# Удаление занятия
# -----------------------------
@router.delete("/{item_id}")
def delete_schedule_item(
    item_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    item = db.query(ScheduleItem).get(item_id)
    if not item:
        raise HTTPException(404, "Schedule item not found")

    db.delete(item)
    db.commit()
    return {"ok": True}


# -----------------------------
# Список всех занятий
# -----------------------------
@router.get("/", response_model=List[ScheduleItemOut])
def list_schedule(
    group_id: Optional[int] = None,
    from_time: Optional[datetime] = None,
    to_time: Optional[datetime] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(
        UserRole.ADMIN,
        UserRole.COMMANDER,
        UserRole.TEACHER,
        UserRole.CADET
    )),
):
    q = db.query(ScheduleItem)

    if group_id:
        q = q.filter(ScheduleItem.group_id == group_id)
    if from_time:
        q = q.filter(ScheduleItem.start_time >= from_time)
    if to_time:
        q = q.filter(ScheduleItem.end_time <= to_time)

    items = q.order_by(ScheduleItem.start_time).all()

    return [
        ScheduleItemOut(
            id=i.id,
            course_id=i.course_id,
            course_name=i.course.title,
            teacher_id=i.teacher_id,
            teacher_name=i.teacher.full_name,
            group_id=i.group_id,
            group_name=i.group.name,
            start_time=i.start_time,
            end_time=i.end_time,
            room=i.room,
        )
        for i in items
    ]


# -----------------------------
# Недельное расписание
# -----------------------------
@router.get("/weekly")
def weekly_schedule(
    group_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(
        UserRole.ADMIN,
        UserRole.COMMANDER,
        UserRole.TEACHER,
        UserRole.CADET
    )),
):
    items = (
        db.query(ScheduleItem)
        .filter(ScheduleItem.group_id == group_id)
        .order_by(ScheduleItem.start_time)
        .all()
    )

    week = {i: [] for i in range(7)}

    for i in items:
        weekday = i.start_time.weekday()
        week[weekday].append({
            "id": i.id,
            "course_id": i.course_id,
            "course_name": i.course.title,
            "teacher_id": i.teacher_id,
            "teacher_name": i.teacher.full_name,
            "group_id": i.group_id,
            "group_name": i.group.name,
            "start_time": i.start_time,
            "end_time": i.end_time,
            "room": i.room,
        })

    return week
