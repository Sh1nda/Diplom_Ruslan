# backend/app/models/discipline.py
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class DisciplineRecord(Base):
    __tablename__ = "discipline_records"

    id = Column(Integer, primary_key=True, index=True)

    cadet_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    commander_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_by = relationship("User", foreign_keys=[created_by_id])

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    violation_type = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    action_taken = Column(String(128), nullable=True)
    comment = Column(Text, nullable=True)

    cadet = relationship("User", foreign_keys=[cadet_id])
    commander = relationship("User", foreign_keys=[commander_id])
    group = relationship("Group")
