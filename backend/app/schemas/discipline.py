# backend/app/schemas/discipline.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DisciplineBase(BaseModel):
    group_id: int
    cadet_id: int
    violation_type: str
    description: Optional[str] = None
    action_taken: Optional[str] = None
    comment: Optional[str] = None


class DisciplineCreate(DisciplineBase):
    pass


class DisciplineRecordOut(BaseModel):
    id: int

    group_id: int
    group_name: str

    cadet_id: int
    cadet_name: str

    commander_id: int
    commander_name: str

    violation_type: str
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
