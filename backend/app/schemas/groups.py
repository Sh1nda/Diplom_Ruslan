from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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

class GroupMember(GroupMemberBase):
    id: int

    class Config:
        orm_mode = True
