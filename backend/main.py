# Import FastAPI framework
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import database engine and Base class
from database import engine, Base

# Import all database models
from models import user, session, message

# Import authentication routes
from routes import auth_routes

# Import session management routes
from routes import session_routes
# Import message handling routes
from routes import message_routes

# Create FastAPI application instance
app = FastAPI()


# This line automatically creates database tables
# if they do not already exist
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",  # your Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register authentication routes with the app
app.include_router(auth_routes.router)

# Register session management routes with the app
app.include_router(session_routes.router)

# Register message handling routes with the app
app.include_router(message_routes.router)

# Root endpoint to check if server is running
@app.get("/")
def root():
    return {"message": "Backend Running"}