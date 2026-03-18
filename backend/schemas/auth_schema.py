# Import BaseModel from Pydantic
# Pydantic is used by FastAPI to validate request data
from pydantic import BaseModel


# This schema defines the structure of the request
# that will be sent from the frontend during Google login
class GoogleLoginRequest(BaseModel):

    # The Google ID token received after Google OAuth login
    token: str