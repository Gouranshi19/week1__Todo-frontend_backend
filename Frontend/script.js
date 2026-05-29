const API_URL = "http://127.0.0.1:8000/todos";

async function loadTasks() {

    const response = await fetch(API_URL);

    const tasks = await response.json();

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach((task) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="task-text ${task.done ? 'completed' : ''}">
                ${task.text || task.title}
            </span>

            <div class="buttons">

                <button class="done-btn"
                    onclick="completeTask('${task._id}')">
                    Done
                </button>

                <button class="delete-btn"
                    onclick="deleteTask('${task._id}')">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

async function addTask() {

    const input = document.getElementById("taskInput");

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text,
            done: false
        })
    });

    input.value = "";

    loadTasks();
}

async function completeTask(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            done: true
        })
    });

    loadTasks();
}

async function deleteTask(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}


loadTasks();