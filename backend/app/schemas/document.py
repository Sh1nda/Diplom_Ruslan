from datetime import datetime
from pydantic import BaseModel

class DocumentBase(BaseModel):
    title: str
    category: str | None = None
    description: str | None = None

class DocumentOut(DocumentBase):
    id: int
    file_path: str | None
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        orm_mode = True
