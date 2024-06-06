import state from "./state";
function save() {
  localStorage.setItem(
    state.getLocalStorageProjectsKey(),
    JSON.stringify(state.getProjects())
  );
  localStorage.setItem(
    state.getLocalStorageSelectedProjectIdKey(),
    state.getSelectedProjectId()
  );
}

export default {
  save,
};
