from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()


# Root route
@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


# Login request schema with validation
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


# Login endpoint
@app.post("/login")
def login(data: LoginRequest):
    # Example custom validation
    if data.username.lower() == "admin":
        raise HTTPException(status_code=400, detail="Username 'admin' is not allowed")

    return {"message": f"Welcome, {data.username}!"}
