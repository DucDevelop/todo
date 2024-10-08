function createController(
  taskManager,
  projectManager,
  DOMCreator,
  storageManager,
) {
  const views = {
    task: {},
    project: projectManager.getProjectList(),
  };

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

  function renderView() {
    const options = {
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

    const newMain = document.createElement('main');
    newMain.appendChild(view)
    const main = document.querySelector("main")
    main.parentNode.replaceChild(newMain, main);


  }

  return { addProject, renderSideBar, renderView };
}

export default createController;
