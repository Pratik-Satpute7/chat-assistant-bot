from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.google_oauth import verify_google_token


def get_or_create_user(
    authorization: str = Header(...),   # Expect "Bearer <GOOGLE_ID_TOKEN>"
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency that:
    1. Extracts Google ID token from Authorization header
    2. Verifies it with Google
    3. Creates the user in DB if it doesn't exist
    4. Returns a User object
    """

    # Check if header starts with "Bearer "
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    print("in get_or_crete",token)
    # Verify token with Google
    user_data = verify_google_token(token)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    google_id = user_data["sub"]
    email = user_data.get("email")
    name = user_data.get("name")
    picture = user_data.get("picture")

    # Check if user exists
    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        # Create new user
        user = User(
            google_id=google_id,
            email=email,
            name=name,
            picture=picture
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user