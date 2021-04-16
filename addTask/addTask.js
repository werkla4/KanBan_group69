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
    }
    tasks.push(task);
    console.log(tasks);
    newTitle.value = '';
    newCategory.value = '';
    newDescription.value = '';

    let tasksAsString = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksAsString);
    showSuccsess();
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
        <h2>Your Task ${task['title']} has been saved to backlog</h2>
        <button">CREATE NEW TASK</button>
        <button">GO TO BACKLOG</button>
        <button">GO TO BOARD</button>
        </div>
    `;
    }
};

/**
 * this funktion saves the array tasks in local storage
 * 
 */
function loadTasks() {
    let tasksAsString = localStorage.getItem('tasks');
    tasks = JSON.parse(tasksAsString);
    console.log('loaded all taskd', tasks)
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


