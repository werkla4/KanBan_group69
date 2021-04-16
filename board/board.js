const COLUMN_NAMES = ['toDo', 'inProgress', 'testing', 'done'];

const CATEGORY_COLORS = ['var(--marketing_color)', 'var(--it_color)', 'var(--accounting_color)', 'var(--organisation_color)'];
const CATEGORY_NAMES = ['Marketing', 'IT', 'Accounting', 'Organisation'];

const URGENCY_COLORS = ['var(--urgency_high_color)', 'var(--urgency_medium_color)', 'var(--urgency_low_color)'];
const URGENCY_NAMES = ['High', 'Medium', 'Low'];

const USER_NAMES = ['Klaus', 'Katja', 'Feli'];
const USER_Pic = ['../img/KlausWerner.jpg', '../img/KlausWerner.jpg', '../img/KlausWerner.jpg'];

let current_drag_elm;
let tasks;

/**
 * called in body onload()
 */
 async function board_init() {
    // get server or test data
    await loadTasks();
    // reload board
    updateBoard();
}

// #region Drop Down 
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(elm_id) {
    current_drag_elm = elm_id;
}

function drop(id) {
}
//#endregion

/**
 * delete comment-item from tasks array
 * and update board
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {int} commentId 
 */
function deleteComment(colName, taskId, commentId){
    // get tasks indx
    let mainTaskIndx = tasksIndxOf(colName, taskId);
    // get comments
    let existComments = tasks[mainTaskIndx]['comments'];
    // delete element
    existComments.splice(commentId, 1);
    // update array
    tasks[mainTaskIndx]['comments'] = existComments;
    // update commands
    updateHTML_addComments(colName, mainTaskIndx, tasks);
    // update backend
    updateTasksBackend();
}

/**
 * add a new comment to the array
 * 
 * @param {string} colName 
 * @param {int} taskId 
 */
function addCommand(colName, taskId){
    // get tasks indx
    let mainTaskIndx = tasksIndxOf(colName, taskId);
    // get comments
    let existComments = tasks[mainTaskIndx]['comments'];
    // push comment
    let textAreaInput = document.getElementById(`${colName}-task-${taskId}-textarea`).value.trim();

    console.log(textAreaInput);
    console.log(colName);
    console.log(taskId);
    console.log(mainTaskIndx);

    if(textAreaInput.length > 0){
        // add comment
        let newComments = existComments
        newComments.push(textAreaInput);
        // update array
        tasks[mainTaskIndx]['comments'] = newComments;
        // update commands
        updateHTML_addComments(colName, taskId, tasks);
        // update backend
        updateTasksBackend();
    }
}

/**
 * update 'tasks' on serverStorage 
 */
function updateTasksBackend(){
    let stringTasks = JSON.stringify(tasks);
    backend.setItem('tasks', stringTasks);
}

/**
 * get index from tasks, of search element
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @returns 
 */
function tasksIndxOf(colName, taskId){
    let mainTaskIndx = -1;
    let columnTaskIndx = -1;

    for(task of tasks){
        mainTaskIndx++;
        if(task['state'] == colName){

            columnTaskIndx++;
            if(columnTaskIndx == taskId){
                // element found
                return mainTaskIndx;
            }
        }
    }
}

/**
 * loop tasks array and insert tasks in every column
 */
function updateBoard() {
    // loop columns and insert task
    for (currentColumnName of COLUMN_NAMES) {
        let currentTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]['state'] == currentColumnName) {
                currentTasks.push(tasks[i]);
            }
        }
        upDateColumn(currentColumnName, currentTasks);
    }
}

/**
 * fill the columns with the tasks
 * 
 * @param {string} colName 
 * @param {int} tasks 
 * @returns 
 */
function upDateColumn(colName, tasks) {
    // exist data?
    if (tasks.length == 0) {
        return;
    }
    // clear column
    document.getElementById(`${colName}-tasks`).innerHTML = ``;
    // loop tasks and look for column elements
    for (let taskId = 0; taskId < tasks.length; taskId++) {
        createHTML_TaskGrid(colName, taskId);
        createHTML_CategoryUrgency(colName, taskId, tasks);
        createHTML_setTitleAndDescription(colName, taskId, tasks);
        createHTML_dateTimeAndCommentsLogo(colName, taskId, tasks);
        createHTML_addComments(colName, taskId, tasks);
        createHTML_assignedTo(colName, taskId, tasks);
    }
}

/**
 * save columnName in localStorage
 * and open addTask.html
 * 
 * @param {string} columnName 
 */
function goToAddTask(columnName) {
    localStorage.setItem('newTaskFromBoard_columnName', columnName);
    localStorage.setItem('newTaskFromBoard_time', new Date().getTime());
    location.href = "../addTask/addTask.html";
    
    console.log("goToAddTask: " + columnName);
    console.log("goToAddTask: " + new Date().getTime());
}

