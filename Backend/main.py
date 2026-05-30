from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from bson import ObjectId
from database import collection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=100)
    done: bool = False

class TodoUpdate(BaseModel):
    done: bool

def serialize_todo(todo):
    return {
        "_id": str(todo["_id"]),
        "text": todo.get("text", ""),
        "done": todo.get("done", False)
    }

def validate_object_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Todo ID"
        )
    return ObjectId(id)

@app.get("/")
def home():
    return {"message": "Server Running"}

@app.get("/todos")
def get_todos():
    todos = collection.find().sort("_id", -1)
    return [serialize_todo(todo) for todo in todos]

@app.post("/todos")
def add_todo(todo: TodoCreate):
    result = collection.insert_one(todo.model_dump())

    return {
        "message": "Todo added",
        "id": str(result.inserted_id)
    }

@app.put("/todos/{id}")
def update_todo(id: str, todo: TodoUpdate):

    obj_id = validate_object_id(id)

    result = collection.update_one(
        {"_id": obj_id},
        {"$set": {"done": todo.done}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    return {"message": "Updated"}

@app.delete("/todos/{id}")
def delete_todo(id: str):

    obj_id = validate_object_id(id)

    result = collection.delete_one(
        {"_id": obj_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    return {"message": "Deleted"}