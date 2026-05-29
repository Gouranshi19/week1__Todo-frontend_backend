from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import collection
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Server running"}

@app.post("/todos")
def create_todo(todo: dict):

    result = collection.insert_one(todo)

    return {
        "message": "Todo created",
        "id": str(result.inserted_id)
    }

@app.get("/todos")
def get_todos():

    todos = []

    for todo in collection.find():

        todo["_id"] = str(todo["_id"])

        todos.append(todo)

    return todos

@app.put("/todos/{id}")
def update_todo(id: str, updated_task: dict):

    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_task}
    )

    return {"message": "Todo updated"}

@app.delete("/todos/{id}")
def delete_todo(id: str):

    collection.delete_one(
        {"_id": ObjectId(id)}
    )

    return {"message": "Todo deleted"}