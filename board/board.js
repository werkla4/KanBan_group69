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
 * considered filters!
 */
function updateBoard() {
    // loop columns and insert task
    for (currentColumnName of COLUMN_NAMES) {
        let currentTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]['state'] == currentColumnName && checkFilter(tasks[i]) && searchWords(tasks[i])) {
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

/**
 * here is the connection point between backlog and board
 * converts backlog keys to board keys
 */
function addBoardTasksToTasks() {
    // get backlog tasks
    boardTasks = backend.getItem('boardTasks');
    boardTasks = JSON.parse(boardTasks);
    // not exist key
    if (boardTasks == null) {
        console.log("BOARD TASK IS NULL, NOTHING LOADED!!");
        clearBoardTasks();
        return;
    }
    // add boardTasks (from backlog) to tasks (board)
    for (let taskId = 0; taskId < boardTasks.length; taskId++) {
        newTask = {};
        newTask['title'] = boardTasks[taskId]['title'];
        newTask['assignedTo'] = ['Klaus', 'Feli'];
        newTask['comments'] = [];
        newTask['startTask'] = boardTasks[taskId]['startdate'];
        newTask['state'] = 'toDo';
        newTask['category'] = boardTasks[taskId]['category'].toLowerCase();
        newTask['urgency'] = boardTasks[taskId]['urgency'].toLowerCase();
        newTask['description'] = boardTasks[taskId]['description'];
        // convert time to timestamp
        newTask['endTask'] = boardTasks[taskId]['enddate'];
        newTask['endTask'] = new Date(newTask['endTask']).getTime();
        newTask['endTaskDate'] = timestampToDate(newTask['endTask']);
        // add to tasks
        tasks.push(newTask);

        console.log((newTask['endTask'] - newTask['startTask']));
    }
    // clear board tasks []
    clearBoardTasks();
    // save tasks with added board tasks on server
    updateTasksBackend();
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
    // backend.deleteItem('test_tasks_board_jklaf');
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

/**
 * convert timestamp to this dateformat -> "16.5.1987"
 * 
 * @param {int} timestamp 
 * @returns 
 */
function timestampToDate(timestamp){
    let dateTime = new Date(timestamp);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; // month: 'long' -> 'april'
    return dateTime.toLocaleDateString('de-DE', options);
}

/**
 * return n milliseconds per day
 * 
 * @param {int} days 
 * @returns 
 */
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
            'comments': ['command0-0', 'katja-1'],
            'assignedTo': ['Katja']
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
            'category': 'Organisation'.toLowerCase(),
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
    // add Date format
    addEndTaskDate(tasks);
    // save on server
    let strgTasks = JSON.stringify(tasks);
    backend.setItem('test_tasks_board_jklaf', strgTasks);
    // return tasks
    return tasks;
}

/**
 * add new key: endTaskDate -> 16.5.1987 (convert timestamp to dateformat)
 * @param {JSON[]} tasks 
 */
function addEndTaskDate(tasks){
    // loop all elements
    for(task of tasks){
        task['endTaskDate'] = timestampToDate(task['endTask']);
        console.log(task);
    }
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

/**
 * no checked criteria:
 * if length == 0 -> return true
 * 
 * any checked criteria is successful:
 * if one criteria of list is ok -> return true
 * 
 * @param {JSON} task 
 * @param {int[]} checkboxNamesIndizes 
 * @returns 
 */
function checkTimes(task, checkboxNamesIndizes) {
    // no filter, show all
    if (checkboxNamesIndizes.length == 0) { return true; }
    // make this day and plus search days -> 1day filter = today and tomorrow!
    let timeNow = new Date().getTime();
    let timeOverOfDay = timeNow % addTimestampDay(1);
    timeNow = timeNow - timeOverOfDay + addTimestampDay(1);

    let endTime = task['endTask'];
    let dif = endTime - timeNow;
    let from, to;

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

/**
 * no checked criteria:
 * if length == 0 -> return true
 * 
 * any checked criteria is successful:
 * if one criteria of list is ok -> return true
 * 
 * @param {JSON} task 
 * @param {int[]} checkboxNamesIndizes 
 * @returns 
 */
function checkCategory(task, checkboxNamesIndizes) {
    // show all, if no filter activ
    if (checkboxNamesIndizes.length == 0) { return true; }

    for (checkBoxIndx of checkboxNamesIndizes) {
        // Marketing
        if (checkBoxIndx == 4) {
            if (task['category'].toLowerCase() == 'marketing') {
                return true;
            }
        }
        // IT
        if (checkBoxIndx == 5) {
            if (task['category'].toLowerCase() == 'it') {
                return true;
            }
        }
        // Organisation
        if (checkBoxIndx == 6) {
            if (task['category'].toLowerCase() == 'organisation') {
                return true;
            }
        }
    }
    return false;
}

/**
 * no checked criteria:
 * if length == 0 -> return true
 * 
 * any checked criteria is successful:
 * if one criteria of list is ok -> return true
 * 
 * @param {JSON} task 
 * @param {int[]} checkboxNamesIndizes 
 * @returns 
 */
function checkUrgency(task, checkboxNamesIndizes) {
    // no filter, show all
    if (checkboxNamesIndizes.length == 0) { return true; }

    for (checkBoxIndx of checkboxNamesIndizes) {
        // Marketing
        if (checkBoxIndx == 7) {
            if (task['urgency'].toLowerCase() == 'high') {
                return true;
            }
        }
        // IT
        if (checkBoxIndx == 8) {
            if (task['urgency'].toLowerCase() == 'medium') {
                return true;
            }
        }
        // Organisation
        if (checkBoxIndx == 9) {
            if (task['urgency'].toLowerCase() == 'low') {
                return true;
            }
        }
    }
    return false;
}

/**
 * hide all tasks which are not in filter criteria
 * 
 * @param {JSON} task 
 * @returns 
 */
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
    if (checkTimes(task, timesCheckList) && checkCategory(task, categoryCheckList) && checkUrgency(task, urgencyCheckList)) {
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

/**
 * close filter dropdown if its open
 */
function closeFilterDropdown() {
    document.getElementById('dropdownFilter').classList.remove('show');
}

/**
 * create an words array from filter input field
 * 
 * @returns string[]
 */
function getSearchWords() {
    // get inpu
    let entry = document.getElementById('search-field').value;
    // split in words
    let words = entry.split(' ');
    // del empty elements of array, and make all to lower case
    for (let i = words.length - 1; i >= 0; i--) {
        // to lower case
        words[i] = words[i].toLowerCase();
        // del empty values
        if (words[i] == "") {
            words.splice(i, 1);
        }
    }
    return words;
}

function wordInTask(word, task){
    let strTask = JSON.stringify(task).toLowerCase();
    let indx = strTask.search(word);

    console.log("#############################");
    console.log(strTask);
    console.log("#############################");

    // word exist, return true
    if(indx != -1){ return true; }
    // not found, return false
    return false;
}

/**
 * it is call every changing in search input field
 */
function searchWords(task) {
    let searchWords = getSearchWords();
    // nothing to search
    if(searchWords.length == 0){ return true; }

    // loop words
    for(word of searchWords){
        if(!wordInTask(word, task)){
            return false;
        }
    }
    return true;
}