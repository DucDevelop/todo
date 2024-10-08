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
    project: "Project 1",
    priority: 0,
  },
  {
    title: "Task1",
    description: "To do Task one in order to balbal",
    dueDate: new Date(),
    isDone: false,
    project: "Project 1",
    priority: 2,
  },
  {
    title: "Task0",
    description: "To do Task one in order to balbal",
    dueDate: new Date(),
    isDone: false,
    project: "Project 2",
    priority: 1,
  }
];

// fetch tasks from server and create objects from data
const storage = createStorageProcessor();
// storage.deleteTasks()
const tasks = createTasks(storage.loadTasks());
// storage.storeTasks(tasks.getTaskList())
const domCreator = createDOMCreator(document);

// // // create dom elements for each object
console.log(tasks.getProjectList())

// // let date = format(new Date("2014-10-05"), "dd-LLL");
// // console.log(date < new Date())
// tasks.getProjectList().forEach(project => {
//   document.querySelector('div#content')
//   .appendChild(domCreator.createProjectTasksContainer(tasks.getTaskList(), project));
// })
// document.querySelector('div#content')
// .appendChild(domCreator.createProjectTasksContainer(tasks.getTaskList(), null));
// document.querySelector('main')
// .appendChild(domCreator.generateTaskView(tasks.getTaskList(), tasks.getProjectList(), {filter: (todo) => todo.project === "Project 2", title: "Project 2"}));
document.querySelector('main')
.appendChild(domCreator.generateProjectView(tasks.getTaskList()));
// // console.log(tasks.taskList);
// // console.log(domCreator.createTasksContainer(tasks.taskList))
// // console.log(tasks.isTaskOverdue(tasklist[0].id))

console.log(hash(null))