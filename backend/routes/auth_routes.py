# Import router from FastAPI
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
# Import database dependency
from database import get_db

# Import user model
from models.user import User

# Import request schema
from schemas.auth_schema import GoogleLoginRequest

# Import google token verification function
from utils.google_oauth import verify_google_token

# Import uuid
import uuid

import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter()


@router.post("/auth/google-login")
def google_login(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db)   # <-- dependency injection
):

    # Step 1 — Verify the token with Google
    user_info = verify_google_token(data.token)
    idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
    
    
    
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    # Step 2 — Check if user exists
    user = db.query(User).filter(User.email == user_info["email"]).first()

    # Step 3 — If user doesn't exist create one
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            email=user_info["email"],
            google_id=user_info["sub"],
            name=user_info["name"]
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    # Step 4 — Return response
    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user_info.get("picture")
    }