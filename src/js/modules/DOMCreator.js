import { format, compareAsc } from "date-fns";
import hash from "object-hash";

// create HTML for a given taskslist

function createDOMCreator(document) {
  // e.g. 12 Feb 17:15
  const dueDateFormatStr = "EEE, do MMM hb";
  const DEFAULT_PROJECT = { id: "", title: "No Project" };

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
    input.setAttribute("data-id", todo.id);
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
    taskAction.setAttribute("data-id", todo.id);
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

  function createProjectTasksContainer(taskList, projectObj) {
    const projectTaskContainer = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = DEFAULT_PROJECT.title;
    let projectClass = DEFAULT_PROJECT.id;
    let filteredTasks = [];

    if (projectObj && projectObj.id) {
      heading.textContent = projectObj.title;
      projectClass = projectObj.id;
      filteredTasks = taskList.filter(
        (todo) => todo.project && todo.project.id === projectObj.id,
      );
      projectTaskContainer.classList.add(projectClass);
    } else {
      filteredTasks = taskList.filter((todo) => todo.project == null);
    }

    if (filteredTasks.length === 0) {
      return undefined;
    }

    projectTaskContainer.appendChild(heading);
    projectTaskContainer.appendChild(createTasksContainer(filteredTasks));
    projectTaskContainer.appendChild(createAddProjectTaskBtn(projectClass));

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

  function createAddProjectTaskBtn(projectId = "") {
    const container = createIconBtn(
      ["add-project-task-container"],
      ["icon", "add-project-task"],
      [],
      "Add task",
    );
    container.setAttribute("data-project-id", projectId);

    return container;
  }

  function createSidebarProjectList(projects) {
    function createProjectListItem(
      title = DEFAULT_PROJECT.title,
      projectId = DEFAULT_PROJECT.id,
    ) {
      const li = document.createElement("li");
      const projectItem = document.createElement("div");
      projectItem.classList.add("project-item");
      projectItem.setAttribute("data-project-id", projectId);

      const icon = document.createElement("div");
      icon.classList.add("project-item", "icon");

      const text = document.createElement("span");
      text.classList.add("project-name");
      text.textContent = title;

      projectItem.appendChild(icon);
      projectItem.appendChild(text);
      li.appendChild(projectItem);
      return li;
    }

    const projectsContainer = document.createElement("nav");
    const projectList = document.createElement("ul");
    projectsContainer.appendChild(projectList);

    // default project if task has no project assigned
    projectList.appendChild(createProjectListItem());

    projects.forEach((project) => {
      projectList.appendChild(createProjectListItem(project.title, project.id));
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

  function generateProjectView(tasklist, projectObj = DEFAULT_PROJECT) {
    const contentContainer = document.createElement("div");
    contentContainer.setAttribute("id", "contents");
    const heading = document.createElement("h1");
    let filteredList = [];

    if (projectObj.id) {
      heading.textContent = projectObj.title;
      filteredList = tasklist.filter(
        (todo) => todo.project === projectObj.title,
      );
    } else {
      heading.textContent = DEFAULT_PROJECT.title;
      filteredList = tasklist.filter((todo) => todo.project == null);
    }
    contentContainer.appendChild(heading);

    if (filteredList.length !== 0) {
      contentContainer.appendChild(createTasksContainer(filteredList));
    }
    contentContainer.appendChild(createAddProjectTaskBtn(projectObj.id));
    return contentContainer;
  }

  function createProjectSidebarView(projects) {
    const projectViewContainer = document.createElement("div");
    projectViewContainer.classList.add("projects");
    projectViewContainer.appendChild(
      createIconBtn(
        ["project-view"],
        ["project-overview", "icon"],
        ["project-view"],
        "Projects",
      ),
    );
    projectViewContainer.appendChild(createSidebarProjectList(projects));
    projectViewContainer.appendChild(
      createIconBtn(["add-project"], ["icon"], ["add-text"], "Add Project"),
    );
    return projectViewContainer;
  }

  function createTaskSidebarView() {
    const taskViews = [
      { iconClass: "show-all", textContent: "All tasks" },
      { iconClass: "due-today", textContent: "Due today" },
      { iconClass: "show-soon", textContent: "Soon" },
      { iconClass: "show-finished", textContent: "Finished" },
      { iconClass: "show-search", textContent: "Search" },
    ];

    const taskViewContainer = document.createElement("div");
    taskViewContainer.classList.add("tasks");
    taskViewContainer.appendChild(
      createIconBtn(["add-task"], ["icon"], ["add-text"], "Add task"),
    );

    const navContainer = document.createElement("nav");
    taskViewContainer.appendChild(navContainer);
    const listContainer = document.createElement("ul");
    navContainer.appendChild(listContainer);

    taskViews.forEach((view) => {
      const listItem = document.createElement("li");

      listItem.appendChild(
        createIconBtn(
          ["task-view"],
          ["icon", view.iconClass],
          ["user-name"],
          view.textContent,
        ),
      );
      listContainer.appendChild(listItem);
    });

    return taskViewContainer;
  }

  function generateSideBar(userName, projects) {
    const sideBar = document.createElement("div");
    sideBar.classList.add("sidebar");

    sideBar.appendChild(
      createIconBtn(["profile"], ["profile-image"], ["user-name"], userName),
    );
    sideBar.appendChild(createTaskSidebarView());
    sideBar.appendChild(createProjectSidebarView(projects));
    return sideBar;
  }

  function generateModal(projects) {

    function radioBtnCreator() {
      let counter = 0;

      return ((project, defaultChoice = false) => {
        const htmlId = `projectChoice${counter}`;
        let projectId = "";
        let labelText = "#No project";

        if (project) {
          projectId = project.id;
          labelText = `#${project.title}`;
        }

        const container = document.createElement("div");
        container.classList.add("project-radio");

        const radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("id", htmlId);
        radio.setAttribute("name", "project");
        radio.setAttribute("value", projectId);
        if (defaultChoice) {
          radio.setAttribute("checked", true);
          radio.setAttribute("required", true);
        }

        const label = document.createElement("label");
        label.setAttribute("for", htmlId);
        label.textContent = labelText;

        container.appendChild(radio);
        container.appendChild(label);
        counter += 1;

        return container;
      });
    }

    const fieldSet = document.createElement("fieldset");
    fieldSet.setAttribute("id", "project-selection");
    const legend = document.createElement("legend");
    legend.textContent = "Select your project";

    fieldSet.appendChild(legend);

    const radioBtnFactory = radioBtnCreator()
    // default project for tasks without project assigned
    fieldSet.appendChild(radioBtnFactory(null, true));
    // append the remaining projects
    projects.forEach((p) => fieldSet.appendChild(radioBtnFactory(p, false)));

    return fieldSet;
  }

  return {
    // TODO: create main content
    generateTaskView,
    generateProjectView,
    generateSideBar,
    generateModal,
  };
}

export default createDOMCreator;
