const COLUMN_NAMES = ['toDo', 'inProgress', 'testing', 'done'];

const CATEGORY_COLORS = ['var(--marketing_color)', 'var(--it_color)', 'var(--accounting_color)', 'var(--organisation_color)'];
const CATEGORY_NAMES = ['marketing', 'it', 'accounting', 'organisation'];

const URGENCY_COLORS = ['var(--urgency_high_color)', 'var(--urgency_medium_color)', 'var(--urgency_low_color)'];
const URGENCY_NAMES = ['high', 'medium', 'low'];

const USER_NAMES = ['Klaus', 'Katja', 'Feli'];
const USER_Pic = ['../img/KlausWerner.jpg', '../img/KlausWerner.jpg', '../img/felimock.jpg'];

const CHECKBOX_NAMES = ['cb-1-day', 'cb-2-day', 'cb-35-day', 'cb-6p-day', 'cb-marketing', 'cb-it', 'cb-organisation', 'cb-high', 'cb-medium', 'cb-low'];

let current_drag_colName;
let current_drag_taskId;
let tasks;
let checkedElements = [];

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

function drag(colName, taskId) {
    current_drag_colName = colName;
    current_drag_taskId = taskId;
}

function drop(colName) {
    // help variable
    let targetColumn = colName;
    // get tasks indx
    let mainTaskIndx = tasksIndxOf(current_drag_colName, current_drag_taskId);
    // update data
    tasks[mainTaskIndx]['state'] = targetColumn;
    // update backend
    updateTasksBackend();
    // update board
    updateBoard();
    // clear dragHoverEffects
    hideDragHoverEffects();
}

/**
 * hide hover effects after drop event
 */
function hideDragHoverEffects() {
    for (colName of COLUMN_NAMES) {
        document.getElementById(`${colName}-grid`).classList.remove('dragHoverEffect');
    }
}

/**
 * add dragHoverEffect to a column
 * 
 * @param {string} colName 
 * @param {string} start_end -> 'start' || 'end' 
 */
