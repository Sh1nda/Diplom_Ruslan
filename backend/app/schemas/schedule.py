# backend/app/schemas/schedule.py
from datetime import datetime
from pydantic import BaseModel


class ScheduleItemBase(BaseModel):
    course_id: int
    teacher_id: int
    group_name: str
    start_time: datetime
    end_time: datetime
    room: str | None = None


class ScheduleItemCreate(ScheduleItemBase):
    pass


class ScheduleItemOut(ScheduleItemBase):
    id: int

    class Config:
        orm_mode = True
