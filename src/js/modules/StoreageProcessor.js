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

  return {
    storeTasks,
    loadTasks,
    deleteTasks,
  };
}

export default createStorageProcessor;
