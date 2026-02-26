# backend/app/schemas/schedule.py
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ScheduleItemBase(BaseModel):
    course_id: int
    teacher_id: int
    group_id: int
    start_time: datetime
    end_time: datetime
    room: Optional[str] = None


class ScheduleItemCreate(ScheduleItemBase):
    pass


class ScheduleItemOut(BaseModel):
    id: int

    course_id: int
    course_name: str

    teacher_id: int
    teacher_name: str

    group_id: int
    group_name: str

    start_time: datetime
    end_time: datetime
    room: Optional[str]

    class Config:
        orm_mode = True
