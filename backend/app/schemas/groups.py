from pydantic import BaseModel
from typing import Optional, List


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
        extra = "ignore"   


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


class GroupMemberOut(BaseModel):
    id: int
    cadet_id: int
    full_name: str

    class Config:
        orm_mode = True
