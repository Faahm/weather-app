import state from "./state";
import storage from "./storage";
import projectFunctions from "./projectFunctions";
import todoFunctions from "./todoFunctions";
import modal from "./modal";

const projectsContainer = document.querySelector("[data-projects]");
const todosContainer = document.querySelector("[data-todos]");
const todoTemplate = document.getElementById("todo-template");
const projectDisplayContainer = document.querySelector(
  "[data-project-display-container]"
);
const projectTitleElement = document.querySelector("[data-project-title]");
const projectTitleEditBtn = document.querySelector(
  "[data-project-title-edit-btn]"
);

const priorityMapping = {
  green: "Low",
  orange: "Medium",
  red: "High",
};

let currentTodoId = null;

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function renderProjects() {
  const projects = state.getProjects();
  projects.forEach((project) => {
    const projectItem = document.createElement("li");
    projectItem.dataset.projectId = project.id;
    projectItem.classList.add("project-item");
    projectItem.innerText = project.title;
    projectsContainer.appendChild(projectItem);
  });
}

function renderTodos(selectedProject) {
  selectedProject.todos.forEach((todo) => {
    const todoElement = document.importNode(todoTemplate.content, true);
    const checkbox = todoElement.querySelector("[data-todo-checkbox]");
    checkbox.id = todo.id;
    checkbox.checked = todo.complete;
    checkbox.addEventListener("click", todoFunctions.handleTodoItemCheck);
    const label = todoElement.querySelector("[data-todo-label]");
    label.htmlFor = todo.id;
    label.append(todo.title);
    label.addEventListener("click", (e) => handleViewTodoDetails(e));
    const dueDate = todoElement.getElementById("due");
    dueDate.innerText = `Due date: ${todo.dueDate}`;
    const priority = todoElement.getElementById("priority");
    priority.style.backgroundColor = todo.priority;

    todosContainer.appendChild(todoElement);
  });
}

function render() {
  clearElement(projectsContainer);
  renderProjects();
  const projects = state.getProjects();
  const selectedProjectId = state.getSelectedProjectId();

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  if (selectedProjectId == null || selectedProject == null) {
    projectDisplayContainer.style.display = "none";
  } else {
    projectDisplayContainer.style.display = "";
    projectTitleElement.innerText = selectedProject.title;
    clearElement(todosContainer);
    renderTodos(selectedProject);
  }
}

function handleEditProjectTitle() {
  const isEditing = projectTitleEditBtn.innerText === "Save";
  if (isEditing) {
    const projectTitleInput = document.querySelector(".project-title-input");
    const newTitle = projectTitleInput.value.trim();
    if (newTitle && newTitle !== projectTitleElement.innerText) {
      projectFunctions.updateProjectTitle(
        state.getSelectedProjectId(),
        newTitle
      );
    }
    projectTitleElement.style.display = "block";
    projectTitleEditBtn.innerText = "Edit";
    projectTitleInput.remove();
    render();
  } else {
    const projectTitle = projectTitleElement.innerText;
    projectTitleElement.style.display = "none";

    const projectTitleInput = document.createElement("input");
    projectTitleInput.type = "text";
    projectTitleInput.value = projectTitle;
    projectTitleInput.classList.add("project-title-input");

    projectTitleElement.parentElement.insertBefore(
      projectTitleInput,
      projectTitleEditBtn
    );
    projectTitleInput.focus();
    projectTitleEditBtn.innerText = "Save";
    projectTitleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        projectTitleEditBtn.click();
      }
    });
  }
}

