import createProjectManager from "./ProjectManager";
import hash from "object-hash";

const projectManager = createProjectManager();

beforeAll(() => {});

describe("Project creation", () => {
  // Applies only to tests in this describe block

  beforeEach(() => {});

  afterEach(() => {
    projectManager.clearAllProjects();
  });

  test("Create single project", () => {
    const title = "Test";
    projectManager.addProject(title);

    expect(projectManager.getProjectList().length).toBe(1);
    expect(projectManager.getProjectList()[0]).toEqual({
      title,
      id: hash(title),
    });
  });
  test("Retrieve project by id", () => {
    const title = "Test";
    projectManager.addProject(title);
    const project = projectManager.getProject(hash(title));
    expect(project.title).toBe(title);
  });
  test("Edit project title", () => {
    const title = "Test";
    const titleNew = "Test2";
    projectManager.addProject(title);
    projectManager.editProject(hash(title), titleNew);

    const projectNew = projectManager.getProject(hash(titleNew));
    expect(projectNew.title).toBe(titleNew);
    // old id invalid
    expect(projectManager.getProject(hash(title))).toBe(undefined);
  });
  test("Get project IDs", () => {
    const title = "Test";
    const titleNew = "Test2";
    projectManager.addProject(title);
    projectManager.addProject(titleNew);
    const projectIds = projectManager.getProjectIds();
    expect(projectIds).toContain(hash(titleNew));
    expect(projectIds).toContain(hash(title));
  });
  test("Clear all", () => {
    const title = "Test";
    const titleNew = "Test2";
    projectManager.addProject(title);
    projectManager.addProject(titleNew);
    const projectList = projectManager.getProjectList();
    expect(projectList.length).toBe(2);
    projectManager.clearAllProjects();
    expect(projectList.length).toBe(0);
  });

  test("Load List of projects", () => {
    const projects = [
      {
        id: null,
        title: "projectx",
      },
      {
        id: 12312,
        title: "projecty",
      },
      {
        id: "null",
        title: "projectz",
      },
    ];

    projectManager.loadProjects(projects);
    const projectList = projectManager.getProjectList();
    const projectIds = projectManager.getProjectIds();

    expect(projectList.length).toBe(3);
    expect(projectIds.length).toBe(3);

    expect(projectList).toContainEqual({
      id: hash(projects[0].title),
      title: projects[0].title,
    });

    expect(projectList).toContainEqual({
      id: hash(projects[1].title),
      title: projects[1].title,
    });
    
    expect(projectList).toContainEqual({
      id: hash(projects[2].title),
      title: projects[2].title,
    });
  });
});
