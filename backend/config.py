# Import dotenv to load environment variables
from dotenv import load_dotenv

# Import os to access environment variables
import os

# Load variables from .env file
load_dotenv()

# Get database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Get Gemini API key from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# This is used to verify Google login tokens
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")