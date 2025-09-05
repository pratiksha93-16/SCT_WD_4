const addBtn = document.getElementById("addBtn");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const pagination = document.getElementById("pagination");

const todos = [];
const itemsPerPage = 3;
let currentPage = 1;

const dateTimeInput = document.createElement("input");
dateTimeInput.type = "datetime-local";
dateTimeInput.id = "dateTimeInput";
dateTimeInput.className = "datetime-input";
todoInput.insertAdjacentElement("afterend", dateTimeInput);

addBtn.addEventListener("click", () => {
  const taskText = todoInput.value.trim();
  const dueDate = dateTimeInput.value;

  if (taskText === "") {
    showErrorMessage("Please enter a task");
    return;
  }

  todos.unshift({
    text: taskText,
    completed: false,
    dueDate: dueDate || null,
  });

  todoInput.value = "";
  dateTimeInput.value = "";
  currentPage = 1;
  renderTodos();
  renderPagination();
});

const renderTodos = () => {
  todoList.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentTodos = todos.slice(start, end);

  currentTodos.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      renderTodos();
    });

    const taskText = document.createElement("span");
    taskText.className = "todo-text";
    taskText.textContent = task.text;
    if (task.completed) {
      taskText.style.textDecoration = "line-through";
      taskText.style.opacity = "0.6";
    }

    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    if (task.dueDate) {
      const formatted = new Date(task.dueDate).toLocaleString();
      dueDateSpan.textContent = ` (Due: ${formatted})`;
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      editTask(start + index, li, task);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteTask(start + index);
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(dueDateSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
};

const renderPagination = () => {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(todos.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn";
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTodos();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
};

function editTask(index, li, task) {
  li.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className = "todo-text";

  const dateInput = document.createElement("input");
  dateInput.type = "datetime-local";
  dateInput.value = task.dueDate || "";

  const saveBtn = document.createElement("button");
  saveBtn.className = "save-btn";
  saveBtn.textContent = "Save";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-btn";
  cancelBtn.textContent = "Cancel";

  const editWrapper = document.createElement("div");
  editWrapper.className = "edit-wrapper";

  editWrapper.appendChild(input);
  editWrapper.appendChild(dateInput);

  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";
  btnGroup.appendChild(saveBtn);
  btnGroup.appendChild(cancelBtn);

  li.appendChild(editWrapper);
  li.appendChild(btnGroup);

  saveBtn.addEventListener("click", () => {
    const updatedTask = input.value.trim();
    if (updatedTask !== "") {
      todos[index].text = updatedTask;
      todos[index].dueDate = dateInput.value || null;
      renderTodos();
    } else {
      showErrorMessage("Task cannot be empty.");
    }
  });

  cancelBtn.addEventListener("click", () => {
    renderTodos();
  });
}

function deleteTask(index) {
  todos.splice(index, 1);
  if ((currentPage - 1) * itemsPerPage >= todos.length) {
    currentPage = Math.max(currentPage - 1, 1);
  }
  renderTodos();
  renderPagination();
}

function showErrorMessage(message) {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}
