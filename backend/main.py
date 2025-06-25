from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Personnel(BaseModel):
    srr: int
    health: int
    log: int

class BarangayData(BaseModel):
    id: str
    name: str
    waterLevel: float
    personnel: Personnel

    # Login request schema with validation
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


# Root route
@app.get("/")
def read_root():
    return {"message": "Hello, world!"}

# Login endpoint
@app.post("/login")
def login(data: LoginRequest):
    # Example custom validation
    if data.username.lower() == "admin":
        raise HTTPException(status_code=400, detail="Username 'admin' is not allowed")

    return {"message": f"Welcome, {data.username}!"}

# Simulate endpoint to process barangay data
@app.post("/simulate")
def simulate(barangays: List[BarangayData]):
    print("Received barangay data:")
    print(json.dumps([b.model_dump() for b in barangays], indent=2))

    # Simulate a long computation (10–20 seconds)
    delay = 10 + (time.time() % 10)  # Random-ish delay between 10–20
    print(f"Simulating long task for {delay:.1f} seconds...")
    time.sleep(delay)

    # Example dummy processing:
    total = sum(
        b.personnel.srr + b.personnel.health + b.personnel.log for b in barangays
    )
    return {"message": f"{len(barangays)} barangays received. Total personnel: {total}"}
