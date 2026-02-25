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


class DisciplineRecordOut(DisciplineBase):
    id: int
    created_by_id: int
    created_at: datetime

    class Config:
        orm_mode = True
