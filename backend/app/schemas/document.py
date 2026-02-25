# backend/app/schemas/document.py
from datetime import datetime
from pydantic import BaseModel


class DocumentBase(BaseModel):
    title: str
    category: str | None = None
    description: str | None = None


class DocumentCreate(DocumentBase):
    file_path: str
    uploaded_by: int


class DocumentOut(DocumentBase):
    id: int
    file_path: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        orm_mode = True
