import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="min-h-screen bg-purple-50 px-4 py-8 text-gray-800 sm:py-12">
    <section class="mx-auto max-w-2xl">
      <header class="mb-8 flex items-center justify-between gap-4">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-600">
            Your personal space
          </p>
          <h1 class="text-3xl font-bold text-purple-950 sm:text-4xl">
            Study Planner
          </h1>
          <p class="mt-2 text-gray-600">
            Small steps, big progress. ✨
          </p>
        </div>

        <button
          id="theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
          class="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium text-purple-800 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Dark mode
        </button>
      </header>

      <section class="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-7">
        <form id="task-form" class="flex flex-col gap-3 sm:flex-row">
          <label for="task-input" class="sr-only">New task</label>
          <input
            id="task-input"
            type="text"
            maxlength="150"
            placeholder="What do you need to do?"
            class="min-w-0 flex-1 rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
          <button
            type="submit"
            class="rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add task
          </button>
        </form>

        <p id="form-error" class="mt-2 hidden text-sm text-red-600" role="alert"></p>

        <div class="mt-6">
          <label for="search-input" class="mb-2 block text-sm font-medium text-gray-700">
            Search tasks
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Find a task..."
            class="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div class="mt-6 flex flex-wrap gap-2" id="filter-buttons" aria-label="Filter tasks">
          <button type="button" data-filter="all" aria-pressed="true"
            class="rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white">
            All
          </button>
          <button type="button" data-filter="active" aria-pressed="false"
            class="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 hover:bg-purple-200">
            Active
          </button>
          <button type="button" data-filter="completed" aria-pressed="false"
            class="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 hover:bg-purple-200">
            Completed
          </button>
        </div>

        <ul id="task-list" class="mt-6 space-y-3" aria-label="Tasks"></ul>

        <div id="empty-state" class="py-10 text-center">
          <p class="text-3xl" aria-hidden="true">🌱</p>
          <p id="empty-title" class="mt-3 font-semibold text-gray-800">
            Your list is ready!
          </p>
          <p id="empty-message" class="mt-1 text-sm text-gray-500">
            Add your first task and get started.
          </p>
        </div>

        <div class="mt-5 border-t border-purple-100 pt-5">
          <div class="mb-3 flex items-center justify-between gap-3 text-sm">
            <p id="task-counter" aria-live="polite">0 tasks remaining</p>
            <button
              id="clear-completed"
              type="button"
              class="font-medium text-purple-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Clear completed
            </button>
          </div>

          <div
            class="h-2 overflow-hidden rounded-full bg-purple-100"
            role="progressbar"
            aria-label="Task completion progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
            id="progress-track"
          >
            <div id="progress-bar" class="h-full w-0 rounded-full bg-purple-600"></div>
          </div>
          <p id="progress-label" class="mt-2 text-right text-xs text-gray-500">
            0% completed
          </p>
        </div>
      </section>

      <footer class="mt-6 text-center text-sm text-gray-500">
        One task at a time. You've got this! 💜
      </footer>
    </section>
  </main>
