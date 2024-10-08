import hash from "object-hash";

function createProjectManager() {
  const projectList = [];

  function addProject(title) {
    const project = {
      id: hash(title),
      title,
    };
    projectList.push(project);
    return project;
  }

  function getProjectIds() {
    return projectList.map((project) => project.id);
  }
  function getProject(id) {
    return projectList.filter((project) => project.id === id)[0];
  }
  function editProject(id, newTitle) {
    const project = getProject(id);
    project.title = newTitle;
    project.id = hash(newTitle);
    return project;
  }
  function deleteProject(id) {
    const idx = projectList.findIndex((project) => project.id === id);
    projectList.splice(idx, 1);
  }

  function getProjectList() {
    return projectList;
  }

  function loadProjects(list) {
    const allIds = getProjectIds();

    list.forEach((project) => {
      if (
        !allIds.includes(hash(project.title) && !allIds.includes(project.id))
      ) {
        addProject(project.title);
      }
    });
  }
  function clearAllProjects() {
    projectList.splice(0, projectList.length);
  }

  function isProjectIdValid(id) {
    return getProjectIds().includes(id);
  }

  function getProjectByTitle(title) {
    return getProjectList().filter((project) => project.title === title)[0];
  }

  function validateProject(projectObj) {
    if (isProjectIdValid(projectObj.id)) {
      const storedProject = getProject(projectObj.id);
      return projectObj.title === storedProject.title;
    }
    return false;
  }

  return {
    addProject,
    getProjectIds,
    getProject,
    editProject,
    deleteProject,
    getProjectList,
    loadProjects,
    clearAllProjects,
    getProjectByTitle,
    validateProject,
    isProjectIdValid,
  };
}

export default createProjectManager;
