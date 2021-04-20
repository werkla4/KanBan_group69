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
    loadTasks();//????
};

/**
 * This function opens a pop window to show the user that the task has been saved
 * 
 */

function showSuccsess() {
    document.getElementById('popUp').classList.remove('d-none');
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        document.getElementById('popUpWindow').innerHTML = `
        <div>
        <h2>Your Task ${task['title']} has been saved to backlog</h2><a href="#" onclick="closeSuccsess()">X</a>
        <button onclick="closeSuccsess()" class="btn btn-primary"><span class="mdc-button__label">CREATE NEW TASK</span></button>
        <button class="btn btn-primary"><span class="mdc-button__label"><a href="../backlog/backlog.html">GO TO BACKLOG</a></span></button>
        <button class="btn btn-primary"><span class="mdc-button__label"><a href="../board/board.html">GO TO BOARD</a></span></button>
        </div>
    `;
    }
};
function closeSuccsess() {
    document.getElementById('popUp').classList.add('d-none');
}

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
        selectedUsers.push(users[i]);
    } else {
        let indexOfSelectedUser = selectedUsers.indexOf(users[i]);//Was macht indexOf?
        selectedUsers.splice(indexOfSelectedUser, 1);
    }
}
async function initAddTask() {
    await main_init();  
    await loadTasks();
    //tasks = JSON.parse(await backend.getItem('tasks')); //füllt beim laden das Array aus dem Backend!!!
 
    showUsers();
}


