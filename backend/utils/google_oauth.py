# This file will handle verification of Google OAuth tokens

# Import the id_token module to verify Google tokens
from google.oauth2 import id_token

# Import request module used during token verification used send request to Google server
from google.auth.transport import requests

# Import our project configuration (to access Google Client ID)
from config import GOOGLE_CLIENT_ID


# Function to verify Google ID token
def verify_google_token(token: str):
    
    try:
        # Verify the token with Google servers
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        # Extract user information from token
        user_data = {
            "sub": idinfo["sub"],
            "email": idinfo["email"],        # user's email
            "name": idinfo.get("name"),      # user's name
            "picture": idinfo.get("picture") # user's profile image
        }

        return user_data
        

    except Exception:
        # If token is invalid
        return None
    
    
    ## Extracting field like
    # idinfo = {
#  "sub": "10987654321",
#  "email": "user@gmail.com",
#  "email_verified": True,
#  "name": "User Name",
#  "picture": "https://lh3.googleusercontent.com/...",
#  "given_name": "User",
#  "family_name": "Name"
# }