/**
 * if exist task, load from server, if not, load test data 
 */
async function loadTasks() {
    // load from server
    await downloadFromServer();
    tasks = backend.getItem('tasks');
    // nothing exist?
    if (tasks == null) {
        // set test tasks
        tasks = getTestTasks();
        console.log('loadTasks: tasks == null -> getTestTasks()');
    }
    // parse JSON file
    else {
        tasks = JSON.parse(tasks);
        console.log('load json from server');
    }
    console.log(tasks);
}

/**
 * show or hide the commands
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {string} showState "show" || "hide"
 */
function showCommands(colName, taskId, showState) {

    if (showState == "show") {
        document.getElementById(`${colName}-task-${taskId}-commands-container`).classList.remove('d-none');
    }
    if (showState == "hide") {
        document.getElementById(`${colName}-task-${taskId}-commands-container`).classList.add('d-none');
    }

}

/**
 * 3 predefined / test pseudo tasks
 * 
 * @returns returns 3 pseudo tasks
 */
function getTestTasks() {
    tasks = [
        {
            'title': 'INPROGRESS 0',
            'category': 'IT',
            'description': 'IT IT IT IT IT IT IT IT IT IT IT IT IT IT',
            'startTask': new Date().getTime(),
            'endTask': new Date().getTime(),
            'urgency': 'High',
            'state': 'inProgress',
            'comments': ['command0-0', 'command0-1'],
            'assignedTo': ['Klaus', 'Katja']
        },

        {
            'title': 'TODO 1',
            'category': 'Marketing',
            'description': 'Marketing Marketing Marketing Marketing Marketing Marketing Marketing Marketing Marketing Marketing',
            'startTask': new Date().getTime(),
            'endTask': new Date().getTime(),
            'urgency': 'Medium',
            'state': 'toDo',
            'comments': ['command1-0', 'command1-1'],
            'assignedTo': ['Feli', 'Katja']
        },

        {
            'title': 'TODO 2',
            'category': 'Marketing',
            'description': 'Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 ',
            'startTask': new Date().getTime(),
            'endTask': new Date().getTime(),
            'urgency': 'Low',
            'state': 'toDo',
            'comments': [],
            'assignedTo': ['Klaus']
        }
    ];
    let strgTasks = JSON.stringify(tasks);
    backend.setItem('tasks', strgTasks);

    // let backendfile = backend.getItem('tasks');
    // console.log("backendfile : " + backendfile);

    return tasks;
}

//#region html creator:

/**
 * add html code: assignedTo usersPic 
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 */
 function createHTML_assignedTo(colName, taskId, tasks){
    // get names
    let names = tasks[taskId]['assignedTo'];
    // create pics grid
    document.getElementById(`${colName}-task-${taskId}`).innerHTML += `
        <div id="${colName}-task-${taskId}-assignedTo-pics" class="user-pics-container"></div>
    `;
    // clear pics grid
    document.getElementById(`${colName}-task-${taskId}-assignedTo-pics`).innerHTML += ``;
    // loop users
    for(user of tasks[taskId]['assignedTo']){
        // get indx of users
        let indxForPic = USER_NAMES.indexOf(user);
        // user not exist - > exception
        if(indxForPic == -1){ 
            throw `${user} dont exist in USER_NAMES`; 
        }
        // set pic
        else{
            document.getElementById(`${colName}-task-${taskId}-assignedTo-pics`).innerHTML += `
                <img src="${USER_Pic[indxForPic]}" class="task-user-pic">
            `;
        }
    }
}

/**
 * create comments and the input textarea
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 * @returns 
 */
 function updateHTML_addComments(colName, taskId, tasks){
     // reset comments
    document.getElementById(`${colName}-task-${taskId}-commands-container`).innerHTML = ``;
    // add new comments
    for(let commentId = 0; commentId < tasks[taskId]['comments'].length; commentId++){
        document.getElementById(`${colName}-task-${taskId}-commands-container`).innerHTML += `

        <div id="${colName}-task-${taskId}-command-${commentId}" class="command-attributes">
            <span class="command">
            ${tasks[taskId]['comments'][commentId]}
            </span>
            <img src="../img/recycle-bin.png" class="task-recycle-icon" onclick="deleteComment('${colName}', ${taskId}, ${commentId})">
        </div>
        
        `;
    }
    // write new comments and hide comments
    document.getElementById(`${colName}-task-${taskId}-commands-container`).innerHTML += `
        <div class="add-command-container">
            <textarea id="${colName}-task-${taskId}-textarea" placeholder="write a command..." type="text" minlength="10"></textarea>
            <img src="../img/check-mark.png" class="command-check-icon" onclick="addCommand('${colName}', ${taskId})">
        </div>  
        <span class="hide-commands-txt" onclick="showCommands('${colName}', ${taskId}, 'hide')"> | close commands |</span>
    `; 
    // set n-comments
    document.getElementById(`${colName}-task-${taskId}-n-commands`).innerHTML = tasks[taskId]['comments'].length;
}


