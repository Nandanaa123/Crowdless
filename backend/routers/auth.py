from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from database import get_db, User
import os

router = APIRouter()

SECRET_KEY = "crowdless-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(body: dict, db: Session = Depends(get_db)):
    name = body.get("name", "").strip()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
    vibe = body.get("vibe", "bookworm")
    vibe_emoji = body.get("vibe_emoji", "📚")
    vibe_title = body.get("vibe_title", "The Quiet Bookworm")

    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="All fields are required")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=name,
        email=email,
        password=hash_password(password),
        vibe=vibe,
        vibe_emoji=vibe_emoji,
        vibe_title=vibe_title,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token({"sub": user.id, "email": user.email})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "vibe": user.vibe,
            "vibe_emoji": user.vibe_emoji,
            "vibe_title": user.vibe_title,
        }
    }

@router.post("/login")
def login(body: dict, db: Session = Depends(get_db)):
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({"sub": user.id, "email": user.email})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "vibe": user.vibe,
            "vibe_emoji": user.vibe_emoji,
            "vibe_title": user.vibe_title,
        }
    }

@router.get("/me")
def get_me(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "vibe": user.vibe,
            "vibe_emoji": user.vibe_emoji,
            "vibe_title": user.vibe_title,
        }
    except:
        raise HTTPException(status_code=401, detail="Invalid token")