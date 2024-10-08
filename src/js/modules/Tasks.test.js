import createTask from "./Tasks";
import hash from "object-hash";

const task = createTask();

beforeAll(() => {});

describe("Test task creation", () => {
  // Applies only to tests in this describe block
  const title = "Task0";
  const description = "To do Task one in order to balbal";
  const dueDate = new Date();
  const isDone = false;
  const project = null;
  const priority = 0;
  let taskObj = null;

  beforeEach(() => {
    taskObj = task.createTask(
      title,
      description,
      dueDate,
      isDone,
      project,
      priority,
    );
  });

  afterEach(() => {
    task.clearTaskList();
  });

  test("Create single task", () => {
    const { id, ...rest } = taskObj;

    expect(rest).toEqual({
      title,
      description,
      dueDate,
      isDone,
      project,
      priority,
    });
  });

  test("ID is the hash of objects content", () => {
    const { id, ...rest } = taskObj;
    expect(hash(rest)).toBe(taskObj.id);
  });

  test("Task added to tasklist", () => {
    expect(task.getTaskList().length).toBe(0);
    task.addTask(taskObj);
    expect(task.getTaskList().length).toBe(1);
  });

  test("No duplicate task added to tasklist", () => {
    expect(task.getTaskList().length).toBe(0);
    task.addTask(taskObj);
    task.addTask(taskObj);
    expect(task.getTaskList().length).toBe(1);
  });

  test("Get task by id", () => {
    task.addTask(taskObj);
    const obj = task.getTaskList()[0];
    expect(task.getTask(obj.id)).toEqual(obj);
  });
  test("Set task property", () => {
    task.addTask(taskObj);
    const obj = task.getTaskList()[0];
    const prop = {
      project: "world",
      title: "Task1",
      description: "Hello World!",
    };

    task.setTaskProp(obj.id, "project", prop.project);
    task.setTaskProp(obj.id, "title", prop.title);
    task.setTaskProp(obj.id, "description", prop.description);

    expect(task.getTask(obj.id).project).toEqual(prop.project);
    expect(task.getTask(obj.id).title).toEqual(prop.title);
    expect(task.getTask(obj.id).description).toEqual(prop.description);
  });

  test("clear tasks", () => {
    task.addTask(taskObj);
    task.clearTaskList();
    expect(task.getTaskList()).toEqual([]);
  });

  test("Populate with array of objects", () => {
    const todoItems = [
      {
        title: "Task0",
        description: "To do Task one in order to balbal",
        dueDate: new Date(),
        isDone: false,
        project: null,
        priority: 0,
      },
      {
        title: "Task0",
        description: "To do Task one in order to balbal",
        dueDate: new Date(),
        isDone: false,
        project: null,
        priority: 0,
      },
      {
        title: "Task1",
        description: "To do Task one in order to balbal",
        dueDate: new Date(),
        isDone: false,
        project: {
          id: "115d65d935084549482eb745d10151e7040aeefa",
          title: "Hello 3",
        },
        priority: 2,
      },
      {
        title: "Task0",
        description: "To do Task one in order to balbal",
        dueDate: new Date(),
        isDone: false,
        project: {
          id: "115d65d935084549482eb745d10151e7040aeefa",
          title: "Hello 3",
        },
        priority: 1,
      },
    ];

    const todos = createTask(todoItems);

    todos.getTaskList().forEach((todo) => {
      const { id, ...rest } = todo;
      expect(todoItems).toContainEqual(rest);
    });
  });
});
