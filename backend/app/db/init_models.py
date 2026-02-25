# Этот файл просто импортирует все модели, чтобы SQLAlchemy их увидел
from app.models.user import User
from app.models.course import Course
from app.models.schedule import ScheduleItem
from app.models.attendance import Attendance
from app.models.discipline import DisciplineRecord
from app.models.document import Document