/**
 * create comments and the input textarea
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 * @returns 
 */
function createHTML_addComments(colName, taskId, tasks){
    document.getElementById(`${colName}-task-${taskId}`).innerHTML += 
        
        `<div id="${colName}-task-${taskId}-commands-container" class="commands-container d-none"></div>`;

    for(let commentId = 0; commentId < tasks[taskId]['comments'].length; commentId++){
        document.getElementById(`${colName}-task-${taskId}-commands-container`).innerHTML += `

        <div id="${colName}-task-${taskId}-command-${commentId}" class="command-attributes">
            <span class="command">
            ${tasks[taskId]['comments'][commentId]}
            </span>
            <img src="../img/recycle-bin.png" class="task-recycle-icon" onclick="deleteComment('${colName}', ${taskId}, ${commentId})">
        </div>
        
        `;
    }
    // write new comments and hide comments
    document.getElementById(`${colName}-task-${taskId}-commands-container`).innerHTML += `
        <div class="add-command-container">
            <textarea id="${colName}-task-${taskId}-textarea" placeholder="write a command..." type="text" minlength="10"></textarea>
            <img src="../img/check-mark.png" class="command-check-icon" onclick="addCommand('${colName}', ${taskId})">
        </div>  
        <span class="hide-commands-txt" onclick="showCommands('${colName}', ${taskId}, 'hide')"> | close commands |</span>
    `; 
}

/**
 * set expiration date and n-commants
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 */
function createHTML_dateTimeAndCommentsLogo(colName, taskId, tasks){
    document.getElementById(`${colName}-task-${taskId}`).innerHTML += `

    <div class="task-expiration-date-row">  
        <div class="n-commands-container" onclick="showCommands('${colName}', ${taskId}, 'show')">
            <span id="${colName}-task-${taskId}-n-commands">2</span>
            <img src="../img/feedback.png" class="task-feedback-icon">
        </div>                             
        <span id="${colName}-task-${taskId}-date">16.05.1987</span>
        <img src="../img/icons8-calendar-150.png" class="task-calender-icon">
    </div>

    `;
    // set n-comments
    document.getElementById(`${colName}-task-${taskId}-n-commands`).innerHTML = tasks[taskId]['comments'].length;
    // set end data
    let dateTime = new Date(tasks[taskId]['endTask']);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; // month: 'long' -> 'april'
    document.getElementById(`${colName}-task-${taskId}-date`).innerHTML = `${dateTime.toLocaleDateString('de-DE', options)}`;
}


/**
 * set title and text an task
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 */
 function createHTML_setTitleAndDescription(colName, taskId, tasks){
    document.getElementById(`${colName}-task-${taskId}`).innerHTML += `

        <h2 id="${colName}-task-${taskId}-title">${tasks[taskId]['title']}</h2>
        <p id="${colName}-task-${taskId}-discreption">${tasks[taskId]['description']}</p>

    `;
}

/**
 * create the bar and the dot on the head of task
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 */
 function createHTML_CategoryUrgency(colName, taskId, tasks){
    // set code snippet
    document.getElementById(`${colName}-task-${taskId}`).innerHTML = `
    <div class="row-category-urgency">
        <div id="${colName}-task-${taskId}-category" class="task-category"></div>
        <div id="${colName}-task-${taskId}-urgency" class="task-urgency"></div>
    </div>
    `;
    // get indx of colors
    let categoryColorIndx = CATEGORY_NAMES.indexOf(tasks[taskId]['category']);
    let urgencyColorIndx = URGENCY_NAMES.indexOf(tasks[taskId]['urgency']);
    // set colors
    document.getElementById(`${colName}-task-${taskId}-category`).style.backgroundColor = CATEGORY_COLORS[categoryColorIndx];
    document.getElementById(`${colName}-task-${taskId}-urgency`).style.backgroundColor = URGENCY_COLORS[urgencyColorIndx];
}

/**
 * @param {string} colName 
 * @param {int} taskId 
 */
 function createHTML_TaskGrid(colName, taskId) {
    // clear column
    document.getElementById(`${colName}-tasks`).innerHTML += `
        <div id="${colName}-task-${taskId}" class="task" draggable="true" ondragstart="drag('${colName}-task-${taskId}')"></div>
        `;
}   
//#endregion