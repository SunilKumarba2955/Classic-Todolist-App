var TodoListApp = (function () {
  let tasks = [];
  const tasksList = document.getElementById("task-list"); // array to store all the tasks 
  const addTaskInput = document.getElementById("add"); // element to hold the task list
  const tasksCounter = document.getElementById("tasks-counter"); // input element to add new task
  const tasksLeft = document.getElementById("task-left"); // element to display total number of tasks

  console.log("Working");

  // function to fetch the todo list from a remote server
  function fetchTodos() {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        tasks = data.slice(0, 10);
        // Translate the title field of each task using the Google Translate API
        tasks.forEach((task) => {
          fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${task.title}`
          )
            .then((response) => response.json())
            .then((data) => {
              task.title = data[0][0][0];
              task.title = task.title.charAt(0).toUpperCase() + task.title.slice(1);
              renderList();
            });
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  // function to add a task to the DOM
  function addTaskToDOM(task,i) {
    let li = document.createElement("li");

    let input = document.createElement("input");
    input.setAttribute("id", task.id);
    input.type = "checkbox";
    input.className = "custom-checked";

    let label = document.createElement("label");
    label.setAttribute("for", task.id);
    label.innerHTML = task.title;

    let img = document.createElement("img");
    img.src = "./Images/bin.svg";
    img.setAttribute("data-id", task.id);
    img.className = "delete";
    img.alt = "delete";

    if (task.completed) {
      input.setAttribute("checked", "");
      label.style.color = '#a19e9e';
    } else {
      label.style.color = '#fff';
    }

    li.appendChild(input);
    li.appendChild(label);
    li.appendChild(img);
    tasksList.append(li);
  }

  // function to display only the uncompleted tasks
  function unCompleted() {
    tasksList.innerHTML = "";
    for (let i = tasks.length-1 ; i >= 0 ; i--) {
      if (!tasks[i].completed) {
        addTaskToDOM(tasks[i],i);
      }
    }
  }

  // function to display only the completed tasks
  function completed() {
    tasksList.innerHTML = "";
    for (let i = tasks.length-1 ; i >= 0 ; i--) {
      if (tasks[i].completed) {
        addTaskToDOM(tasks[i],i);
      }
    }
  }

  // Function to mark all tasks as completed
  // Prompts the user to confirm if they want to mark all tasks as completed
  // If confirmed, loops through the task list and sets the completed property of each task to true
  // Clears the task list element and displays all tasks with updated completed status
  function complete_all_task() {
    let val = confirm("Are you sure...! Did you Completed all task?");
    if (val) {
      tasksList.innerHTML = "";
      for (let i = 0; i < tasks.length; i++) {
        tasks[i].completed = true;
        addTaskToDOM(tasks[i], i);
      }

      tasksCounter.innerHTML = tasks.length;
      tasksLeft.innerHTML = 0;
    }
  }

  // Clears the task list element and displays the updated list
  function clear_completed_tasks() {
    const newTasks = tasks.filter(function (task) {
        return !task.completed;
    });
    tasks = newTasks;
    renderList();
    // showNotification("Completed Tasks are cleared :)");
}

  // Rendering the list in Output 
  function renderList() {
    tasksList.innerHTML = "";
    let c = 0;

    for (let i = tasks.length-1; i >=0 ; i--) {
      if (tasks[i].completed) {
        c++;
      }
      addTaskToDOM(tasks[i],i);
    }

    tasksCounter.innerHTML = tasks.length;
    tasksLeft.innerHTML = tasks.length - c;
  }

  // Toggling Function to mark task completed or not
  function toggleTask(taskId) {
    const task = tasks.filter(function (task) {
      return task.id == Number(taskId);
    });

    if (task.length > 0) {
      const currentTask = task[0];

      currentTask.completed = !currentTask.completed;
      renderList();
      return;
    }

    showNotification("Task could not be toggled");
  }


  // Function to delete the task
  function deleteTask(taskId) {

    let val = confirm('Do you want remove this task?');
    if(val==true) {
      const newTasks = tasks.filter(function (task) {
        return task.id !== Number(taskId);
      });
  
      tasks = newTasks;
      renderList();
      // showNotification("Task removed....!");
    }
  }


  // Adding the task into the task list or appending
  function addTask(task) {
    if (task) {
      task.title = task.title.charAt(0).toUpperCase() + task.title.slice(1);
      tasks.push(task);
      renderList();
      showNotification("New task added..!");
      return;
    }

    showNotification("Empty text task cannot be added");
  }


  // Showing the notification using alert box.
  function showNotification(text) {
    alert(text);
  }
  

  // Handling the event if the user click or presses the enter nothing but adding task to task list
  function handleInputKeypress(e) {
    if (e.key == "Enter" ) {
      const text = e.target.value;
      console.log("text", text);

      if (!text) {
        showNotification("Task text cannot be empty");
        return;
      }

      const task = {
        title: text,
        id: Date.now(),
        completed: false,
      };

      e.target.value = "";
      addTask(task);
    }
  }

  function handleClickListener(e) {
    const target = e.target;
    // console.log(target.classList);  

     // Check if the target element is the delete button
    if (target.className === "delete") {
      const taskId = target.dataset.id;
      deleteTask(taskId);
      return;
    } 
    
    // Check if the target element is the checkbox
    else if (target.className == "custom-checked") {
      const taskId = target.id;
      toggleTask(taskId);
      return;
    } 
    
    // Check if the target element is the 'completed' button
    else if(target.id == 'completed') {
      completed();
      return;
    } 
    
    // Check if the target element is the 'uncompleted' button
    else if(target.id == 'uncomplete') {
      unCompleted();
      return;
    } 
    
    // Check if the target element is the 'all' button
    else if(target.id == 'all') {
      renderList();
      return;
    } 
    
    // Check if the target element is the 'complete-task' button
    else if(target.id == 'complete-task') {
      complete_all_task();
      return;
    } 
    
    // Check if the target element is the 'clear-completed' button
    else if(target.id == 'clear-completed') {
      clear_completed_tasks();
      return;
    } 
    
    // Check if the target element is '+' icon by its class name or icon name
    else if(target.classList.value === 'fa-solid fa-plus') {
      let ID = document.getElementById('add');
      let text = ID.value;

      if (!text) {
        // showNotification("Todo text cannot be empty");
        return;
      }

      const task = {
        title: text,
        id: Date.now(),
        completed: false,
      };

      e.target.value = "";
      addTask(task);
      ID.value = "";
      return;
    }
  }

  // This code is adding an event listener to each list item in the document, and when an item is clicked, it updates the position and width of the underline element to match the current item, and adds the "visible" and "active-item" classes to it. Additionally, it removes the "active-item" class from any other list items that may have it. This creates a visual indication of which list item is currently selected.
  const listItems = document.querySelectorAll(".list-item");
  const underline = document.querySelector(".underline");

  listItems.forEach((item) => {
    item.addEventListener("click", function () {
      underline.style.width = this.offsetWidth + "px";
      underline.style.left = this.offsetLeft + "px";
      underline.classList.add("visible");
      this.classList.add("active-item");
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i] != this) listItems[i].classList.remove("active-item");
      }
    });
  });


  //Function to initialize the app by fetching the todo list and adding event listeners to the input and document.
  function initializeApp() {
    fetchTodos();
    addTaskInput.addEventListener("keyup", handleInputKeypress);
    document.addEventListener("click", handleClickListener);
  }



  // This return statement is creating an object with a single property, "initialize", which is assigned the value of the initializeApp function. This allows for the initializeApp function to be accessed and executed publicly by calling TodoListApp.initialize().
  return {
    initialize: initializeApp,
  };
})();
