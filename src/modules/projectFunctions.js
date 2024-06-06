import state from "./state";
import storage from "./storage";
import ui from "./ui";

const newProjectForm = document.querySelector("[data-new-project-form]");
const newProjectInput = document.querySelector("[data-new-project-input]");
const deleteProjectButton = document.querySelector(
  "[data-delete-project-button]"
);

function createProject(title) {
  return {
    id: Date.now().toString(),
    title: title,
    todos: [],
  };
}

function handleNewProjectSubmit(e) {
  e.preventDefault();
  let projects = state.getProjects();
  const projectName = newProjectInput.value;
  if (projectName == null || projectName === "") return;
  const project = createProject(projectName);
  newProjectInput.value = null;
  projects.push(project);
  state.setProjects(projects);
  let selectedProjectId = state.getSelectedProjectId();
  selectedProjectId = project.id;
  state.setSelectedProjectId(selectedProjectId);
  storage.save();
  ui.render();
}

function updateProjectTitle(projectId, newTitle) {
  let projects = state.getProjects();
  const project = projects.find((project) => project.id === projectId);
  if (project) {
    project.title = newTitle;
    state.setProjects(projects);
    storage.save();
  }
}

function handleDeleteProject() {
  let projects = state.getProjects();
  let selectedProjectId = state.getSelectedProjectId();
  const projectIndex = projects.findIndex(
    (project) => project.id === selectedProjectId
  );

  projects = projects.filter((project) => project.id !== selectedProjectId);

  let newSelectedProjectId = null;
  if (projects.length > 0) {
    if (projectIndex > 0) {
      newSelectedProjectId = projects[projectIndex - 1].id;
    } else {
      newSelectedProjectId = projects[0].id;
    }
  }
  selectedProjectId = newSelectedProjectId;
  state.setProjects(projects);
  state.setSelectedProjectId(selectedProjectId);
  storage.save();
  ui.render();
}

newProjectForm.addEventListener("submit", handleNewProjectSubmit);
deleteProjectButton.addEventListener("click", handleDeleteProject);

export default {
  handleNewProjectSubmit,
  updateProjectTitle,
  handleDeleteProject,
};
