function createController(
  taskManager,
  projectManager,
  DOMCreator,
  storageManager,
) {
  const CONFIG_VIEW = [];

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

  // FIXME: rerender / update model on data change in project or task database
  // configure views with filters and highlight correct sidebar
  const views = {
    task: {},
    project: projectManager.getProjectList(),
  };

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

  function rerenderProjectList(newList) {
    const container = document.querySelector("div.project-view + nav");
    const oldContent = document.querySelector("div.project-view + nav > ul");
    container.removeChild(oldContent);
    container.appendChild(newList);
  }

  function renderSideBar() {
    const body = document.querySelector("body");
    const sidebar = document.querySelector("div.sidebar");
    const newSidebar = DOMCreator.generateSideBar(
      "DucDevelop",
      projectManager.getProjectList(),
    );
    body.replaceChild(newSidebar, sidebar);
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
    renderSideBar();
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

  function renderView() {
    const options = {
      filter(x) {
        return Boolean(x);
      },
      title: "All tasks",
    };
    const options1 = {
      filter(x) {
        return x.isDone;
      },
      title: "Finished",
    };
    const options2 = {
      filter(x) {
        return Boolean(x);
      },
      title: "All tasks",
    };

    const view = DOMCreator.generateTaskView(
      taskManager.getTaskList(),
      projectManager.getProjectList(),
      options,
    );

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
    renderView();
    // attach event listeners
    setupEvents();
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
    const CONFIG_EVENT = [
      {
        // add task button in sidebar
        elements: [document.querySelector("div.add-task")],
        event: "click",
        callback() {
          showModal();
        },
        useCapture: false,
      },
      {
        // add project button in sidebar
        elements: [document.querySelector("div.add-project")],
        event: "click",
        callback() {
          showModal(false);
        },
        useCapture: false,
      },
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
        // TODO: delete button for individual tasks
        elements: Array.from(
          document.querySelectorAll("div.task-action div.icon.delete"),
        ),
        event: "click",
        callback() {
          console.log(
            `Called delete icon on Task: ${taskManager.getTask(this.parentNode.getAttribute("data-id")).title} [ID]: ${this.parentNode.getAttribute("data-id")} `,
          );
        },
        useCapture: false,
      },

      {
        // edit button for individual tasks
        // FIXME: edit existing task instead of adding new one
        elements: Array.from(
          document.querySelectorAll("div.task-action div.icon.edit"),
        ),
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

      {
        // TODO: Display detail page for individual task
        elements: Array.from(
          document.querySelectorAll("div.task-action div.icon.view"),
        ),
        event: "click",
        callback() {
          console.log(
            `Called view icon on Task: ${taskManager.getTask(this.parentNode.getAttribute("data-id")).title} [ID]: ${this.parentNode.getAttribute("data-id")} `,
          );
        },
        useCapture: false,
      },

      {
        // TODO: Display detail page for individual task
        elements: Array.from(
          document.querySelectorAll('div.task-card input[type="checkbox"]'),
        ),
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

      {
        // add task in project section
        elements: Array.from(
          document.querySelectorAll("div.add-project-task-container"),
        ),
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
