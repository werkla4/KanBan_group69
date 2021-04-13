/**
 * Arry to save the values of add Task
 */
let tasks = [];

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
        'urgency': urgency.value
    }
    tasks.push(task);
    console.log(tasks);
    newTitle.value = '';
    newCategory.value = '';
    newDescription.value = '';

    let tasksAsString = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksAsString);
};

function loadTasks() {
    let tasksAsString = localStorage.getItem('tasks');
    tasks = JSON.parse(tasksAsString);
    console.log('loaded all taskd', tasks)
}

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
 * this function creates html items with the content of users array
 */
function showUsers() {
    let userList = document.getElementById('users');
    userList.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let newUser = users[i];
        userList.innerHTML += `
        <p>${newUser['name']}</p>
        <input onchange="updateSelectedUser(${i})" type="checkbox" name="" id="${i}">
        `;        
    }
}
/**
 * 
 * this function pushes a user that was selected by checkbox in showUsers() to the array selectedUsers, or deletes the user if unchecked
 * @param {*} i 
 */
function updateSelectedUser(i) {
    if(document.getElementById(i).checked) {
        selectedUsers.push(users[i]);
    }else {
        let indexOfSelectedUser = selectedUsers.indexOf(users[i]);//Was macht indexOf?
        selectedUsers.splice(indexOfSelectedUser, 1);
    }
    showUsers();
}