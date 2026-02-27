from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
import os

from app.api.deps import get_db, require_role
from app.models.user import UserRole, User
from app.models.document import Document
from app.schemas.document import DocumentOut

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ⬆⬆⬆ КАДЕТ ТЕПЕРЬ МОЖЕТ ЗАГРУЖАТЬ ДОКУМЕНТЫ
@router.post("/", response_model=DocumentOut)
async def upload_document(
    title: str = Form(...),
    category: str | None = Form(None),
    description: str | None = Form(None),
    uploaded_by: int = Form(...),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    _: User = Depends(
        require_role(
            UserRole.ADMIN,
            UserRole.COMMANDER,
            UserRole.TEACHER,
            UserRole.CADET,   # ← ДОБАВИЛИ КАДЕТА
        )
    ),
):
    file_path = None

    if file:
        save_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(save_path, "wb") as f:
            f.write(await file.read())
        file_path = f"/uploads/{file.filename}"

    doc = Document(
        title=title,
        category=category,
        description=description,
        uploaded_by=uploaded_by,
        file_path=file_path,
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


# ⬆⬆⬆ КАДЕТ МОЖЕТ СМОТРЕТЬ ДОКУМЕНТЫ (уже было)
@router.get("/", response_model=List[DocumentOut])
def list_documents(
    category: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(
        require_role(
            UserRole.ADMIN,
            UserRole.COMMANDER,
            UserRole.TEACHER,
            UserRole.CADET,
        )
    ),
):
    q = db.query(Document)
    if category:
        q = q.filter(Document.category == category)
    return q.order_by(Document.uploaded_at.desc()).all()


# ⬆⬆⬆ УДАЛЕНИЕ — ТОЛЬКО АДМИН И КОМАНДИР
@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    doc = db.query(Document).get(doc_id)
    if not doc:
        raise HTTPException(404, "Документ не найден")

    if doc.file_path:
        path = doc.file_path.lstrip("/")
        if os.path.exists(path):
            os.remove(path)

    db.delete(doc)
    db.commit()
    return {"detail": "Документ удалён"}
