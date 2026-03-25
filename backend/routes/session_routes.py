from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
import uuid

# Models
from models.session import Session as ChatSession
from models.user import User

# Schemas
from schemas.session_schema import CreateSessionRequest, RenameSessionRequest

# Dependencies
from database import get_db
from services.auth_service import get_or_create_user

router = APIRouter()


# -------------------------------
# Create new chat session
# -------------------------------
@router.post("/session/create")
def create_session(
    data: CreateSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_or_create_user)
):
    new_session = ChatSession(
        id=uuid.uuid4(),
        session_name=data.title,
        user_id=current_user.id
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {
        "message": "Session created",
        "session_id": str(new_session.id),
        "title": new_session.session_name,
        "created_at": new_session.created_at   
    }


# -------------------------------
# List all sessions of current user
# -------------------------------
@router.get("/session/list")
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_or_create_user)
):
    sessions = db.query(ChatSession)\
        .filter(ChatSession.user_id == current_user.id)\
        .order_by(desc(ChatSession.created_at))\
        .all()

    return [
        {
            "id": str(session.id),
            "title": session.session_name,
            "created_at": session.created_at
        }
        for session in sessions
    ]


# -------------------------------
# Delete a session
# -------------------------------
@router.delete("/session/delete/{session_id}")
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_or_create_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()

    return {"message": "Session deleted"}


# -------------------------------
# Rename a session
# -------------------------------
@router.put("/session/rename/{session_id}")
def rename_session(
    session_id: str,
    data: RenameSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_or_create_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.session_name = data.title
    db.commit()
    db.refresh(session)

    return {
        "message": "Session renamed successfully",
        "session_id": str(session.id),
        "new_title": session.session_name
    }
    
    
# -------------------------------
# Rename a session Automatically based on first user message
# -------------------------------
@router.post("/session/generate-title")
def generate_smart_title(data: dict):
    try:
        first_message = data.get("message", "").strip()

        #  Small / useless input → fallback
        if not first_message or len(first_message) < 5:
            return {"title": "New Chat."}

        
       # ai_response = first_message[:100]  # simulate AI output
        prompt = f"""
            Generate a very short chat title (max 4 words).

            Rules:
            - Only one title
            - No numbering
            - No options
            - No explanation
            - No punctuation at start or end

            Message: {first_message}
            """
        ai_response = generate_ai_response(prompt)
        title = ai_response.strip()

        #  If AI returns list → extract FIRST option
        match = re.search(r"1\.\s*(.*?)(?:\n|$)", title)
        if match:
            title = match.group(1)

        #  Clean markdown / symbols
        title = re.sub(r"[*#`]", "", title).strip()

        #  If still bad → fallback
        if (
            not title or
            len(title) > 40 or
            "options" in title.lower() or
            "unavailable" in title.lower()
        ):
            return {"title": "New Chat.."}

        return {"title": title}

    except Exception:
        return {"title": "New Chat"}