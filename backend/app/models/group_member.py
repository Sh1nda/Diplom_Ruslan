from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    cadet_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    group = relationship("Group", back_populates="members")
    cadet = relationship("User")
