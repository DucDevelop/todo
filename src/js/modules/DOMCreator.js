import { format, compareAsc } from "date-fns";
import hash from "object-hash";

// create HTML for a given taskslist

function createDOMCreator(document) {
  // e.g. 12 Feb 17:15
  const dueDateFormatStr = "MMM Lo HH:MM a";

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
    // check for overdue taskt
    taskDue.classList.add("task-due");
    if (compareAsc(new Date(), todo.dueDate) === 1) {
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

  function createAddProjectTaskBtn() {
    const addProjectTask = document.createElement("div");
    addProjectTask.classList.add("add-project-task-container");
    const addTaskIcon = document.createElement("div");
    addTaskIcon.classList.add("icon", "add-project-task");
    const addTaskText = document.createElement("span");
    addTaskText.textContent = "Add task";

    addProjectTask.appendChild(addTaskIcon);
    addProjectTask.appendChild(addTaskText);

    return addProjectTask;

  }

  function createProjectTasksContainer(taskList, project) {

    const projectTaskContainer = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = project ?? "No Project";

    projectTaskContainer.appendChild(heading);

    const projectClass = project ?? "no-project";

    projectTaskContainer.classList.add(hash(projectClass.trim()));

    let filteredTasks = [];

    if (project) {
        filteredTasks =  taskList.filter((todo) => todo.project === project)
    } else {
        filteredTasks = taskList.filter((todo) => todo.project == null)
    }
    if (filteredTasks.length === 0) {
        return undefined;
    }

    projectTaskContainer.appendChild(createTasksContainer(filteredTasks))
    projectTaskContainer.appendChild(createAddProjectTaskBtn());

    return projectTaskContainer;
  }

  function createSidebarProjectList(projects) {
    const projectsContainer = document.createElement("nav");
    const projectList = document.createElement("ul");
    projectsContainer.appendChild(projectList);

    projects.forEach((project) => {
      const li = document.createElement("li");
      const projectItem = document.createElement("div");
      projectItem.classList.add("project-item");

      const icon = document.createElement("div");
      icon.classList.add("project-item", "icon");

      const text = document.createElement("span");
      text.classList.add("project-name");
      text.textContent = project;

      projectItem.appendChild(icon);
      projectItem.appendChild(text);
      li.appendChild(projectItem);
      projectList.appendChild(li);
    });

    return projectList;
  }

  function generateTaskView(
    tasklist,
    projectList,
    { filter = Boolean, title = "All tasks" } = {},
  ) {
    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("id", "content");
    const heading = document.createElement("h1");
    heading.textContent = title;
    contentContainer.appendChild(heading);

    const nullIncludedList = projectList.concat([null]);

    nullIncludedList.forEach((project) => {
      const projectTasks = createProjectTasksContainer(
        tasklist.filter(filter),
        project,
      );
      if (projectTasks) {
        contentContainer.appendChild(projectTasks);
      }
    });

    return contentContainer;
  }

  function generateProjectView(
    tasklist,
    project=null
  ) {

    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("id", "contents");
    const heading = document.createElement("h1");
    heading.textContent = project?? "No Project";
    contentContainer.appendChild(heading);
    const filteredList = tasklist.filter((todo) => todo.project === project)
    if (filteredList.length !== 0) {
        contentContainer.appendChild(createTasksContainer(filteredList));
    }
    contentContainer.appendChild(createAddProjectTaskBtn())
    return contentContainer;
  }

  return {
    // TODO: create sidebar completely
    // TODO: create main content
    // createSidebarProjectList,
    generateTaskView,
    generateProjectView,
  };
}

export default createDOMCreator;