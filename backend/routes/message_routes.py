# Import APIRouter and HTTPException from FastAPI
from fastapi import APIRouter, HTTPException, Depends

# Import database session
from database import SessionLocal

# Import Message model
from models.message import Message
import re 

# Import Session model
from models.session import Session

# Import request schema
from schemas.message_schema import SendMessageRequest
from typing import List
from schemas.message_schema import MessageResponse

# Import AI functions
from services.aigemini import generate_ai_response, build_chat_context

# Import uuid to generate unique IDs for messages
import uuid

from database import get_db
from services.auth_service import get_or_create_user

# Create router instance
router = APIRouter()


# -----------------------------------------------------------
# API: Send message and receive AI response
# -----------------------------------------------------------
@router.post("/message/send")
def send_message(data: SendMessageRequest, 
                 db: Session = Depends(get_db), 
                 current_user=Depends(get_or_create_user)
                 ):

    

    # -----------------------------------------------------------
    #  Check if session exists
    # -----------------------------------------------------------
    session = db.query(Session).filter(
    Session.id == data.session_id,
    Session.user_id == current_user.id   
    ).first()

    if not session:
        raise HTTPException(status_code=400, detail="Session not found")

    # -----------------------------------------------------------
    #  Save user message in database
    # -----------------------------------------------------------
    user_message = Message(
        id=str(uuid.uuid4()),
        session_id=data.session_id,
        role="user",
        content=data.message
    )

    db.add(user_message)
    db.commit()

    # -----------------------------------------------------------
    #  Load previous messages for this session
    # We limit to last 15 messages to avoid AI token overflow
    # -----------------------------------------------------------
    previous_messages = db.query(Message).filter(
        Message.session_id == data.session_id
    ).order_by(Message.created_at.asc()).limit(15).all()

    # -----------------------------------------------------------
    #  Build conversation context from previous messages
    # Example:
    # User: Explain gravity
    # AI: Gravity is a force...
    # -----------------------------------------------------------
    context = build_chat_context(previous_messages)

    # -----------------------------------------------------------
    #  Add current user message to the context
    # This is the final prompt sent to Gemini
    # -----------------------------------------------------------
    full_prompt = context + f"\nUser: {data.message}\nAI:"

    # -----------------------------------------------------------
    #  Generate AI response using Gemini
    # -----------------------------------------------------------
    ai_reply = generate_ai_response(full_prompt, data.model)#  pass model from request
    #print("MODEL USED:", data.model)
    # -----------------------------------------------------------
    #  Save AI response in database
    # -----------------------------------------------------------
    ai_message = Message(
        id=str(uuid.uuid4()),
        session_id=data.session_id,
        role="assistant",
        content=ai_reply
    )

    db.add(ai_message)
    db.commit()

    # -----------------------------------------------------------
    #  Return AI response to frontend
    # -----------------------------------------------------------
    return {
        "answer": ai_reply
    }


# -----------------------------------------------------------
# API: Get chat history for a session
# -----------------------------------------------------------
@router.get("/message/history/{session_id}", response_model=List[MessageResponse])
def get_messages(session_id: str,
                 db:Session = Depends(get_db),
                 current_user=Depends(get_or_create_user)
                 ):


    # Fetch all messages for the session
    messages = (
        db.query(Message)
        .join(Session, Message.session_id == Session.id)   
        .filter(
            Message.session_id == session_id,
            Session.user_id == current_user.id
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    return messages


# api for session auto rename
