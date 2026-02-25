# backend/app/models/attendance.py
from sqlalchemy import Column, Integer, ForeignKey, Boolean
from app.db.base import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    schedule_item_id = Column(Integer, ForeignKey("schedule_items.id"), nullable=False)
    cadet_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    present = Column(Boolean, default=False)
