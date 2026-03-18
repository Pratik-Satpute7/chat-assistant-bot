# Import BaseModel from Pydantic
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


# Schema for sending a message to the AI
class SendMessageRequest(BaseModel):

    # Session to which message belongs
    session_id: str

    # Message sent by user
    message: str
    
    # 🔹 NEW: Response schema for messages
class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        orm_mode = True