`;
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const formError = document.querySelector("#form-error");
const emptyState = document.querySelector("#empty-state");
const taskCounter = document.querySelector("#task-counter");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector("#progress-track");
const progressLabel = document.querySelector("#progress-label");

let tasks = [];
let currentFilter = "all";

function addTask(text) {
  const trimmedText = text.trim();

  if (trimmedText === "") {
    showError("Please enter a task.");
    return;
  }

  if (trimmedText.length > 100) {
    showError("Your task must be 100 characters or fewer.");
    return;
  }

  const task = {
    id: Date.now(),
    text: trimmedText,
    completed: false,
  };

  tasks.push(task);
  taskInput.value = "";
  clearError();
  renderTasks();
}

function showError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function clearError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

function updateProgress() {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  let percentage = 0;

  if (totalTasks > 0) {
    percentage = Math.round((completedTasks / totalTasks) * 100);
  }

  progressBar.style.width = percentage + "%";
  progressTrack.setAttribute("aria-valuenow", percentage);
  progressLabel.textContent = percentage + "% completed";

  const remainingTasks = totalTasks - completedTasks;

  if (remainingTasks === 1) {
    taskCounter.textContent = "1 task remaining";
  } else {
    taskCounter.textContent = remainingTasks + " tasks remaining";
  }
}

/**
 * Displays all tasks in the task list.
 */

function renderTasks() {
  taskList.replaceChildren();

  emptyState.classList.toggle("hidden", tasks.length > 0);

  const filteredTasks = tasks.filter(function (task) {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  filteredTasks.forEach(function (task) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const taskText = document.createElement("span");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    listItem.className =
      "flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4";

    checkbox.type = "checkbox";
    checkbox.dataset.taskId = task.id;
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    taskText.textContent = task.text;

    if (task.completed) {
      taskText.className =
        "flex-1 break-words line-through text-gray-400";
    } else {
      taskText.className = "flex-1 break-words";
    }

    editButton.textContent = "Edit";
    editButton.type = "button";
    editButton.dataset.taskId = task.id;
    editButton.className =
      "rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-800 hover:bg-purple-200";

    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.dataset.taskId = task.id;
    deleteButton.className =
      "rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200";

    listItem.append(checkbox, taskText, editButton, deleteButton);
    taskList.append(listItem);
  });

  updateProgress();
}

const filterButtons = document.querySelector("#filter-buttons");

filterButtons.addEventListener("click", function (event) {
  if (!event.target.matches("button[data-filter]")) {
    return;
  }

  currentFilter = event.target.dataset.filter;

  renderTasks();
});

function editTask(taskId, taskText) {
  const task = tasks.find(function (item) {
    return item.id === taskId
  })

  if (!task) {
    return
  }

  const newText = taskText.trim()

  if (newText === '') {
    showError('Task cannot be empty.')
    return
  }

  if (newText.length > 100) {
    showError('Your task must be 100 characters or fewer.')
    return
  }

  task.text = newText
  clearError()
  renderTasks()
}


taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTask(taskInput.value);
});

/**
 * Updates a task's completion status when its checkbox changes.
 */

/**
 * Updates a task's completion status when its checkbox changes.
 */
taskList.addEventListener("change", function (event) {
  if (event.target.matches('input[type="checkbox"]')) {
    const taskId = Number(event.target.dataset.taskId);

    const task = tasks.find(function (item) {
      return item.id === taskId;
    });

    if (task) {
      task.completed = event.target.checked;
      renderTasks();
    }
  }
});

/**
 * Deletes a task after the user confirms.
 */

taskList.addEventListener("click", function (event) {
  if (!event.target.matches("button[data-task-id]")) {
    return
  }

  const taskId = Number(event.target.dataset.taskId)

  // Save the edited task
  if (event.target.textContent === "Save") {
    const listItem = event.target.closest("li")
    const input = listItem.querySelector('input:not([type="checkbox"])')

    editTask(taskId, input.value)
    return
  }

  // Open the task for editing
  if (event.target.textContent === "Edit") {
    const task = tasks.find(function (item) {
      return item.id === taskId
    })

    if (!task) {
      return
    }

    const input = document.createElement("input")
    input.type = "text"
    input.value = task.text
    input.maxLength = 100
    input.className =
      "min-w-0 flex-1 rounded-lg border border-purple-300 px-3 py-2"

    const listItem = event.target.closest("li")
    const taskText = listItem.querySelector("span")

    taskText.replaceWith(input)
    event.target.textContent = "Save"
    input.focus()
    input.select()
    return
  }

  // Delete the task after confirmation
  if (event.target.textContent === "Delete") {
    const confirmed = confirm(
      "Are you sure you want to delete this task?"
    )

    if (confirmed) {
      tasks = tasks.filter(function (task) {
        return task.id !== taskId
      })

      renderTasks()
    }
  }
})


taskList.addEventListener('keydown', function (event) {
  if (!event.target.matches('input:not([type="checkbox"])')) {
    return
  }

  const listItem = event.target.closest('li')
  const taskId = Number(
    listItem.querySelector('button[data-task-id]').dataset.taskId
  )

  if (event.key === 'Enter') {
    editTask(taskId, event.target.value)
  }

  if (event.key === 'Escape') {
    renderTasks()
    clearError()
  }
});


renderTasks();
