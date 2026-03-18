# Import SQLAlchemy components
from sqlalchemy import Column, String, DateTime

# Import relationship to connect tables
from sqlalchemy.orm import relationship

# Import Base from database
from database import Base

# Import datetime
from datetime import datetime

# Import uuid generator
import uuid


# User table model
class User(Base):

    # Table name
    __tablename__ = "users"

    # Primary key using UUID
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)

    # User name from Google OAuth
    name = Column(String)

    # Email from Google OAuth
    email = Column(String, unique=True, index=True)

    # Unique Google user ID
    google_id = Column(String, unique=True)

    # Account creation time
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with sessions
    sessions = relationship("Session", back_populates="user")