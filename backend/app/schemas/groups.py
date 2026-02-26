# backend/app/schemas/groups.py
from pydantic import BaseModel
from typing import Optional


class GroupBase(BaseModel):
    name: str
    commander_id: Optional[int] = None
    year: Optional[int] = None


class GroupCreate(GroupBase):
    pass


class Group(GroupBase):
    id: int

    class Config:
        orm_mode = True


class GroupMemberBase(BaseModel):
    group_id: int
    cadet_id: int


class GroupMemberCreate(GroupMemberBase):
    pass


class GroupMember(BaseModel):
    id: int
    group_id: int
    cadet_id: int

    class Config:
        orm_mode = True


# 🔥 Новая схема для фронтенда
class GroupMemberOut(BaseModel):
    id: int
    cadet_id: int
    full_name: str

    class Config:
        orm_mode = True
