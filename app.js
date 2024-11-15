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
// site music control start
let siteMusic = document.querySelector(".siteMusic");
let isPlaying = false;
const audio = new Audio("audio/relax.mp3");
audio.volume = 0.05;
siteMusic.addEventListener("click", () => {
  if (isPlaying == true) {
    isPlaying = false;
    audio.pause();
  } else {
    isPlaying = true;
    audio.play();
  }
});
// site music control end
let mood = "create";
let tasks = JSON.parse(localStorage.getItem("ToDoListTasksArray")) || [];
let tempTaskObject = {
  id: 0,
  description: " ",
  deadline: "",
  isCompleted: true,
};
displayTasks();
let idCounter =
  localStorage.getItem("ToDoIdCounter") !== null
    ? Number(localStorage.getItem("ToDoIdCounter"))
    : 0;
// social menu start
let openMenuBtn = document.querySelector(".openMenu");
let closeMenuBtn = document.querySelector(".closeMenu");
let body = document.querySelector("body");
openMenuBtn.addEventListener("click", () => {
  body.classList.add("blured");
});
closeMenuBtn.addEventListener("click", () => {
  body.classList.remove("blured");
});
// social menu end
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
  "body> .container .content .todoList .addTask i"
);
addTaskBtn.addEventListener("click", () => {
  body.style.overflow = "hidden";
  document.querySelector(
    ".addTaskWindow .container .content button"
  ).textContent = "create";
  mood = "create";
  createEditTasks();
});
closeAddTaskWindow.addEventListener("click", () => {
  addTaskWindow.classList.remove("active");
  body.style.overflow = "auto";
});
// add task window end
// ================= add data =============

function createEditTasks(itemTask) {
  let createTaskBtn = document.querySelector(
    ".addTaskWindow .container .content button"
  );
  addTaskWindow.classList.add("active");
  if (mood === "edit") {
    createTaskBtn.textContent = "update";
    let taskDescription = document.querySelector(
      ".addTaskWindow .container .content textarea"
    );
    let taskDeadLine = document.querySelector(
      ".addTaskWindow .container .content input"
    );
    taskDescription.value = itemTask.description;
    const deadlineDate = new Date(itemTask.deadline);
    const formattedDate = deadlineDate.toISOString().slice(0, 16); // صيغة YYYY-MM-DDTHH:MM

    taskDeadLine.value = formattedDate;
  }
  createTaskBtn.onclick = () => {
    let taskDescription = document.querySelector(
      ".addTaskWindow .container .content textarea"
    );
    let taskDeadLine = document.querySelector(
      ".addTaskWindow .container .content input"
    );
    if (taskDeadLine.value.trim() === "" || taskDeadLine.value.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "عبي مشان الله",
        text: "عبي الخيارات كلهن مشان الله مش فاضيلك",
        confirmButtonText: "ماشي؟",
      });
      return;
    }
    if (mood === "create") {
      tasks.push({
        id: idCounter++,
        description: taskDescription.value,
        deadline: new Date(taskDeadLine.value),
        isCompleted: false,
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "item has been added successfully.",
      });
      displayTasks();
      analysisChart();
    } else if (mood === "edit") {
      tasks = tasks.map((Dtask) => {
        if (Dtask.id === itemTask.id) {
          return {
            ...Dtask,
            description: taskDescription.value,
            deadline: new Date(taskDeadLine.value),
          };
        }
        return Dtask;
      });
      displayTasks();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "item has been updated successfully.",
      });
    }
    closeAddTaskWindow.click();
    document.querySelector(
      ".addTaskWindow .container .content textarea"
    ).value = "";
    document.querySelector(".addTaskWindow .container .content input").value =
      "";
  };

  displayTasks();
  localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
  localStorage.setItem("ToDoIdCounter", JSON.stringify(idCounter));
}

function displayTasks() {
  let tasksContainer = document.querySelector(
    "body> .container .content .todoList .todoListContent"
  );

  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    let finishedByTime = false;
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("item");
    taskDiv.setAttribute("data-aos", "fade-down");
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
    timeLeftDiv.textContent = "00 d 00 h 00 m 00 s";
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
          task.isCompleted = true;
          localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
          finishedByTime = true;
          timeLeftDiv.textContent = "time end";
          clearInterval(timeLeftInterval); // إيقاف التحديث عند انتهاء الوقت
          taskDiv.classList.add("done");
          actions.querySelector(".finished").textContent = "finished";
        }
      }, 1000);
    }
    startCountdown();
    if (task.isCompleted) {
      taskDiv.classList.add("done");
      clearInterval(timeLeftInterval);
    }

    actions.querySelector(".finished").onclick = () => {
      if (finishedByTime == true) {
        alert("you cant unfinished this task");
      } else {
        taskDiv.classList.toggle("done");
        if (taskDiv.classList.contains("done")) {
          clearInterval(timeLeftInterval);
          task.isCompleted = true;
          localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
        } else {
          task.isCompleted = false;
          localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
          startCountdown();
        }
        analysisChart();
      }
    };
    actions.querySelector(".deleteItem").onclick = () => {
      Swal.fire({
        title: "Are you sure you want to delete this task?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, i am sure!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          tasks = tasks.filter((Dtask) => {
            return Dtask.id != task.id;
          });
          localStorage.setItem("ToDoListTasksArray", JSON.stringify(tasks));
          displayTasks();
          analysisChart();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "item has been deleted successfully.",
          });
        }
      });
    };

    actions.querySelector(".editToDo").onclick = () => {
      mood = "edit";
      createEditTasks(task);
    };

    taskDiv.append(pDescription);
    taskDiv.append(actions);
    taskDiv.append(timeLeftDiv);
    tasksContainer.insertAdjacentElement("afterbegin", taskDiv);
  });
}

// analyzis start
let tasksChart; // تعريف متغير الرسم البياني في نطاق عام

function analysisChart() {
  let numOFtasks = tasks.length;
  let completedTasks = tasks.filter((task) => {
    return task.isCompleted == true;
  }).length;
  let NONcompletedTasks = numOFtasks - completedTasks;

  const ctx = document.getElementById("MyTasks").getContext("2d");

  // تدمير الرسم البياني إذا كان موجودًا
  if (tasksChart) {
    tasksChart.destroy();
  }

  // إنشاء الرسم البياني الجديد
  tasksChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["not completed", "completed"],
      datasets: [
        {
          label: "Tasks",
          data: [NONcompletedTasks, completedTasks],
          backgroundColor: ["#4CAF50", "#FF5733"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
}

analysisChart();
// analyzis end
