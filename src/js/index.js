// dummy data for doing layout
import { format } from "date-fns";
import "./../css/index-styles.css";
import "./../css/sidebar-styles.css";
import "./../css/todo-container-style.css";
import "./../css/modal-style.css";
import hash from "object-hash";
import createTasks from "./modules/Tasks";
import createStorageProcessor from "./modules/StoreageProcessor";
import createDOMCreator from "./modules/DOMCreator"
import createProjectManager from "./modules/ProjectManager";
import createController from "./modules/Controller";

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
    project: {
      "id": "97e09f82d4f1a4d90457f89720e22e9152a3d77d",
      "title": "Cooking"
  },
    priority: 0,
  },
  {
    title: "Task1",
    description: "To do Task one in order to balbal",
    dueDate: new Date(),
    isDone: false,
    project:{
      "id": "115d65d935084549482eb745d10151e7040aeefa",
      "title": "Hello 3"
  },
    priority: 2,
  },
  {
    title: "Task0",
    description: "To do Task one in order to balbal",
    dueDate: new Date(),
    isDone: false,
    project: {
      "id": "11e788f93ba7ace621d25b8b6b4e1ed1893d50eb",
      "title": "Instrument"
  },
    priority: 1,
  }
];



// const dummyProjectList = [
//   {title: "Cooking"},
//   {title: "Instrument"},
//   {title: "HomeGym"},
// ]
// fetch tasks from server and create objects from data
const storage = createStorageProcessor();
// storage.deleteTasks()
const tasks = createTasks(storage.loadTasks());
// storage.storeTasks(tasks.getTaskList())
const domCreator = createDOMCreator(document);

const projectManager = createProjectManager();

const controller = createController(tasks, projectManager, domCreator, storage);

projectManager.loadProjects(storage.loadProjects());

// // // // create dom elements for each object
// console.log(projectManager.getProjectList())

// // // let date = format(new Date("2014-10-05"), "dd-LLL");
// // // console.log(date < new Date())
// // tasks.getProjectList().forEach(project => {
// //   document.querySelector('div#content')
// //   .appendChild(domCreator.createProjectTasksContainer(tasks.getTaskList(), project));
// // })
// // document.querySelector('div#content')
// // .appendChild(domCreator.createProjectTasksContainer(tasks.getTaskList(), null));
// // document.querySelector('main')
// // .appendChild(domCreator.generateTaskView(tasks.getTaskList(), tasks.getProjectList(), {filter: (todo) => todo.project === "Project 2", title: "Project 2"}));
// document.querySelector('main')
// .appendChild(domCreator.generateProjectView(tasks.getTaskList()));
// // document.querySelector('main')
// // .appendChild(domCreator.generateTaskView(tasks.getTaskList, ));
// // // console.log(tasks.taskList);
// // // console.log(domCreator.createTasksContainer(tasks.taskList))
// // // console.log(tasks.isTaskOverdue(tasklist[0].id))

// // document.querySelector('div.project-view + nav').appendChild(domCreator.createSidebarProjectList(projectManager.getProjectList()));

controller.renderView();
controller.renderSideBar();
console.log(projectManager.getProjectList())