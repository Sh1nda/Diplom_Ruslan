# backend/app/api/routes_documents.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.user import UserRole, User
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentOut

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentOut)
def upload_document(
    doc_in: DocumentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER)),
):
    doc = Document(**doc_in.dict())
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/", response_model=List[DocumentOut])
def list_documents(
    category: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.COMMANDER, UserRole.TEACHER, UserRole.CADET)),
):
    q = db.query(Document)
    if category:
        q = q.filter(Document.category == category)
    return q.order_by(Document.uploaded_at.desc()).all()
