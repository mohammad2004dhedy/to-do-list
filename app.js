/*
program guide : 
1-the user can switch between to do list to see the the list items or can switch to
the analysis where he can see the charts of how many items did he finished and how many items are not finished

2-each list time contain a text and dead line and finish button to toggle the task to finished or not
and a edit button to edit the task and delete button to delete the task

3-if the user want to unfinish an item whos dead line is 0 the program will reject the operation

4-when click on delete the app should remove the items form the list and update the list dynamically

5-on click on edit , the create task window will appear and filled with the old info of the clicked task and the user can edit 
the dead line or the the description

6- onclick on analysis the active class will be added to the content and if the user click list btn the active class will be removed from the content
 */

let tasks = JSON.parse(localStorage.getItem("ToDoListTasksArray")) || [];
let tempTaskObject = {
  id: 0,
  description: " ",
  deadline: "",
};
displayTasks();
let idCounter =
  localStorage.getItem("ToDoIdCounter") !== null
    ? Number(localStorage.getItem("ToDoIdCounter"))
    : 0;

// pagination start
let showTasks = document.querySelector(".container .pagination .showTasks");
let showAnalysis = document.querySelector(
  ".container .pagination .showAnalysis"
);
let content = document.querySelector(".container .content");
showTasks.addEventListener("click", () => {
  showTasks.classList.add("active");
  content.classList.remove("active");
  showAnalysis.classList.remove("active");
});
showAnalysis.addEventListener("click", () => {
  showTasks.classList.remove("active");
  showAnalysis.classList.add("active");
  content.classList.add("active");
});
// pagination end
// add task window start
let addTaskWindow = document.querySelector(".addTaskWindow");
let closeAddTaskWindow = document.querySelector(".closeAddTaskWindow");
let addTaskBtn = document.querySelector(
  "body> .container .content .todoList .addTask"
);
addTaskBtn.addEventListener("click", () => {
  addTaskWindow.classList.add("active");
});
closeAddTaskWindow.addEventListener("click", () => {
  addTaskWindow.classList.remove("active");
});
// add task window end
// ================= add data =============
let createTaskBtn = document.querySelector(
  ".addTaskWindow .container .content button"
);

createTaskBtn.addEventListener("click", () => {
  let taskDescription = document.querySelector(
    ".addTaskWindow .container .content textarea"
  ).value;
  let taskDeadLine = document.querySelector(
    ".addTaskWindow .container .content input"
  ).value;
  if (!taskDescription || !taskDeadLine) {
    alert("Please fill in both fields.");
    return; // إيقاف تنفيذ الكود إذا كانت الحقول فارغة
  }
  tasks.push({
    id: idCounter++,
    description: taskDescription,
    deadline: new Date(taskDeadLine),
  });
  document.querySelector(".addTaskWindow .container .content textarea").value =
    "";
  document.querySelector(".addTaskWindow .container .content input").value = "";

  displayTasks();
  closeAddTaskWindow.click();
  localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
  localStorage.setItem("ToDoIdCounter", JSON.stringify(idCounter));
});

function displayTasks() {
  let tasksContainer = document.querySelector(
    "body> .container .content .todoList .todoListContent"
  );

  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    let finishedByTime = false;
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("item");
    // إنشاء عناصر المهمة
    let pDescription = document.createElement("p");
    pDescription.innerHTML = task.description;

    let actions = document.createElement("div");
    actions.classList.add("actions");
    actions.innerHTML = `
      <button type="button" class="finished">finish</button>
      <button type="button" class="editToDo">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button type="button" class="deleteItem">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    `;
    let days, hours, minutes, seconds;
    let timeLeftDiv = document.createElement("div");
    timeLeftDiv.classList.add("timeLeft");
    timeLeftDiv.textContent = "calculating time ...";
    // تعريف العدّاد
    let timeLeftInterval;
    function startCountdown() {
      timeLeftInterval = setInterval(() => {
        let nowTime = new Date().getTime();
        let timeLeft = new Date(task.deadline).getTime() - nowTime;

        if (timeLeft > 0) {
          days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          timeLeft %= 1000 * 60 * 60 * 24;
          hours = Math.floor(timeLeft / (1000 * 60 * 60));
          timeLeft %= 1000 * 60 * 60;
          minutes = Math.floor(timeLeft / (1000 * 60));
          timeLeft %= 1000 * 60;
          seconds = Math.floor(timeLeft / 1000);
          timeLeftDiv.textContent = `${days} d ${hours} h ${minutes} m ${seconds} s`;
        } else {
          finishedByTime = true;
          timeLeftDiv.textContent = "time end";
          clearInterval(timeLeftInterval); // إيقاف التحديث عند انتهاء الوقت
          taskDiv.classList.add("done");
          actions.querySelector(".finished").textContent = "finished";
        }
      }, 1000);
    }
    startCountdown();

    actions.querySelector(".finished").onclick = () => {
      if (finishedByTime == true) {
      } else {
        taskDiv.classList.toggle("done");
        if (taskDiv.classList.contains("done")) clearInterval(timeLeftInterval);
        else startCountdown();
      }
    };
    actions.querySelector(".deleteItem").onclick = () => {
      alert("are you sure you want to delete this task ? ");
      tasks = tasks.filter((Dtask) => {
        return Dtask.id != task.id;
      });
      localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
      displayTasks();
    };
    actions.querySelector(".editToDo").onclick = () => {
      document.querySelector(".addTaskWindow").classList.add("active");
      let taskDescription = document.querySelector(
        ".addTaskWindow .container .content textarea"
      );
      let taskDeadLine = document.querySelector(
        ".addTaskWindow .container .content input"
      );
      taskDescription.value = task.description;
      if (!taskDescription || !taskDeadLine) {
        alert("Please fill in both fields.");
        return; // إيقاف تنفيذ الكود إذا كانت الحقول فارغة
      }
      tasks = tasks.map((Dtask) => {
        if (Dtask.id == task.id) {
          return {
            ...Dtask,
            description: taskDescription.value,
            deadline: new Date(taskDeadLine.value),
          };
        } else return Dtask;
      });
      localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
      displayTasks();
    };
    taskDiv.append(pDescription);
    taskDiv.append(actions);
    taskDiv.append(timeLeftDiv);
    tasksContainer.insertAdjacentElement("afterbegin", taskDiv);
  });
}
