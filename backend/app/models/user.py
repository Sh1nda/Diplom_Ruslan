from sqlalchemy import Boolean, Column, Enum, Integer, String
import enum
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    COMMANDER = "COMMANDER"
    TEACHER = "TEACHER"
    CADET = "CADET"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    full_name = Column(String(128), nullable=False)
    hashed_password = Column(String(256), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CADET)
    is_active = Column(Boolean, default=True)

    # группы, которыми командует
    groups_commanded = relationship("Group", back_populates="commander")

    # группы, в которых состоит кадет (many-to-many)
    groups = relationship(
        "Group",
        secondary="group_members",
        back_populates="members"
    )
