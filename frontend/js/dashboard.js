console.log("Dashboard JS Loaded");

// ================= USER =================

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

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
async function getTasks() {

    try {

        const response = await fetch("http://localhost:5000/api/tasks", {

            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        console.log(data);

        displayTasks(data.tasks);

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

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/tasks", {

            method: "POST",

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

            alert("Task Added Successfully!");

            taskForm.reset();

            getTasks();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

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
                    class="bg-yellow-500 text-white px-4 py-2 rounded">

                    Edit

                </button>

                <button
                    class="bg-red-500 text-white px-4 py-2 rounded">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}