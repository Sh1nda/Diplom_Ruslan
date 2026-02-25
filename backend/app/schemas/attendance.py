# backend/app/schemas/attendance.py
from pydantic import BaseModel


class AttendanceBase(BaseModel):
    schedule_item_id: int
    cadet_id: int
    present: bool


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceOut(AttendanceBase):
    id: int

    class Config:
        orm_mode = True
