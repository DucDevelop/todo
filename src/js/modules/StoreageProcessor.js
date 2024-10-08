// import { LocalStorage } from "node-localstorage";

function createStorageProcessor() {
  // if (typeof localStorage === "undefined" || localStorage === null) {
  //   var localStorage = new LocalStorage('./scratch');
  // }

  function storeTasks(objList) {
    localStorage.setItem("tasks", JSON.stringify(objList));
  }

  function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks"));
  }

  function deleteTasks() {
    localStorage.removeItem("tasks");
  }
  function storeProjects(objList) {
    localStorage.setItem("projects", JSON.stringify(objList));
  }

  function loadProjects() {
    return JSON.parse(localStorage.getItem("projects"));
  }

  function deleteProjects() {
    localStorage.removeItem("projects");
  }

  return {
    storeTasks,
    loadTasks,
    deleteTasks,
    storeProjects,
    loadProjects,
    deleteProjects,
  };
}

export default createStorageProcessor;
