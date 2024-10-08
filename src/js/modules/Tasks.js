import hash from "object-hash";
import { compareAsc } from "date-fns";

function createTasks(list = null) {
  //takes in an array of task objects
  const taskList = [];

  if (list && list.length > 0) {
    populateTasks(list);
  }

  function getTask(id) {
    return taskList.filter((x) => x.id === id)[0];
  }

  function createTask(
    title,
    description,
    dueDate,
    isDone,
    project = null,
    priority = 0,
  ) {
    const id = hash({ title, description, dueDate, isDone, project, priority });

    if (typeof project !== 'object') {
      throw new Error("Project must be of type object")
    }

    return {
      id,
      title,
      description,
      dueDate,
      isDone,
      project,
      priority,
    };
  }

  function addTask(taskObj) {
    if (!getTask(taskObj.id)) {
      taskList.push(taskObj);
    } else {
      //  duplicate task do nothing
    }
  }

  function populateTasks(todoList) {
    todoList.forEach((todo) => {
      addTask(
        createTask(
          todo.title,
          todo.description,
          todo.dueDate,
          todo.isDone,
          todo.project,
          todo.priority,
        ),
      );
    });
  }

  function setTaskProp(id, prop, newVal) {
    getTask(id)[prop] = newVal;
  }

  function getTaskProp(id, prop) {
    return getTask(id)[prop];
  }

  function getProjectList() {
    const projects = [];
    taskList.forEach((todo) => {
      if (todo.project && !projects.includes(todo.project)) {
        projects.push(todo.project);
      }
    });
    return projects;
  }

  function getTaskList() {
    return taskList;
  }

  function clearTaskList() {
    taskList.splice(0, taskList.length);
  }

  return {
    taskList,
    getTaskProp,
    setTaskProp,
    getTask,
    addTask,
    getTaskList,
    createTask,
    clearTaskList,
  };
}

export default createTasks;
