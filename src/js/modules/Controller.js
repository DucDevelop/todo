import { compareAsc } from "date-fns";

function createController(
  taskManager,
  projectManager,
  DOMCreator,
  storageManager,
) {
  pullFromDb();

  const CONFIG_TASK_VIEW = [
    {
      id: "0",
      title: "All tasks",
      description: "Display all tasks",
      type: "task",
      cssClassList: ["show-all"],
      taskFilter(task) {
        return Boolean(task);
      },
      eventHandlers: [
        {
          event: "click",
          callback() {
            renderView(this, CONFIG_TASK_EVENTS);
          },
          useCapute: false,
        },
      ],
    },
    {
      id: "1",
      title: "Due today",
      description: "Display tasks that are due today",
      type: "task",
      cssClassList: ["due-today"],
      taskFilter(task) {
        return compareAsc(new Date(), task.dueDate) >= 0;
      },
      eventHandlers: [
        {
          event: "click",
          callback() {
            renderView(this, CONFIG_TASK_EVENTS);
          },
          useCapute: false,
        },
      ],
    },
    {
      id: "2",
      title: "Soon",
      description: "Display tasks that are due later than today",
      type: "task",
      cssClassList: ["show-soon"],
      taskFilter(task) {
        return compareAsc(new Date(), task.dueDate) === -1;
      },
      eventHandlers: [
        {
          event: "click",
          callback() {
            renderView(this, CONFIG_TASK_EVENTS);
          },
          useCapute: false,
        },
      ],
    },
    {
      id: "3",
      title: "Finished",
      description: "Display finished tasks",
      type: "task",
      cssClassList: ["show-finished"],
      taskFilter(task) {
        return task.isDone;
      },
      eventHandlers: [
        {
          event: "click",
          callback() {
            renderView(this, CONFIG_TASK_EVENTS);
          },
          useCapute: false,
        },
      ],
    },
    {
      id: "4",
      title: "Search",
      description: "Display tasks that match search term",
      type: "task",
      cssClassList: ["show-search"],
      taskFilter(task, search) {
        // FIXME: figure out how to filter
        return true;
      },
      eventHandlers: [
        {
          event: "click",
          callback() {
            renderView(this, CONFIG_TASK_EVENTS);
          },
          useCapute: false,
        },
      ],
    },
  ];

  const CONFIG_PROJECT_VIEW = {
    projects: projectManager.getProjectList(),

    eventHandlers: [
      {
        event: "click",
        callback() {
          renderView(this, CONFIG_TASK_EVENTS);
        },
        useCapute: false,
      },
    ],
  };

  const CONFIG_SIDEBAR_EVENTS = {
    addTask: [
        {
            event: "click",
            callback() {
              showModal();
            },
            useCapture: false,
        },
      ],
    addProject: [
        {
            event: "click",
            callback() {
              showModal(false);
            },
            useCapture: false,
        },
    ],
    viewProjects: [
        {
            event: "click",
            callback() {
              console.log("TODO: SHow modal with project list")
            },
            useCapture: false,
        },
    ],
    viewProfile: [
        {
            event: "click",
            callback() {
              console.log("TODO: Profile action")
            },
            useCapture: false,
        },
    ],
  }
  const CONFIG_TASK_EVENTS = {
    taskEdit: [
      {
        event: "click",
        callback() {
          populateTaskModal(
            taskManager.getTask(this.parentNode.getAttribute("data-id")),
          );
          document.querySelector(
            "form#form-add-task div.btn-container > button",
          ).textContent = "Save";
          showModal();
        },
        useCapture: false,
      },
    ],
    taskDelete: [
      {
        event: "click",
        callback() {
          console.log(
            `Called delete icon on Task: ${taskManager.getTask(this.parentNode.getAttribute("data-id")).title} [ID]: ${this.parentNode.getAttribute("data-id")} `,
          );
        },
        useCapture: false,
      },
    ],
    taskView: [
      {
        event: "click",
        callback() {
          console.log(
            `Called view icon on Task: ${taskManager.getTask(this.parentNode.getAttribute("data-id")).title} [ID]: ${this.parentNode.getAttribute("data-id")} `,
          );
        },
        useCapture: false,
      },
    ],
    taskCheck: [
      {
          event: "click",
          callback() {
            const taskId = this.getAttribute("data-id");
            taskManager.setTaskProp(
              taskId,
              "isDone",
              !taskManager.getTask(taskId).isDone,
            );
            this.parentNode.parentNode.classList.toggle("completed");
            //   TODO: rerender after X seconds
          },
          useCapture: false,
      },
    ],
    projectTaskAdd: [
      {
        event: "click",
        callback(e) {
          const radioBtn = document.querySelector(
            `fieldset#project-selection input[type="radio"][value="${e.currentTarget.getAttribute("data-project-id")}"]`,
          );
          radioBtn.checked = true;
          e.stopPropagation();
          showModal();
        },
        useCapture: true,
      },
    ],
  };


  const CONFIG_MODAL_EVENTS_ADD_TASK = {}
  const CONFIG_MODAL_EVENTS_ADD_PROJECT = {}
  const CONFIG_MODAL_EVENTS_EDIT_PROJECT = {}
  const CONFIG_MODAL_EVENTS_VIEW_PROJECTS= {}
  const CONFIG_MODAL_EVENTS_COMMON= {}

  const showModal = (showTask = true) => {
    const modal = showTask
      ? document.querySelector("div#add-task")
      : document.querySelector("div#add-project");
    const modal_bg = document.querySelector("div.modal-bg");
    setModalVisibility(modal, true);
    setModalVisibility(modal_bg, true);
  };

  function setModalVisibility(modal, isVisible = false) {
    const style = isVisible ? "block" : "none";
    modal.setAttribute("style", `display:${style}`);
  }

  function pushToDb() {
    storageManager.storeProjects(projectManager.getProjectList());
    storageManager.storeTasks(taskManager.getTaskList());
  }

  function pullFromDb() {
    taskManager.clearTaskList();
    taskManager.populateTasks(storageManager.loadTasks());
    projectManager.clearAllProjects();
    projectManager.loadProjects(storageManager.loadProjects());
  }

  function syncWrapper(fn) {
    return (...args) => {
      const ret = fn(...args);
      storageManager.storeProjects(projectList);
      return ret;
    };
  }

  function renderSideBar() {
    const body = document.querySelector("body");
    const sidebar = document.querySelector("div.sidebar");
    const newSidebar = DOMCreator.generateSideBar(
      "DucDevelop",
      CONFIG_TASK_VIEW,
      CONFIG_PROJECT_VIEW,
      CONFIG_SIDEBAR_EVENTS
    );
    body.replaceChild(newSidebar, sidebar);
  }

  function renderSidebarProjectList() {
    const projectsList = document.querySelector("div.projects");

    projectsList.parentNode.replaceChild(
      DOMCreator.createProjectSidebarView(projectManager.getProjectList()),
      projectsList,
    );
  }

  function addProject(title) {
    if (!projectManager.getProjectByTitle(title)) {
      projectManager.addProject(title);
      storageManager.storeProjects(projectManager.getProjectList());
      const projectList = DOMCreator.createSidebarProjectList(
        projectManager.getProjectList(),
      );
      // rerender Logic
      renderSideBar(projectList);
    } else {
      // duplicate project do nothing
    }
  }

  function onTaskSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const date = document.getElementById("deadline-time").value;
    const project = document.querySelector(
      'form input[type="radio"][name="project"]:checked',
    ).value;
    const priority = document.querySelector(
      'form input[type="radio"][name="priority"]:checked',
    ).value;

    console.log(`You added: ${title} to title`);
    console.log(`You added: ${description} to description`);
    console.log(`You added: ${date} to date`);
    console.log(`You added: ${project} to projects`);
    console.log(`You added: ${priority} to priority`);

    const projectObj = project ? projectManager.getProject(project) : null;
    const taskObj = taskManager.createTask(
      title,
      description,
      date,
      false,
      projectObj,
      priority,
    );
    taskManager.addTask(taskObj);

    // close modal
    hideModal();
    pushToDb();
  }
  function onProjectSubmit(event) {
    event.preventDefault();
    const projectInput = document.getElementById("input-project");
    projectManager.addProject(projectInput.value);
    projectInput.value = "";
    hideModal();

    pushToDb();
    renderSidebarProjectList();
    renderTaskModal();
    // TODO: reattach event listeners
  }

  function clearUserInput() {
    const radioBtns = Array.from(
      document.querySelectorAll('form input[type="radio"]:default'),
    );
    const textareas = Array.from(document.querySelectorAll("form textarea"));
    const textInputs = Array.from(
      document.querySelectorAll('form input[type="text"]'),
    );
    const dateTime = Array.from(
      document.querySelectorAll('form input[type="datetime-local"]'),
    );

    textareas.concat(textInputs, dateTime).forEach((field) => {
      field.value = "";
    });
    radioBtns.forEach((btn) => {
      btn.checked = true;
    });
  }

  const hideModal = () => {
    const modals = Array.from(document.querySelectorAll("div.modal"));
    const modal_bg = document.querySelector("div.modal-bg");
    modals.forEach((mod) => setModalVisibility(mod, false));
    setModalVisibility(modal_bg, false);
    // restore default
    clearUserInput();
    document.querySelector(
      "form#form-add-task div.btn-container > button",
    ).textContent = "Add task";
  };

  function setModalVisibility(modal, isVisible = false) {
    const style = isVisible ? "block" : "none";
    modal.setAttribute("style", `display:${style}`);
  }

  function renderView(option, CONFIG_TASK_EVENTS) {
    let view = null;
    let viewSelection = null;

    const views = Array.from(
      document.querySelectorAll("div.sidebar nav ul > li"),
    );
    views.forEach((sidebarView) => sidebarView.classList.remove("selected"));

    if (option && option.type === "task") {
      view = DOMCreator.generateTaskView(
        taskManager.getTaskList(),
        projectManager.getProjectList(),
        option,
        CONFIG_TASK_EVENTS,
      );

      viewSelection = `div.sidebar nav ul > li[data-task-view-id="${option.id}"]`;
    } else if (option) {
      // project view
      view = DOMCreator.generateProjectView(
        taskManager.getTaskList(),
        projectManager.getProject(option.id),
        CONFIG_TASK_EVENTS,
      );
      viewSelection = `div.sidebar nav ul > li[data-project-view-id="${option.id}"]`;
    } else {
      // "no project" view
      view = DOMCreator.generateProjectView(taskManager.getTaskList(), null, CONFIG_TASK_EVENTS);
      viewSelection = `div.sidebar nav ul > li[data-project-view-id=""]`;
    }

    // mark selected
    document.querySelector(viewSelection).classList.add("selected");

    const newContent = document.createElement("div");
    newContent.setAttribute("id", "content");
    newContent.appendChild(view);
    const content = document.querySelector("div#content");
    content.parentNode.replaceChild(newContent, content);
  }

  function renderTaskModal() {
    const newProjectRadios = DOMCreator.generateModal(
      projectManager.getProjectList(),
    );
    const old = document.querySelector("fieldset#project-selection");
    old.parentNode.replaceChild(newProjectRadios, old);
  }

  function checkProjectRadio(projectId) {
    document.querySelector(
      `form input[type="radio"][value="${projectId}"]`,
    ).checked = true;
  }

  function initPage() {
    pullFromDb();
    // render page
    renderTaskModal();
    renderSideBar();

    // TODO: make it general
    renderView(CONFIG_TASK_VIEW[0], CONFIG_TASK_EVENTS);
    // attach event listeners
    // setupEvents();
  }

  function populateTaskModal(taskObj) {
    if (taskObj) {
      document.querySelector("input#task-title").value = taskObj.title;
      document.querySelector("input#deadline-time").value = taskObj.dueDate;
      document.querySelector("textarea#task-description").value =
        taskObj.description;

      if (taskObj.project) {
        document.querySelector(
          `input[type="radio"][name="project"][value="${taskObj.project.id}"]`,
        ).checked = true;
      } else {
        document.querySelector(
          `input[type="radio"][name="project"][value=""]`,
        ).checked = true;
      }

      document.querySelector(
        `input[type="radio"][name="priority"][value="${taskObj.priority}"]`,
      ).checked = true;
    }
  }

  function setupEvents() {
    // TODO: Split up and move to DOM creator
    const CONFIG_EVENT = [
      {
        // cancel button in modal cancelAdd
        elements: Array.from(document.querySelectorAll("div.icon.close")),
        event: "click",
        callback() {
          hideModal();
        },
        useCapture: false,
      },
      
      {
        // submit add task
        elements: [document.getElementById("form-add-task")],
        event: "submit",
        callback(e) {
          onTaskSubmit(e);
        },
        useCapture: false,
      },
      {
        // submit add project
        elements: [document.getElementById("form-add-project")],
        event: "submit",
        callback(e) {
          onProjectSubmit(e);
        },
        useCapture: false,
      },
    ];

    CONFIG_EVENT.forEach((config) => {
      config.elements.forEach((el) => {
        el.addEventListener(
          config.event,
          config.callback.bind(el),
          config.useCapture,
        );
      });
    });
  }






  return {
    addProject,
    renderSideBar,
    renderView,
    onProjectSubmit,
    clearUserInput,
    onTaskSubmit,
    renderTaskModal,
    pushToDb,
    pullFromDb,
    initPage,
    showModal,
    hideModal,
    setupEvents,
  };
}

export default createController;
