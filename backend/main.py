from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel, Field # type: ignore
from typing import List
import json
import time
import PSO
import FA

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
    print("Received barangay data for simulation...")

    # Convert Pydantic objects to a list of simple dictionaries
    barangay_input_data = [b.model_dump() for b in barangays]

    # Call the run_[algo]_simulation function from the algorithm module
    print("--------------------------------------------------------")
    print("\nStarting PSO simulation...")
    pso_result = PSO.run_pso_simulation(barangay_input_data)
    print("PSO simulation finished.\n")
    print("--------------------------------------------------------")
    print("\nStarting FA simulation...")
    fa_result = FA.run_fa_simulation(barangay_input_data)
    print("FA simulation finished.")
    print("--------------------------------------------------------")

    # Result is in array format:
    # [Barangay Name, Personnel Allocation (SRR, Health, Log), Fitness Score, Execution Time]
    return {"message": {"pso": pso_result, "fa": fa_result}}
