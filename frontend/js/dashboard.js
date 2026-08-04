// ================= USER =================

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
let editingTaskId = null;
let deleteTaskId = null;
let currentPage = 1;
let documentTasks = [];

console.log("User:", user);
console.log("Token:", token);

if (!token) {
  showToast("Please login first.");
  window.location.href = "login.html";
}

if (user) {
  document.getElementById("welcomeUser").innerText = `Welcome, ${user.name}`;
}

// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  showToast("Logged out successfully.");

  window.location.href = "login.html";
});

function showLoader() {
  document.getElementById("loader").classList.remove("hidden");

  document.getElementById("loader").classList.add("flex");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");

  document.getElementById("loader").classList.remove("flex");
}

// ================= GET TASKS =================
async function getTasks(page = 1) {
  showLoader();

  try {
    const search = document.getElementById("search").value;
    const status = document.getElementById("filterStatus").value;
    const sort = document.getElementById("sortTasks").value;

    const response = await fetch(
      `https://task-management-app-jvb6.onrender.com/api/tasks?search=${search}&status=${status}&sort=${sort}&page=${page}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    documentTasks = data.tasks;

    console.log(data);

    displayTasks(data.tasks);
    updateStats(
      data.totalTasks,
      data.pendingTasks,
      data.progressTasks,
      data.completedTasks,
    );
    renderPagination(data.currentPage, data.totalPages);

    hideLoader();
  } catch (error) {
    hideLoader();

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
  const dueDate = document.getElementById("dueDate").value;
  const sort = document.getElementById("sortTasks").value;

  if (!title || !description) {
    showToast("Please fill all fields");
    return;
  }

  try {
    showLoader();

    let url = "https://task-management-app-jvb6.onrender.com/api/tasks";
    let method = "POST";

    const response = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title,
        description,
        status,
        dueDate,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast("Task Added Successfully!");

      taskForm.reset();

      getTasks(currentPage);
    } else {
      showToast(data.message);
    }
  } catch (error) {
    hideLoader();

    console.error(error);

    showToast("Something went wrong.");
  }
});

function displayTasks(tasks) {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskContainer.innerHTML = `
            <div class="bg-white rounded-2xl shadow-md p-12 text-center">

                <h2 class="text-2xl font-bold text-gray-800">
                    No Tasks Found
                </h2>

                <p class="text-gray-500 mt-2">
                    Start by creating your first task.
                </p>

            </div>
        `;

    return;
  }

  tasks.forEach((task) => {
    let badgeClass = "";

    switch (task.status) {
      case "Pending":
        badgeClass = "bg-yellow-100 text-yellow-700";
        break;

      case "In Progress":
        badgeClass = "bg-blue-100 text-blue-700";
        break;

      case "Completed":
        badgeClass = "bg-green-100 text-green-700";
        break;
    }

    const createdDate = new Date(task.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const dueDate = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "No Due Date";

      const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

const borderClass = isOverdue
    ? "border-l-4 border-red-500"
    : "";

    taskContainer.innerHTML += `

        <div class="bg-white rounded-2xl shadow-md ${borderClass} hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">

            <div class="flex justify-between items-start">

                <div>

                    <h2 class="text-2xl font-semibold text-gray-800">
                        ${task.title}
                    </h2>

                    <p class="text-gray-500 mt-3 leading-relaxed">
                        ${task.description || "No description available."}
                    </p>

                </div>

                <span class="${badgeClass} px-4 py-2 rounded-full text-sm font-semibold">

                    ${task.status}

                </span>

            </div>

            <div class="flex justify-between items-center mt-6">

               <div class="text-sm text-gray-400">

    <p>Created: ${createdDate}</p>

    <p>Due: ${dueDate}</p>

</div>

                <div class="flex gap-3">

                   <button
    onclick="editTask('${task._id}')"
    class="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition">

    Edit

</button>

                    <button
                        onclick="deleteTask('${task._id}')"
                        class="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition">

                        Delete

                    </button>

                </div>

            </div>

        </div>

        `;
  });
}
// function updateStats(total, pending, progress, completed) {
//   document.getElementById("totalTasks").innerText = total;

//   document.getElementById("pendingTasks").innerText = pending;

//   document.getElementById("progressTasks").innerText = progress;

//   document.getElementById("completedTasks").innerText = completed;
// }

function updateStats(total, pending, progress, completed) {
  console.log("Updating stats...");

  const totalEl = document.getElementById("totalTasks");
  const pendingEl = document.getElementById("pendingTasks");
  const progressEl = document.getElementById("progressTasks");
  const completedEl = document.getElementById("completedTasks");

  console.log(totalEl, pendingEl, progressEl, completedEl);

  totalEl.innerText = total;
  pendingEl.innerText = pending;
  progressEl.innerText = progress;
  completedEl.innerText = completed;

  console.log("Updated!");
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
                  i === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
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
function deleteTask(taskId) {
  deleteTaskId = taskId;

  document.getElementById("deleteModal").classList.remove("hidden");

  document.getElementById("deleteModal").classList.add("flex");
}
document.getElementById("confirmDelete").addEventListener("click", async () => {
  try {
    showLoader();

    const response = await fetch(
      `https://task-management-app-jvb6.onrender.com/api/tasks/${deleteTaskId}`,

      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    hideLoader();

    const data = await response.json();

    if (data.success) {
      showToast("Task deleted successfully!");

      getTasks(currentPage);
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    hideLoader();

    console.error(error);

    showToast("Something went wrong.", "error");
  }

  document.getElementById("deleteModal").classList.add("hidden");

  document.getElementById("deleteModal").classList.remove("flex");
});
document.getElementById("cancelDelete").addEventListener("click", () => {
  document.getElementById("deleteModal").classList.add("hidden");

  document.getElementById("deleteModal").classList.remove("flex");
});

// ================= EDIT TASK =================

function editTask(id) {
  const task = documentTasks.find((task) => task._id === id);

  if (!task) return;

  editingTaskId = id;

  document.getElementById("editTitle").value = task.title;
  document.getElementById("editDescription").value = task.description;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editDueDate").value = task.dueDate
    ? task.dueDate.split("T")[0]
    : "";

  document.getElementById("editModal").classList.remove("hidden");
  document.getElementById("editModal").classList.add("flex");
}

document.getElementById("cancelEdit").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");

  document.getElementById("editModal").classList.remove("flex");
});

document.getElementById("saveEdit").addEventListener("click", async () => {
  showLoader();

  try {
    const response = await fetch(
      `https://task-management-app-jvb6.onrender.com/api/tasks/${editingTaskId}`,

      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: document.getElementById("editTitle").value,

          description: document.getElementById("editDescription").value,

          status: document.getElementById("editStatus").value,

          dueDate: document.getElementById("editDueDate").value,
        }),
      },
    );

    const data = await response.json();

    hideLoader();

    if (data.success) {
      showToast("Task updated successfully!");

      document.getElementById("editModal").classList.add("hidden");

      document.getElementById("editModal").classList.remove("flex");

      getTasks(currentPage);
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    hideLoader();

    console.error(error);

    showToast("Something went wrong.", "error");
  }
});

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