function dragHoverEffect(colName, start_end) {
    if (start_end == 'start') {
        document.getElementById(`${colName}-grid`).classList.add('dragHoverEffect');
    }
    if (start_end == 'end') {
        document.getElementById(`${colName}-grid`).classList.remove('dragHoverEffect');
    }
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
function deleteComment(colName, taskId, commentId) {
    // get tasks indx
    let mainTaskIndx = tasksIndxOf(colName, taskId);
    // get comments
    let existComments = tasks[mainTaskIndx]['comments'];
    // delete element
    existComments.splice(commentId, 1);
    // update array
    tasks[mainTaskIndx]['comments'] = existComments;
    // update backend
    updateTasksBackend();
    // update board
    updateBoard();
    // comments hold open
    showCommands(colName, taskId, 'show');
}

/**
 * add a new comment to the array
 * 
 * @param {string} colName 
 * @param {int} taskId 
 */
function addCommand(colName, taskId) {
    // get tasks indx
    let mainTaskIndx = tasksIndxOf(colName, taskId);
    // get comments
    let existComments = tasks[mainTaskIndx]['comments'];
    // push comment
    let textAreaInput = document.getElementById(`${colName}-task-${taskId}-textarea`).value.trim();
    // if input ok:
    if (textAreaInput.length > 0) {
        // add comment
        let newComments = existComments
        newComments.push(textAreaInput);
        // update array
        tasks[mainTaskIndx]['comments'] = newComments;
        // update backend
        updateTasksBackend();
        // update board
        updateBoard();
        // comments hold open
        showCommands(colName, taskId, 'show');
    }
}

/**
 * update 'tasks' on serverStorage 
 */
function updateTasksBackend() {
    let stringTasks = JSON.stringify(tasks);
    backend.setItem('test_tasks_board_jklaf', stringTasks);
}

/**
 * get index from tasks, of search element
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @returns 
 */
function tasksIndxOf(colName, taskId) {
    let mainTaskIndx = -1;
    let columnTaskIndx = -1;

    for (task of tasks) {
        mainTaskIndx++;
        if (task['state'] == colName) {

            columnTaskIndx++;
            if (columnTaskIndx == taskId) {
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
            if (tasks[i]['state'] == currentColumnName && checkFilter(tasks[i])) {
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
    // clear column
    document.getElementById(`${colName}-tasks`).innerHTML = ``;
    // exist data?
    if (tasks.length == 0) {
        return;
    }
    // loop tasks and look for column elements
    for (let taskId = 0; taskId < tasks.length; taskId++) {
        createHTML_TaskGrid(colName, taskId, tasks);
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
    localStorage.setItem('newTaskFromBoard_columnName', columnName); // colNames: toDo, inProgress, testing, done
    localStorage.setItem('newTaskFromBoard_time', new Date().getTime());
    location.href = "../addTask/addTask.html";

    setBarLeft('addTask');

    console.log("goToAddTask: " + columnName);
    console.log("goToAddTask: " + new Date().getTime());
}

function addBoardTasksToTasks() {
    boardTasks = backend.getItem('boardTasks');
    boardTasks = JSON.parse(boardTasks);
    console.log(boardTasks);

    for (let taskId = 0; taskId < boardTasks.length; taskId++) {
        newTask = {};
        newTask['title'] = boardTasks[taskId]['title'];
        newTask['assignedTo'] = ['Klaus', 'Feli'];
        newTask['comments'] = [];
        newTask['startTask'] = boardTasks[taskId]['startdate'];
        newTask['state'] = 'toDo';
        newTask['category'] = boardTasks[taskId]['category'].toLowerCase();
        newTask['urgency'] = boardTasks[taskId]['urgency'].toLowerCase();
        // convert time to timestamp
        newTask['endTask'] = boardTasks[taskId]['enddate'];
        newTask['endTask'] = new Date(newTask['endTask']).getTime();
        // add to tasks
        tasks.push(newTask);

        console.log((newTask['endTask'] - newTask['startTask']));
    }

    clearBoardTasks();
}

function clearBoardTasks() {
    boardTasks = [];
    backend.setItem('boardTasks', JSON.stringify(boardTasks));
}

/**
 * if exist task, load from server, if not, load test data 
 */
async function loadTasks() {
    // load from server
    await downloadFromServer();

    // TESTZWECKE
    backend.deleteItem('test_tasks_board_jklaf');
    // TESTZWECKE

    tasks = backend.getItem('test_tasks_board_jklaf');

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
    // add new tasks from backlog

    addBoardTasksToTasks();
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

function addTimestampDay(days) {
    return days * 86400000;
}

/**
 * 3 predefined / test pseudo tasks
 * 
 * @returns returns 3 pseudo tasks
 */
function getTestTasks() {
    let startTaskTimestamp = new Date().getTime();

    tasks = [
        {
            'title': 'INPROGRESS 0',
            'category': 'IT'.toLowerCase(),
            'description': 'IT IT IT IT IT IT IT IT IT IT IT IT IT IT',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(1),
            'urgency': 'High'.toLowerCase(),
            'state': 'inProgress',
            'comments': ['command0-0', 'command0-1'],
            'assignedTo': ['Klaus', 'Katja']
        },
        {
            'title': 'INPROGRESS 0',
            'category': 'IT'.toLowerCase(),
            'description': 'IT IT IT IT IT IT IT IT IT IT IT IT IT IT',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(7),
            'urgency': 'High'.toLowerCase(),
            'state': 'inProgress',
            'comments': ['command0-0', 'command0-1'],
            'assignedTo': ['Klaus', 'Katja']
        },
        {
            'title': 'INPROGRESS 0',
            'category': 'IT'.toLowerCase(),
            'description': 'IT IT IT IT IT IT IT IT IT IT IT IT IT IT',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(6),
            'urgency': 'High'.toLowerCase(),
            'state': 'inProgress',
            'comments': ['command0-0', 'command0-1'],
            'assignedTo': ['Klaus', 'Katja']
        },
        {
            'title': 'INPROGRESS 0',
            'category': 'IT'.toLowerCase(),
            'description': 'IT IT IT IT IT IT IT IT IT IT IT IT IT IT',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(5),
            'urgency': 'High'.toLowerCase(),
            'state': 'inProgress',
            'comments': ['command0-0', 'command0-1'],
            'assignedTo': ['Klaus', 'Katja']
        },
        {
            'title': 'INPROGRESS 0',
            'category': 'IT'.toLowerCase(),
            'description': 'IT IT IT IT IT IT IT IT IT IT IT IT IT IT',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(4),
            'urgency': 'High'.toLowerCase(),
            'state': 'inProgress',
            'comments': ['command0-0', 'command0-1'],
            'assignedTo': ['Klaus', 'Katja']
        },

        {
            'title': 'TODO 1',
            'category': 'Marketing'.toLowerCase(),
            'description': 'Marketing Marketing Marketing Marketing Marketing Marketing Marketing Marketing Marketing Marketing',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(2),
            'urgency': 'Medium'.toLowerCase(),
            'state': 'toDo',
            'comments': ['command1-0', 'command1-1'],
            'assignedTo': ['Feli', 'Katja']
        },

        {
            'title': 'TODO 2',
            'category': 'Marketing'.toLowerCase(),
            'description': 'Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 Marketing2 ',
            'startTask': startTaskTimestamp,
            'endTask': startTaskTimestamp + addTimestampDay(3),
            'urgency': 'Low'.toLowerCase(),
            'state': 'toDo',
            'comments': [],
            'assignedTo': ['Klaus']
        }
    ];
    let strgTasks = JSON.stringify(tasks);
    backend.setItem('test_tasks_board_jklaf', strgTasks);

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
function createHTML_assignedTo(colName, taskId, tasks) {
    // get names
    let names = tasks[taskId]['assignedTo'];
    // create pics grid
    document.getElementById(`${colName}-task-${taskId}`).innerHTML += `
        <div id="${colName}-task-${taskId}-assignedTo-pics" class="user-pics-container"></div>
    `;
    // clear pics grid
    document.getElementById(`${colName}-task-${taskId}-assignedTo-pics`).innerHTML += ``;
    // loop users
    for (user of tasks[taskId]['assignedTo']) {
        // get indx of users
        let indxForPic = USER_NAMES.indexOf(user);
        // user not exist - > exception
        if (indxForPic == -1) {
            throw `${user} dont exist in USER_NAMES`;
        }
        // set pic
        else {
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
function createHTML_addComments(colName, taskId, tasks) {
    document.getElementById(`${colName}-task-${taskId}`).innerHTML +=

        `<div id="${colName}-task-${taskId}-commands-container" class="commands-container d-none"></div>`;

    for (let commentId = 0; commentId < tasks[taskId]['comments'].length; commentId++) {
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
function createHTML_dateTimeAndCommentsLogo(colName, taskId, tasks) {
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
function createHTML_setTitleAndDescription(colName, taskId, tasks) {
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
function createHTML_CategoryUrgency(colName, taskId, tasks) {
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
function createHTML_TaskGrid(colName, taskId, tasks) {
    // clear column
    document.getElementById(`${colName}-tasks`).innerHTML += `
        <div id="${colName}-task-${taskId}" class="task" draggable="true" ondragstart="drag('${colName}', ${taskId})" ></div>
        `;
    setColorOfTask(colName, taskId, tasks);
}

/**
 * set bg-color of task to see the urgency
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {tasks} tasks 
 */
function setColorOfTask(colName, taskId, tasks) {
    // get end of day timestamp
    let timeNow = new Date().getTime();
    let timeOverOfDay = timeNow % addTimestampDay(1);
    timeNow = timeNow - timeOverOfDay + addTimestampDay(1);
    // calc dif
    let dif = tasks[taskId]['endTask'] - timeNow;
    // set colors
    // if (dif >= addTimestampDay(5)) {
    //     document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_6p_day_color)';
    //     document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_6p_day_color)';
    // }
    // else if (dif < addTimestampDay(5)) {
    //     document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_35_day_color)';
    //     document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_35_day_color)';
    // }
    // else if (dif <= addTimestampDay(2)) {
    //     document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_2_day_color)';
    //     document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_2_day_color)';
    // }

    // day 1
    if (dif <= addTimestampDay(1)) {

        console.log(dif);
        console.log(addTimestampDay(1));
        console.log(colName);
        console.log(taskId);
        console.log("-----------");

        document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_1_day_color)';
        document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_1_day_color)';
        return;
    }
    // day 2
    if (dif <= addTimestampDay(2)) {
        document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_2_day_color)';
        document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_2_day_color)';
        return;
    }
    // day 3-5
    if (dif <= addTimestampDay(5)) {
        document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_35_day_color)';
        document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_35_day_color)';
        return;
    }
    // day 6+
    document.getElementById(`${colName}-task-${taskId}`).style.backgroundColor = 'var(--time_6p_day_color)';
    document.getElementById(`${colName}-task-${taskId}`).style.borderColor = 'var(--time_6p_day_color)';
    return;
}

//#endregion

/**
 * return true / false if element is checked
 * 
 * @param {string} id 
 * @returns 
 */
function isChecked(id) {
    return document.getElementById(id).checked
}

/**
 * fill checkedElements array with checked state
 * inside of array are saved id name 
 */
function changeStateCheckBox() {
    checkedElements = [];
    // add items which are checked
    for (id of CHECKBOX_NAMES) {
        if (isChecked(id)) {
            checkedElements.push(id);
        }
    }
    updateBoard();
}

function checkTimes(task, checkboxNamesIndizes) {
    // 1day
    let timeNow = new Date().getTime();
    let timeOverOfDay = timeNow % addTimestampDay(1);
    timeNow = timeNow - timeOverOfDay + addTimestampDay(1);

    let endTime = task['endTask'];
    let dif = endTime - timeNow;
    let from, to;

    let anyOK = false;
    for (checkBoxIndx of checkboxNamesIndizes) {
        // 1 day 
        if (checkBoxIndx == 0) {
            // set time area
            from = 0, to = addTimestampDay(1);
            // check is in time area
            if (dif >= from && dif <= to) {
                return true
            }
        }
        // 2 day 
        if (checkBoxIndx == 1) {
            // set time area
            from = addTimestampDay(1), to = addTimestampDay(2);
            // check is in time area
            if (dif >= from && dif <= to) {
                return true
            }
        }
        // 3-5 day 
        if (checkBoxIndx == 2) {
            // set time area
            from = addTimestampDay(2), to = addTimestampDay(5);
            // check is in time area
            if (dif >= from && dif <= to) {
                return true
            }
        }
        // 6+ day 
        if (checkBoxIndx == 3) {
            // set time area
            from = addTimestampDay(5);
            // check is in time area
            if (dif >= from) {
                return true
            }
        }
    }
    return false;
}

function checkFilter(task) {
    // no filter set
    if (checkedElements.length == 0) { return true; }
    // collect arrays to get a success report if only one is ok
    let timesCheckList = [];
    let categoryCheckList = [];
    let urgencyCheckList = [];
    // loop checked elements
    for (id of checkedElements) {
        let checkboxNamesIndx = CHECKBOX_NAMES.indexOf(id);
        // check the time we have
        if (checkboxNamesIndx <= 3) {
            timesCheckList.push(checkboxNamesIndx);
        }
        // check for category
        if (checkboxNamesIndx > 3 && checkboxNamesIndx <= 6) {
            categoryCheckList.push(checkboxNamesIndx);
        }
        // check for urgency
        if (checkboxNamesIndx > 6) {
            urgencyCheckList.push(checkboxNamesIndx);
        }
    }
    // check all criterias
    if (checkTimes(task, timesCheckList)) {
        return true;
    }
    return false;
}

/**
 * show and hide dropdownFilter menu
 */
function showDropdownFilter() {
    let existClass = document.getElementById('dropdownFilter').classList;
    let showExist = false;

    for (elm of existClass) {
        if (elm == 'show') { showExist = true; }
    }

    if (showExist) {
        document.getElementById('dropdownFilter').classList.remove('show');
    }
    else {
        document.getElementById('dropdownFilter').classList.add('show');
    }
}