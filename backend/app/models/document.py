# backend/app/models/document.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.db.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    file_path = Column(String(256), nullable=False)
    category = Column(String(64), nullable=True)  # приказы, методички и т.п.
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    uploaded_by = Column(Integer, nullable=False)  # user_id
    description = Column(Text, nullable=True)
