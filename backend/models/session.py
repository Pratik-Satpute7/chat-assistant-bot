# Import required SQLAlchemy components
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

# Import relationship for table linking
from sqlalchemy.orm import relationship

# For UUID 
from sqlalchemy.dialects.postgresql import UUID
import uuid

# Import Base from database
from database import Base

# Import datetime
from datetime import datetime


# Session table model
class Session(Base):

    # Table name
    __tablename__ = "sessions"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Name of the chat session
    session_name = Column(String)

    # Foreign key linking to user
    user_id = Column(String, ForeignKey("users.id"))

    # Time session created
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with user
    user = relationship("User", back_populates="sessions")

    # Relationship with messages
    messages = relationship("Message", back_populates="session")