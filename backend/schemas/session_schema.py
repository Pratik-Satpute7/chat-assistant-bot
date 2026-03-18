# Import BaseModel from Pydantic
from pydantic import BaseModel


# Schema for creating a new chat session
class CreateSessionRequest(BaseModel):
    # Title of the chat session
    title: str
    
    ## Title of the chat sessiorename
class RenameSessionRequest(BaseModel):
    title: str