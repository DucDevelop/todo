import { format, compareAsc } from "date-fns";

// create HTML for a given taskslist

function createDOMCreator(document) {
    // e.g. 12 Feb 17:15 
    const dueDateFormatStr = "Lo MMM p"

  function createTaskElement(todo) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.setAttribute("data-id", todo.id);
    if (todo.isDone) {
      taskCard.classList.add("completed");
    }

    // checkbox button
    const checkBox = document.createElement("div");
    checkBox.classList.add("icon", "task-checkbox");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    checkBox.appendChild(input);

    const taskOverview = document.createElement("div");
    taskOverview.classList.add("task-short-info");

    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");
    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = todo.title;
    const taskDue = document.createElement("span");
    // check for overdue task
    taskDue.classList.add("task-due");
    if(compareAsc(new Date(), todo.dueDate) === 1) {
        taskDue.classList.add("overdue");
    }
    taskDue.textContent = format(todo.dueDate, dueDateFormatStr);
    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDue);

    const taskAction = document.createElement("div");
    taskAction.classList.add("task-action");
    const viewTask = document.createElement("div");
    viewTask.classList.add("icon", "view");
    const editTask = document.createElement("div");
    editTask.classList.add("icon", "edit");
    const deleteTask = document.createElement("div");
    deleteTask.classList.add("icon", "delete");

    taskAction.appendChild(viewTask);
    taskAction.appendChild(editTask);
    taskAction.appendChild(deleteTask);

    taskOverview.appendChild(taskInfo);
    taskOverview.appendChild(taskAction);

    taskCard.appendChild(checkBox);
    taskCard.appendChild(taskOverview);

    return taskCard;
  }

  function createTasksContainer(taskList) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-card-container");
    taskList.forEach((task) =>
      taskContainer.appendChild(createTaskElement(task)),
    );
    return taskContainer;
  }

  function createProjectTasksContainer(taskList, project) {
    const projectTaskContainer = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = project ?? "No Project";

    projectTaskContainer.appendChild(heading);

    const projectClass = project ?? "no-project";
    projectTaskContainer.classList.add(projectClass);

    if (project) {
      projectTaskContainer.appendChild(
        createTasksContainer(
          taskList.filter((todo) => todo.project === project),
        ),
      );
    } else {
      projectTaskContainer.appendChild(
        createTasksContainer(taskList.filter((todo) => todo.project == null)),
      );
    }

    return projectTaskContainer;
  }

  return {
    createTaskElement,
    createTasksContainer,
    createProjectTasksContainer,
  };
}

export default createDOMCreator;
