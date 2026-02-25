# backend/app/models/discipline.py
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Text
from datetime import datetime

from app.db.base import Base


class DisciplineRecord(Base):
    __tablename__ = "discipline_records"

    id = Column(Integer, primary_key=True, index=True)
    cadet_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    commander_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    violation_type = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    action_taken = Column(String(128), nullable=True)
