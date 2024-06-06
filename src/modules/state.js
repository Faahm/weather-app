// task. is added to avoid any collisions/conflicts with the system files and websites
const LOCAL_STORAGE_PROJECTS_KEY = "task.projects";
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = "task.selectedProjectId";

let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)) || [];
let selectedProjectId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY
);

function getLocalStorageProjectsKey() {
  return LOCAL_STORAGE_PROJECTS_KEY;
}

function getLocalStorageSelectedProjectIdKey() {
  return LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY;
}

function getProjects() {
  return projects;
}

function setProjects(newProjects) {
  projects = newProjects;
}

function getSelectedProjectId() {
  return selectedProjectId;
}

function setSelectedProjectId(newSelectedProjectId) {
  selectedProjectId = newSelectedProjectId;
}

export default {
  getLocalStorageProjectsKey,
  getLocalStorageSelectedProjectIdKey,
  getProjects,
  setProjects,
  getSelectedProjectId,
  setSelectedProjectId,
};
