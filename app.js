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
let addTaskWindow = document.querySelector(".addTaskWindow");
let closeAddTaskWindow=document.querySelector(".closeAddTaskWindow");
let addTaskBtn = document.querySelector(
  "body> .container .content .todoList .addTask"
);
addTaskBtn.addEventListener("click", () => {
  addTaskWindow.classList.add("active");
});
closeAddTaskWindow.addEventListener("click", () => {
  addTaskWindow.classList.remove("active");
});
