/**
 * Arry to save the values of add Task
 */
let tasks = [];
let selectedUsers = [];
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

/**
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
        'state' : 'backlog',
        'comments': ''
    }
    tasks.push(task);
    console.log(tasks);
    newTitle.value = '';
    newCategory.value = '';
    newDescription.value = '';

    let tasksAsString = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksAsString);
    // showTask();
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
        <p>${newUser['name']}</p>
        <input onchange="updateTaskUser(${i})" type="checkbox" name="" id="${i}">
        `;
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

/**
 * this function greats a pop up to show the task that was created
 * it will be active onlick on create task button
 */
function createPopUp() {
    document.getElementById('popUp').classList.remove('d-none');
    showTask();
};
/**
 * This 
 * 
 */

function showTask() {
    document.getElementById('popUpWindow').innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        document.getElementById('popUpWindow').innerHTML = `
    <div>
    <h2>Current Task</h2>
    <p>${task['title']}</p>
    <p>${task['category']}</p>
    <p>${task['description']}</p>
    <p>${task['date']}</p>
    <p>${task['urgency']}</p>
    <p>${task['assignedTo']}</p>
    <button>Save Task</button>
</div>
    `;
    }

};