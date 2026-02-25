from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    commander_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    year = Column(Integer, nullable=True)

    commander = relationship("User", back_populates="groups_commanded")
    members = relationship("GroupMember", back_populates="group", cascade="all, delete")


    discipline_records = relationship(
        "DisciplineRecord",
        back_populates="group",
        cascade="all, delete"
    )
