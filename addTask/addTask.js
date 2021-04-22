/**
 * Arry to save the values of add Task
 */
let tasks = [];

let users = [
    {
        'name': 'Katja'
    },
    {
        'name': 'Felicitas'
    },
    {
        'name': 'Klaus'
    }
];
let selectedUsers = [];

/**
 * 
 * funktion to push the values of input fields in addTask.html into Array tasks
 */
function addToTask() {
    let newTitle = document.getElementById('title-value');
    let newCategory = document.getElementById('select-category');
    let newDescription = document.getElementById('description');
    let urgency = document.getElementById('select-urgency');


    let task = {
        'title': newTitle.value,
        'category': newCategory.value,
        'description': newDescription.value,
        'date': new Date().getTime(),
        'urgency': urgency.value,
        'assignedTo': selectedUsers,
        'state': 'backlog',
        'comments': ''
    };
    tasks.push(task);
    console.log(tasks);
    newTitle.value = '';
    newCategory.value = '';
    newDescription.value = '';

    let tasksAsString = JSON.stringify(tasks);//wandelt das Array in einen String um
    backend.setItem('tasks', tasksAsString);//speichert ins backend
    showSuccsess();
    loadTasks();
};

/**
 * This function opens a pop window to show the user that the task has been saved
 * 
 */

function showSuccsess() {
    document.getElementById('popUp').classList.remove('d-none');
    document.getElementById('completeSreen').classList.remove('d-none');
    document.getElementById('taskWrap').classList.add('d-none');
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        document.getElementById('popUp').innerHTML = `
        <div class="pop-up-window p-4" id="popUp">
        <div class="close-element">
            <a onclick="closeSuccsess()" href="../addTask/addTask.html">close</a>
        </div>


        <h5 class="card-title">Your Task "${task['title']}" has been saved</h5>
        <p>You can now create a new Task, or visit Board or Backlog to
            continue working with this Task.</p>

        <button class="btn btn-primary">
            <span class="mdc-button__label"> <a class="text-light link"
                    href="../addTask/addTask.html">New
                    Task</a></span>
        </button>
        <button class="btn btn-primary">
            <span class="mdc-button__label"> <a class="text-light link"
                    href="../backlog/backlog.html">Backlog</a></span>
        </button>
        <button class="btn btn-primary">
            <span class="mdc-button__label"> <a class="text-light link"
                    href="../board/board.html">Board</a></span>
        </button>
    </div>
    `;
    }
};
function closeSuccsess() {
    document.getElementById('popUp').classList.add('d-none');
    document.getElementById('complete-screen').classList.add('d-none');
    document.getElementById('taskWrap').classList.remove('d-none');
};

/**
 * this funktion saves the array tasks in local storage
 * 
 */
async function loadTasks() {
  
    let tasksAsString = backend.getItem('tasks');//zieht daten aus dem Backend
    tasks = JSON.parse(tasksAsString);//wandelt in json um
    console.log('loaded all tasks', tasks)
};

/**
 * this function creates html items with the content of users array
 */
function showUsers() {
    let userList = document.getElementById('users');
    userList.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let newUser = users[i];
        userList.innerHTML += `

        <div class="form-check">
         <input onchange="updateTaskUser(${i})" class="form-check-input" type="checkbox" value="" id="${i}">
         <label class="form-check-label" for="defaultCheck1">
         ${newUser['name']}
        </label>

        
        `
            ;
    }
}
/**
 * 
 * this function pushes a user that was selected by checkbox in showUsers() to the array selectedUsers, or deletes the user if unchecked
 * 
 * @param {variable} i - this is the index of the elements of the users array
 */
function updateTaskUser(i) {
    if (document.getElementById(i).checked) {
        selectedUsers.push(users[i]['name']);
    } else {
        let indexOfSelectedUser = selectedUsers.indexOf(users[i]['name']);//Was macht indexOf?
        selectedUsers.splice(indexOfSelectedUser, 1);
    }
}
async function initAddTask() {
    await main_init();  
    await loadTasks();
    //tasks = JSON.parse(await backend.getItem('tasks')); //füllt beim laden das Array aus dem Backend!!!
 
    showUsers();
}


