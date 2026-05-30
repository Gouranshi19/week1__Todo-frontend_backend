let currentFilter = "all";
const API = "http://127.0.0.1:8000/todos";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];

function updateTaskCounter() {
    const counter = document.getElementById("taskCount");
    if (counter) {
        counter.textContent = tasks.length;
    }
}
function renderTasks() {

    taskList.innerHTML = "";

    tasks.sort((a, b) => {
        if (a.done === b.done) return 0;
        return a.done ? 1 : -1;
    });

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.done);
    }
    else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.done);
    }

    filteredTasks.forEach(todo => {

        taskList.innerHTML += `
        <li>

            <span class="${todo.done ? 'completed' : ''}">
                ${todo.text}
            </span>

            <div>

                <button
                    class="done-btn"
                    onclick="toggleTask('${todo._id}', ${todo.done})"
                >
                    ${todo.done ? 'Undo' : 'Done'}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${todo._id}')"
                >
                    Delete
                </button>

            </div>

        </li>
        `;
    });

    updateTaskCounter();
}

async function loadTasks() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        tasks = await response.json();

        renderTasks();
    }
    catch (error) {
        console.error(error);
        alert("Could not load tasks");
    }
}

async function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                done: false
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        taskInput.value = "";

        await loadTasks();
    }
    catch (error) {
        console.error(error);
        alert("Could not add task");
    }
}

async function toggleTask(id, currentDone) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                done: !currentDone
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        await loadTasks();
    }
    catch (error) {
        console.error(error);
        alert("Could not update task");
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        await loadTasks();
    }
    catch (error) {
        console.error(error);
        alert("Could not delete task");
    }
}

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

loadTasks();