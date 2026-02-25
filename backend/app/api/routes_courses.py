# backend/app/api/routes_courses.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import UserRole, User
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut

router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("/", response_model=CourseOut)
def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    course = Course(**course_in.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/", response_model=List[CourseOut])
def list_courses(
    db: Session = Depends(get_db),
):
    return db.query(Course).all()


@router.patch("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    course_in: CourseUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    course = db.query(Course).get(course_id)
    if not course:
        raise HTTPException(404, "Курс не найден")

    for field, value in course_in.dict(exclude_unset=True).items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    course = db.query(Course).get(course_id)
    if not course:
        raise HTTPException(404, "Курс не найден")

    db.delete(course)
    db.commit()
    return {"detail": "Курс удалён"}
