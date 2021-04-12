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



/**
 * function to save to local storage
 * @param {tasks} key
 * @param {tasks} array
 */
// function saveArrayToLocalStorage(key, tasks){
//     localStorage.setItem(key, JSON.stringify(tasks));
// }

// function getArray(key){
//     return JSON.parse(localStorage.getItem(key));
// }