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
    # 1️⃣ Check if session exists
    # -----------------------------------------------------------
    session = db.query(Session).filter(
    Session.id == data.session_id,
    Session.user_id == current_user.id   # ✅ secure
    ).first()

    if not session:
        raise HTTPException(status_code=400, detail="Session not found")

    # -----------------------------------------------------------
    # 2️⃣ Save user message in database
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
    # 3️⃣ Load previous messages for this session
    # We limit to last 15 messages to avoid AI token overflow
    # -----------------------------------------------------------
    previous_messages = db.query(Message).filter(
        Message.session_id == data.session_id
    ).order_by(Message.created_at.asc()).limit(15).all()

    # -----------------------------------------------------------
    # 4️⃣ Build conversation context from previous messages
    # Example:
    # User: Explain gravity
    # AI: Gravity is a force...
    # -----------------------------------------------------------
    context = build_chat_context(previous_messages)

    # -----------------------------------------------------------
    # 5️⃣ Add current user message to the context
    # This is the final prompt sent to Gemini
    # -----------------------------------------------------------
    full_prompt = context + f"\nUser: {data.message}\nAI:"

    # -----------------------------------------------------------
    # 6️⃣ Generate AI response using Gemini
    # -----------------------------------------------------------
    ai_reply = generate_ai_response(full_prompt, data.model)# ✅ pass model from request
    #print("MODEL USED:", data.model)
    # -----------------------------------------------------------
    # 7️⃣ Save AI response in database
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
    # 8️⃣ Return AI response to frontend
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
        .join(Session, Message.session_id == Session.id)   # ✅ FIX
        .filter(
            Message.session_id == session_id,
            Session.user_id == current_user.id
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    return messages


# api for session auto rename
@router.post("/session/smart-title")
def generate_title(data: dict):
    try:
        first_message = data.get("message", "").strip()

        # 🔹 Small / useless input → fallback
        if not first_message or len(first_message) < 5:
            return {"title": "New Chat"}

        # 🔹 Strict prompt to avoid multiple options
        prompt = f"""
        Generate ONLY ONE short chat title (max 4 words).

        Rules:
        - Only one title
        - No numbering
        - No multiple options
        - No explanation
        - No symbols like *, #, :
        - No full sentence

        Message: {first_message}
        """

        ai_response = generate_ai_response(prompt)
        title = ai_response.strip()
        # 🔹 Handle AI failure response → fallback to first 10 words of user input
        if "temporarily unavailable" in title.lower():
            fallback_title = " ".join(first_message.split()[:10])
            return {"title": fallback_title or "New Chat..."}

        # 🔹 If AI returns list → extract FIRST valid title

        # Remove "Here are..." type prefix
        title = re.sub(r"^(here are.*?:)", "", title, flags=re.IGNORECASE).strip()
        
        # 🔹 Handle inline numbered options (single line case)
        inline_numbered = re.findall(r"\d+\.\s*([^0-9]+?)(?=\d+\.|$)", title)

        # Extract bullet points (*, -, •)
        bullet_titles = re.findall(r"[*\-•]\s*(.+)", title)

        # Extract numbered list (1. 2. etc.)
        numbered_titles = re.findall(r"\d+\.\s*(.+)", title)

        if inline_numbered:
            title = inline_numbered[0]
        elif bullet_titles:
            title = bullet_titles[0]
        elif numbered_titles:
            title = numbered_titles[0]
        else:
            title = title.split("\n")[0]

        # 🔹 Remove numbering like "1. Title"
        title = re.sub(r"^\d+\.\s*", "", title)

        # 🔹 Remove unwanted symbols
        title = re.sub(r"[*#:`]", "", title).strip()

        # 🔹 Cut to max 4 words
        title = " ".join(title.split()[:4])

        # 🔹 Final validation
        if (
            not title or
            len(title) > 40 or
            "option" in title.lower() or
            "here are" in title.lower()
        ):
            return {"title": "New Chat"}

        return {"title": title}

    except Exception:
        return {"title": "New Chat"}