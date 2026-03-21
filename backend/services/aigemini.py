# Import Gemini SDK
import google.generativeai as genai

# Import Gemini API key from config file
from config import GEMINI_API_KEY


# Configure Gemini client using API key
genai.configure(api_key=GEMINI_API_KEY)

# for model in genai.list_models():
#      print(" Gemini model Nmaes : : : ",model.name)

# Load Gemini 2.0 Flash model
# This model is optimized for fast responses and chat applications
# model = genai.GenerativeModel("gemini-2.5-flash")


# -----------------------------------------------------------
# Function: build_chat_context
# Purpose:
# Convert previous messages from database into a conversation
# format that Gemini can understand.
# -----------------------------------------------------------
def build_chat_context(messages):

    # This variable will store the full conversation history
    context = ""

    # Loop through all previous messages of the session
    for msg in messages:
        # Add user message to context
        if msg.role == "user":
            context += f"User: {msg.content}\n"

        # Add AI response to context
        elif msg.role == "assistant":
            context += f"AI: {msg.content}\n"
            
    # Return the formatted conversation
    return context


# -----------------------------------------------------------
# Function: generate_ai_response
# Purpose:
# Send message or conversation prompt to Gemini and return response
# -----------------------------------------------------------
def generate_ai_response(user_message: str, model_name="gemini-2.5-flash"):
    try:
        # ✅ create model dynamically
        model = genai.GenerativeModel(model_name)

        # Send message
        response = model.generate_content(user_message)

        return response.text

    except Exception as e:
        print("Gemini API Error:", e)
        return "AI service temporarily unavailable. Please try again later."