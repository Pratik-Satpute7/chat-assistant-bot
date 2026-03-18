# Import required SQLAlchemy components
from sqlalchemy import Column, Text, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

# UUID support
from sqlalchemy.dialects.postgresql import UUID
import uuid

# Import Base class
from database import Base

# Import datetime
from datetime import datetime


class Message(Base):

    # Table name
    __tablename__ = "messages"

    # UUID primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign key referencing sessions table
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))

    # message role
    role = Column(String, nullable=False)

    # message text
    content = Column(Text, nullable=False)

    # timestamp
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationship
    session = relationship("Session", back_populates="messages")