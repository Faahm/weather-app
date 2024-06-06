import storage from "./storage";
import ui from "./ui";
import state from "./state";
import modal from "./modal";

const todosContainer = document.querySelector("[data-todos]");
const newTodoForm = document.querySelector("[data-new-todo-form]");
const newTodoTitle = document.querySelector("[data-new-todo-title]");
const newTodoDescription = document.querySelector(
  "[data-new-todo-description]"
);
const newTodoDueDate = document.querySelector("[data-new-todo-due]");
const newTodoPriority = document.querySelector("[data-new-todo-priority]");
const clearCompleteTodosButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

function createTodo(title, description, dueDate, priority) {
  return {
    id: Date.now().toString(),
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    complete: false,
  };
}

function handleNewTodoSubmit(e) {
  e.preventDefault();
  const todoTitle = newTodoTitle.value;
  const todoDescription = newTodoDescription.value;
  const todoDueDate = newTodoDueDate.value;
  const todoPriority = newTodoPriority.value;

  if (todoTitle == null || todoTitle === "") return;

  const todo = createTodo(
    todoTitle,
    todoDescription,
    todoDueDate,
    todoPriority
  );
  newTodoTitle.value = null;
  newTodoDescription.value = null;
  newTodoDueDate.value = null;
  newTodoPriority.value = null;
  const projects = state.getProjects();
  const selectedProjectId = state.getSelectedProjectId();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.todos.push(todo);
  storage.save();
  ui.render();
  modal.closeModal("new-todo");
}

function handleTodoItemCheck(e) {
  if (
    e.target.tagName.toLowerCase() === "input" &&
    e.target.type === "checkbox"
  ) {
    const selectedProjectId = state.getSelectedProjectId();
    const projects = state.getProjects();
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    const selectedTask = selectedProject.todos.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    storage.save();
  }
}

function updateTodoElement(todoId, key, value) {
  const selectedProjectId = state.getSelectedProjectId();
  const projects = state.getProjects();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  const selectedTodo = selectedProject.todos.find((todo) => todo.id === todoId);

  selectedTodo[key] = value;
  storage.save();
  ui.render();
}

function handleClearCompleteTodos() {
  const projects = state.getProjects();
  const selectedProjectId = state.getSelectedProjectId();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.todos = selectedProject.todos.filter(
    (task) => !task.complete
  );
  storage.save();
  ui.render();
}

function handleDeleteTodoItem(todoId) {
  const selectedProjectId = state.getSelectedProjectId();
  let projects = state.getProjects();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  selectedProject.todos = selectedProject.todos.filter(
    (todo) => todo.id !== todoId
  );
  state.setProjects(projects);
  storage.save();
  ui.render();
  modal.closeModal("view-todo");
}

// todosContainer.addEventListener("click", handleTodoItemCheck);

newTodoForm.addEventListener("submit", handleNewTodoSubmit);
clearCompleteTodosButton.addEventListener("click", handleClearCompleteTodos);

export default {
  handleNewTodoSubmit,
  handleTodoItemCheck,
  updateTodoElement,
  handleClearCompleteTodos,
  handleDeleteTodoItem,
};