function handleViewTodoDetails(e) {
  e.stopPropagation();
  const selectedProjectId = state.getSelectedProjectId();
  const projects = state.getProjects();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  const todoId = e.currentTarget.getAttribute("for");
  currentTodoId = todoId;
  const selectedTodo = selectedProject.todos.find((todo) => todo.id === todoId);

  document.querySelector("[data-todo-title]").innerText = selectedTodo.title;
  document.querySelector("[data-todo-title-input]").value = selectedTodo.title;
  document.querySelector("[data-todo-description]").innerText =
    selectedTodo.description;
  document.querySelector("[data-todo-description-input]").value =
    selectedTodo.description;
  document.querySelector(
    "[data-todo-due-date]"
  ).innerText = `Due date: ${selectedTodo.dueDate}`;
  document.querySelector("[data-todo-due-date-input]").value =
    selectedTodo.dueDate;
  document.querySelector("[data-todo-priority]").innerText = `Priority: ${
    priorityMapping[selectedTodo.priority]
  }`;
  document.querySelector("[data-todo-priority-input]").value =
    selectedTodo.priority;

  const deleteButton = document.querySelector("[data-delete-todo-button]");
  deleteButton.onclick = () => todoFunctions.handleDeleteTodoItem(todoId);

  modal.openModal("view-todo");
}

function handleEditTodoElement(
  editBtn,
  displayElement,
  inputElement,
  saveCallback
) {
  const isEditing = editBtn.innerText === "Save";
  if (isEditing) {
    const newValue = inputElement.value.trim();
    saveCallback(newValue);
    displayElement.innerText = newValue;
    displayElement.style.display = "block";
    inputElement.classList.add("hidden");
    editBtn.innerText = "Edit";
    storage.save();
    render();
  } else {
    inputElement.value = displayElement.innerText;
    displayElement.style.display = "none";
    inputElement.classList.remove("hidden");
    inputElement.focus();
    editBtn.innerText = "Save";
  }
}

document
  .querySelector("[data-edit-todo-title]")
  .addEventListener("click", (e) => {
    handleEditTodoElement(
      e.target,
      document.querySelector("[data-todo-title]"),
      document.querySelector("[data-todo-title-input]"),
      (newValue) =>
        todoFunctions.updateTodoElement(currentTodoId, "title", newValue)
    );
  });

document
  .querySelector("[data-edit-todo-description]")
  .addEventListener("click", (e) => {
    handleEditTodoElement(
      e.target,
      document.querySelector("[data-todo-description]"),
      document.querySelector("[data-todo-description-input]"),
      (newValue) =>
        todoFunctions.updateTodoElement(currentTodoId, "description", newValue)
    );
  });

document
  .querySelector("[data-edit-todo-due-date]")
  .addEventListener("click", (e) => {
    handleEditTodoElement(
      e.target,
      document.querySelector("[data-todo-due-date]"),
      document.querySelector("[data-todo-due-date-input]"),
      (newValue) =>
        todoFunctions.updateTodoElement(currentTodoId, "dueDate", newValue)
    );
  });

document
  .querySelector("[data-edit-todo-priority]")
  .addEventListener("click", (e) => {
    handleEditTodoElement(
      e.target,
      document.querySelector("[data-todo-priority]"),
      document.querySelector("[data-todo-priority-input]"),
      (newValue) =>
        todoFunctions.updateTodoElement(currentTodoId, "priority", newValue)
    );
  });

projectTitleEditBtn.addEventListener("click", handleEditProjectTitle);

document
  .querySelector("[data-todo-title-input]")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.querySelector("[data-edit-todo-title]").click();
    }
  });

document
  .querySelector("[data-todo-description-input]")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.querySelector("[data-edit-todo-description]").click();
    }
  });

document
  .querySelector("[data-todo-due-date-input]")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.querySelector("[data-edit-todo-due-date]").click();
    }
  });

document
  .querySelector("[data-todo-priority-input]")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.querySelector("[data-edit-todo-priority]").click();
    }
  });

projectsContainer.addEventListener("click", (e) => {
  let selectedProjectId = state.getSelectedProjectId();
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    state.setSelectedProjectId(selectedProjectId);
    storage.save();
    render();
  }
});

// todosContainer.addEventListener("click", (e) => {
//   if (e.target.tagName.toLowerCase() === "label") {
//     handleViewTodoDetails(e);
//   }
// });

export default {
  todosContainer,
  clearElement,
  renderProjects,
  renderTodos,
  render,
};
