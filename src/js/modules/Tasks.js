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
    todoList.forEach((todo) => addTask(createTask(...Object.values(todo))));
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

  function getTasksDueUntil(date) {
    return taskList.filter((task) => compareAsc(date, task.dueDate) > 0);
  }

  function getTaskList() {
    return taskList;
  }

  function isTaskOverdue(taskId) {
    // Compare the two dates and return 1 if the first date is after the second,
    //  -1 if the first date is before the second or 0 if dates are equal.
    const overdueVal = 1;
    return compareAsc(new Date(), getTask(taskId).dueDate) === overdueVal;
  }

  return {
    taskList,
    getTaskProp,
    setTaskProp,
    getTask,
    addTask,
    getProjectList,
    isTaskOverdue,
    getTasksDueUntil,
    getTaskList,
  };
}

export default createTasks;
