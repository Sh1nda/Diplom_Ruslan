# backend/app/schemas/discipline.py
from datetime import datetime
from pydantic import BaseModel


class DisciplineBase(BaseModel):
    cadet_id: int
    violation_type: str
    description: str | None = None
    action_taken: str | None = None


class DisciplineCreate(DisciplineBase):
    commander_id: int


class DisciplineOut(DisciplineBase):
    id: int
    commander_id: int
    created_at: datetime

    class Config:
        orm_mode = True
