import { format, compareAsc } from "date-fns";
import hash from "object-hash";

// create HTML for a given taskslist

function createDOMCreator(document) {
  // e.g. 12 Feb 17:15
  const dueDateFormatStr = "EEE, do MMM hb";
  const DEFAULT_PROJECT = { id: "", title: "No Project", obj: null };

  function createTaskElement(todo, CONFIG_TASK_EVENTS) {
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
    input.setAttribute("data-id", todo.id);
    checkBox.appendChild(input);
    attachEventHandlers(input, CONFIG_TASK_EVENTS.taskCheck, input);

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
    taskAction.setAttribute("data-id", todo.id);
    const viewTask = document.createElement("div");
    viewTask.classList.add("icon", "view");
    attachEventHandlers(viewTask, CONFIG_TASK_EVENTS.taskView, viewTask);
    const editTask = document.createElement("div");
    editTask.classList.add("icon", "edit");
    attachEventHandlers(editTask, CONFIG_TASK_EVENTS.taskEdit, editTask);
    const deleteTask = document.createElement("div");
    deleteTask.classList.add("icon", "delete");
    attachEventHandlers(deleteTask, CONFIG_TASK_EVENTS.taskDelete, deleteTask);

    taskAction.appendChild(viewTask);
    taskAction.appendChild(editTask);
    taskAction.appendChild(deleteTask);

    taskOverview.appendChild(taskInfo);
    taskOverview.appendChild(taskAction);

    taskCard.appendChild(checkBox);
    taskCard.appendChild(taskOverview);

    return taskCard;
  }

  function createTasksContainer(taskList, CONFIG_TASK_EVENTS) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-card-container");
    taskList.forEach((task) =>
      taskContainer.appendChild(createTaskElement(task, CONFIG_TASK_EVENTS)),
    );

    return taskContainer;
  }

  function createProjectTasksContainer(
    taskList,
    projectObj,
    CONFIG_TASK_EVENTS,
  ) {
    const projectTaskContainer = document.createElement("div");
    const heading = document.createElement("h2");
    const safeProject = createSafeProjectObj(projectObj);

    heading.textContent = safeProject.title;
    const projectClass = safeProject.id;
    let filteredTasks = [];

    if (safeProject.obj) {
      filteredTasks = taskList.filter(
        (todo) => todo.project && todo.project.id === safeProject.id,
      );
      projectTaskContainer.classList.add(projectClass);
    } else {
      filteredTasks = taskList.filter(
        (todo) => todo.project === safeProject.obj,
      );
    }

    if (filteredTasks.length === 0) {
      return undefined;
    }

    projectTaskContainer.appendChild(heading);
    projectTaskContainer.appendChild(
      createTasksContainer(filteredTasks, CONFIG_TASK_EVENTS),
    );
    projectTaskContainer.appendChild(
      createAddProjectTaskBtn(
        safeProject.id,
        CONFIG_TASK_EVENTS.projectTaskAdd,
      ),
    );

    return projectTaskContainer;
  }

  function createIconBtn(
    containerClasses,
    iconClasses,
    textClasses,
    textContent,
  ) {
    const container = document.createElement("div");
    container.classList.add(...containerClasses);

    const addTaskIcon = document.createElement("div");
    addTaskIcon.classList.add(...iconClasses);

    const addTaskText = document.createElement("span");
    addTaskText.classList.add(...textClasses);
    addTaskText.textContent = textContent;

    container.appendChild(addTaskIcon);
    container.appendChild(addTaskText);
    return container;
  }

  function createAddTaskSideBarBtn() {
    const container = createIconBtn(
      ["add-task"],
      ["icon"],
      ["add-text"],
      "Add task",
    );

    return container;
  }
  function createAddProjectSideBarBtn() {
    const container = createIconBtn(
      ["add-project"],
      ["icon"],
      [],
      "Add project",
    );

    return container;
  }

  function createSafeProjectObj(project) {
    if (!project) {
      return DEFAULT_PROJECT;
    }

    return { obj: project, ...project };
  }

  function createAddProjectTaskBtn(projectId = "", eventHandlers = []) {
    const container = createIconBtn(
      ["add-project-task-container"],
      ["icon", "add-project-task"],
      [],
      "Add task",
    );
    container.setAttribute("data-project-id", projectId);
    attachEventHandlers(container, eventHandlers);

    return container;
  }

  function createSidebarProjectList(projectConfig) {
    function createProjectListItem(project) {
      const safeProject = createSafeProjectObj(project);
      const li = document.createElement("li");
      const projectItem = document.createElement("div");
      projectItem.classList.add("project-item");

      li.setAttribute("data-project-view-id", safeProject.id);

      attachEventHandlers(li, projectConfig.eventHandlers, safeProject.obj);

      const icon = document.createElement("div");
      icon.classList.add("project-item", "icon");

      const text = document.createElement("span");
      text.classList.add("project-name");
      text.textContent = safeProject.title;

      projectItem.appendChild(icon);
      projectItem.appendChild(text);
      li.appendChild(projectItem);
      return li;
    }

    const projectsContainer = document.createElement("nav");
    const projectList = document.createElement("ul");
    projectsContainer.appendChild(projectList);

    // default project if task has no project assigned
    projectList.appendChild(createProjectListItem(null));

    projectConfig.projects.forEach((prj) => {
      projectList.appendChild(createProjectListItem(prj));
    });

    return projectList;
  }

  function generateTaskView(
    tasklist,
    projectList,
    { taskFilter = Boolean, title = "All tasks" } = {},
    CONFIG_TASK_EVENTS,
  ) {
    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("id", "content");
    const heading = document.createElement("h1");
    heading.textContent = title;
    contentContainer.appendChild(heading);

    const nullIncludedList = projectList.concat([null]);

    nullIncludedList.forEach((project) => {
      const projectTasks = createProjectTasksContainer(
        tasklist.filter(taskFilter),
        project,
        CONFIG_TASK_EVENTS,
      );
      if (projectTasks) {
        contentContainer.appendChild(projectTasks);
      }
    });

    return contentContainer;
  }

  function generateProjectView(
    tasklist,
    projectObj = null,
    CONFIG_TASK_EVENTS,
  ) {
    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("id", "contents");
    const heading = document.createElement("h1");
    let filteredList = [];
    let projectId = "";

    if (!projectObj) {
      heading.textContent = DEFAULT_PROJECT.title;
      filteredList = tasklist.filter((todo) => todo.project == null);
    } else {
      heading.textContent = projectObj.title;
      filteredList = tasklist.filter(
        (todo) => todo.project && todo.project.id === projectObj.id,
      );
      projectId = projectObj.id;
    }

    contentContainer.appendChild(heading);

    if (filteredList.length !== 0) {
      contentContainer.appendChild(
        createTasksContainer(filteredList, CONFIG_TASK_EVENTS),
      );
    }
    contentContainer.appendChild(createAddProjectTaskBtn(projectId));
    return contentContainer;
  }

  function createProjectSidebarView(projectConfig, CONFIG_SIDEBAR_EVENTS) {
    const projectViewContainer = document.createElement("div");
    projectViewContainer.classList.add("projects");
    const projectOverview = createIconBtn(
      ["project-view"],
      ["project-overview", "icon"],
      ["project-view"],
      "Projects",
    );

    attachEventHandlers(projectOverview, CONFIG_SIDEBAR_EVENTS.viewProjects);
    projectViewContainer.appendChild(projectOverview);

    const nav = document.createElement("nav");
    projectViewContainer.appendChild(nav);
    nav.appendChild(createSidebarProjectList(projectConfig));
    const addProjectBtn = createIconBtn(
      ["add-project"],
      ["icon"],
      ["add-text"],
      "Add Project",
    );
    attachEventHandlers(addProjectBtn, CONFIG_SIDEBAR_EVENTS.addProject);
    projectViewContainer.appendChild(addProjectBtn);
    return projectViewContainer;
  }

  function createTaskSidebarView(viewConfig, CONFIG_SIDEBAR_EVENTS) {
    const taskViewContainer = document.createElement("div");
    taskViewContainer.classList.add("tasks");
    const addTaskBtn = createIconBtn(
      ["add-task"],
      ["icon"],
      ["add-text"],
      "Add task",
    );
    attachEventHandlers(addTaskBtn, CONFIG_SIDEBAR_EVENTS.addTask);
    taskViewContainer.appendChild(addTaskBtn);

    const navContainer = document.createElement("nav");
    taskViewContainer.appendChild(navContainer);
    const listContainer = document.createElement("ul");
    navContainer.appendChild(listContainer);

    viewConfig.forEach((viewObj) => {
      const listItem = document.createElement("li");

      listItem.appendChild(
        createIconBtn(
          ["task-view"],
          ["icon", ...viewObj.cssClassList],
          ["user-name"],
          viewObj.title,
        ),
      );
      listItem.setAttribute("data-task-view-id", viewObj.id);

      attachEventHandlers(listItem, viewObj.eventHandlers, viewObj);

      listContainer.appendChild(listItem);
    });

    return taskViewContainer;
  }

  function generateSideBar(
    userName,
    taskConfig,
    projectConfig,
    CONFIG_SIDEBAR_EVENTS,
  ) {
    const sideBar = document.createElement("div");
    sideBar.classList.add("sidebar");
    const profileBtn = createIconBtn(
      ["profile"],
      ["profile-image"],
      ["user-name"],
      userName,
    );
    attachEventHandlers(
      profileBtn.firstChild,
      CONFIG_SIDEBAR_EVENTS.viewProfile,
    );

    sideBar.appendChild(profileBtn);
    sideBar.appendChild(
      createTaskSidebarView(taskConfig, CONFIG_SIDEBAR_EVENTS),
    );
    sideBar.appendChild(
      createProjectSidebarView(projectConfig, CONFIG_SIDEBAR_EVENTS),
    );
    return sideBar;
  }

  function generateModal(projects) {
    function radioBtnCreator() {
      let counter = 0;

      return (project, defaultChoice = false) => {
        const htmlId = `projectChoice${counter}`;

        const safeProject = createSafeProjectObj(project);

        const container = document.createElement("div");
        container.classList.add("project-radio");

        const radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("id", htmlId);
        radio.setAttribute("name", "project");
        radio.setAttribute("value", safeProject.id);
        if (defaultChoice) {
          radio.setAttribute("checked", true);
          radio.setAttribute("required", true);
        }

        const label = document.createElement("label");
        label.setAttribute("for", htmlId);
        label.textContent = `#${safeProject.title}`;

        container.appendChild(radio);
        container.appendChild(label);
        counter += 1;

        return container;
      };
    }

    const fieldSet = document.createElement("fieldset");
    fieldSet.setAttribute("id", "project-selection");
    const legend = document.createElement("legend");
    legend.textContent = "Select your project";

    fieldSet.appendChild(legend);

    const radioBtnFactory = radioBtnCreator();
    // default project for tasks without project assigned
    fieldSet.appendChild(radioBtnFactory(null, true));
    // append the remaining projects
    projects.forEach((p) => fieldSet.appendChild(radioBtnFactory(p, false)));

    return fieldSet;
  }

  function attachEventHandlers(el, events, bindObj = null) {
    events.forEach((evt) => {
      el.addEventListener(
        evt.event,
        evt.callback.bind(bindObj),
        evt.useCapture,
      );
    });
  }

  return {
    // TODO: create main content
    generateTaskView,
    generateProjectView,
    generateSideBar,
    generateModal,
    createProjectSidebarView,
  };
}

export default createDOMCreator;
