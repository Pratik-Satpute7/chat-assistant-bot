# Import SQLAlchemy engine
from sqlalchemy import create_engine

# Import session maker
from sqlalchemy.orm import sessionmaker

# Import base class for models
from sqlalchemy.orm import declarative_base

# Import database URL from config
from config import DATABASE_URL


# Create database engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all database models
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()