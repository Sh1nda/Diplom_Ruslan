from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, require_role
from app.models.user import UserRole
from app import models
from app.schemas.groups import (
    Group,
    GroupCreate,
    GroupMember,
    GroupMemberCreate,
    GroupMemberOut,
)

router = APIRouter(prefix="/groups", tags=["groups"])


@router.get("/", response_model=List[Group])
def list_groups(
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER)),
):
    return db.query(models.Group).all()


@router.post("/", response_model=Group)
def create_group(
    group_in: GroupCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN)),
):
    group = models.Group(**group_in.dict())
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


@router.get("/{group_id}", response_model=Group)
def get_group(
    group_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER)),
):
    group = db.query(models.Group).get(group_id)
    if not group:
        raise HTTPException(404, "Group not found")
    return group


@router.get("/{group_id}/members", response_model=List[GroupMemberOut])
def list_group_members(
    group_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER)),
):
    members = (
        db.query(models.GroupMember)
        .filter(models.GroupMember.group_id == group_id)
        .all()
    )

    return [
        GroupMemberOut(
            id=m.id,
            cadet_id=m.cadet_id,
            full_name=m.cadet.full_name,
        )
        for m in members
    ]


@router.post("/{group_id}/members", response_model=GroupMember)
def add_group_member(
    group_id: int,
    member_in: GroupMemberCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    if member_in.group_id != group_id:
        raise HTTPException(400, "group_id mismatch")

    member = models.GroupMember(**member_in.dict())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/members/{member_id}")
def delete_group_member(
    member_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    member = db.query(models.GroupMember).get(member_id)
    if not member:
        raise HTTPException(404, "Member not found")
    db.delete(member)
    db.commit()
    return {"ok": True}


@router.delete("/{group_id}")
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN)),
):
    group = db.query(models.Group).get(group_id)
    if not group:
        raise HTTPException(404, "Group not found")

    db.query(models.ScheduleItem).filter(
        models.ScheduleItem.group_id == group_id
    ).delete()

    db.delete(group)
    db.commit()

    return {"ok": True}
