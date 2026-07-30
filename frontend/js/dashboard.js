

// ================= USER =================

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
let editingTaskId = null;
let currentPage = 1;

console.log("User:", user);
console.log("Token:", token);

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

if (user) {
    document.getElementById("welcomeUser").innerText =
        `Welcome, ${user.name}`;
}

// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully.");

    window.location.href = "login.html";

});

// ================= GET TASKS =================
async function getTasks(page = 1) {

    try {

        const search = document.getElementById("search").value;
        const status = document.getElementById("filterStatus").value;
        const sort = document.getElementById("sortTasks").value;

        const response = await fetch(
            `http://localhost:5000/api/tasks?search=${search}&status=${status}&sort=${sort}&page=${page}&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(data);

        displayTasks(data.tasks);
        updateStats(data.totalTasks,
                    data.pendingTasks,
                    data.progressTasks,
                    data.completedTasks);
        renderPagination(data.currentPage, data.totalPages);

    } catch (error) {

        console.error(error);

    }

}
getTasks();

// ================= ADD TASK =================

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const status = document.getElementById("status").value;
    const sort = document.getElementById("sortTasks").value;

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    try {

        let url = "http://localhost:5000/api/tasks";
        let method = "POST";

        if (editingTaskId) {
            url = `http://localhost:5000/api/tasks/${editingTaskId}`;
            method = "PUT";
        }

        const response = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                title,
                description,
                status
            })

        });

        const data = await response.json();

        if (data.success) {

            alert(
                editingTaskId
                    ? "Task Updated Successfully!"
                    : "Task Added Successfully!"
            );

            taskForm.reset();

            editingTaskId = null;

            document.getElementById("submitBtn").innerText = "Add Task";

            getTasks();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});

function displayTasks(tasks) {

    const taskContainer = document.getElementById("taskContainer");

    taskContainer.innerHTML = "";

    if (tasks.length === 0) {

        taskContainer.innerHTML = `
            <div class="text-center text-gray-500">
                No Tasks Found
            </div>
        `;

        return;
    }

    tasks.forEach(task => {

        taskContainer.innerHTML += `

        <div class="bg-white rounded-xl shadow p-5">

            <div class="flex justify-between">

                <div>

                    <h2 class="text-xl font-bold">
                        ${task.title}
                    </h2>

                    <p class="text-gray-600 mt-2">
                        ${task.description}
                    </p>

                </div>

                <span class="font-semibold text-blue-600">
                    ${task.status}
                </span>

            </div>

            <div class="mt-4 flex gap-3">

                <button
                    onclick="editTask('${task._id}','${task.title}','${task.description}','${task.status}')"
                    class="bg-yellow-500 text-white px-4 py-2 rounded">

                    Edit

                </button>

                <button
                    onclick="deleteTask('${task._id}')"
                    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}
function updateStats(total, pending, progress, completed) {

    document.getElementById("totalTasks").innerText = total;

    document.getElementById("pendingTasks").innerText = pending;

    document.getElementById("progressTasks").innerText = progress;

    document.getElementById("completedTasks").innerText = completed;

}

function renderPagination(currentPage, totalPages) {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    // Previous Button
    pagination.innerHTML += `
        <button
            onclick="getTasks(${currentPage - 1})"
            ${currentPage === 1 ? "disabled" : ""}
            class="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">

            Previous

        </button>
    `;

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `
            <button
                onclick="getTasks(${i})"
                class="${
                    i === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                } px-4 py-2 rounded">

                ${i}

            </button>
        `;

    }

    // Next Button
    pagination.innerHTML += `
        <button
            onclick="getTasks(${currentPage + 1})"
            ${currentPage === totalPages ? "disabled" : ""}
            class="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">

            Next

        </button>
    `;

}


// ================= DELETE TASK =================

async function deleteTask(taskId) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/tasks/${taskId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Task Deleted Successfully!");

            getTasks();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

}

// ================= EDIT TASK =================

function editTask(id, title, description, status) {

    editingTaskId = id;

    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    document.getElementById("status").value = status;

    document.getElementById("submitBtn").innerText = "Update Task";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", () => {
    getTasks(1);
});

const filterStatus = document.getElementById("filterStatus");

filterStatus.addEventListener("change", () => {

    getTasks();

});

getTasks();

const sortTasks = document.getElementById("sortTasks");

sortTasks.addEventListener("change", () => {

    getTasks();

});