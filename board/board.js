const COLUMN_NAMES = ['toDo', 'inProgress', 'testing', 'done'];
const CATEGORY_COLORS = ['var(--marketing_color)', 'var(--it_color)', 'var(--accounting_color)', 'var(--organisation_color)'];
const CATEGORY_NAMES = ['Marketing', 'IT', 'Accounting', 'Organisation'];
const URGENCY_COLORS = ['var(--urgency_high_color)', 'var(--urgency_medium_color)', 'var(--urgency_low_color)'];
const URGENCY_NAMES = ['High', 'Medium', 'Low'];


let current_drag_elm;
let tasks;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(elm_id) {
    current_drag_elm = elm_id;
}

function drop(id) {
}

function board_init() {
    loadTasks();

    updateBoard();
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
    }
}


function getBlancTask(colName, taskId) {
    let htmlCode = `
                            <div id="commands-container-0-0" class="commands-container d-none">
                                <div id="commands-0-0" class="command-attributes">
                                    <span id="command-0-0" class="command">
                                        <b>Klaus Werner: </b>
                                        das hier ist ein kommentar
                                    </span>
                                    <img src="../img/recycle-bin.png" class="task-recycle-icon">
                                </div>
                                
                                <div class="add-command-container">
                                    <textarea placeholder="write a command..."></textarea>
                                    <img src="../img/check-mark.png" class="command-check-icon">
                                </div>
                                <span class="hide-commands-txt" onclick="showCommands(0, 0, 'hide')"> | close commands |</span>
                            </div>                                

                            <div id="assignedTo-pics-0-0" class="user-pics-container">
                                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            </div>
    `;
}

function createHTML_addComments(colName, taskId, tasks){
    // no comment, make nothing
    if(tasks[taskId]['comments'].length == 0){ return; }

    document.getElementById(`${colName}task-${taskId}`).innerHTML += 
        
        `<div id="${colName}task-${taskId}-commands-container" class="commands-container"></div>`; // d-none !!

    for(let i = 0; i < tasks[taskId]['comments'].length; i++){
        document.getElementById(`${colName}task-${taskId}-commands-container`).innerHTML += `

        <div id="${colName}task-${taskId}-command-${i}" class="command-attributes">
            <span class="command">
            ${tasks[taskId]['comments'][i]}
            </span>
            <img src="../img/recycle-bin.png" class="task-recycle-icon">
        </div>
        
        `;
    }
    // write new comments and hide comments
    document.getElementById(`${colName}task-${taskId}-commands-container`).innerHTML += `
        <div class="add-command-container">
            <textarea id="${colName}task-${taskId}-textarea" placeholder="write a command..."></textarea>
            <img src="../img/check-mark.png" class="command-check-icon" onclick="addCommand(${colName}, ${taskId})">
        </div>  
        <span class="hide-commands-txt" onclick="showCommands(${colName}, ${taskId}, 'hide')"> | close commands |</span>
    `;


        //     <div id="${colName}task-${taskId}-command-${i}" class="command-attributes">
        //         <span id="command-0-0" class="command">
        //             <b>Klaus Werner: </b>
        //             das hier ist ein kommentar
        //         </span>
        //         <img src="../img/recycle-bin.png" class="task-recycle-icon">
        //     </div>

    
    
}

/**
 * set expiration date and n-commants
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 */
function createHTML_dateTimeAndCommentsLogo(colName, taskId, tasks){
    document.getElementById(`${colName}task-${taskId}`).innerHTML += `

    <div class="task-expiration-date-row">  
        <div class="n-commands-container" onclick="showCommands(${colName}, ${taskId}, 'show')">
            <span id="${colName}task-${taskId}-n-commands">2</span>
            <img src="../img/feedback.png" class="task-feedback-icon">
        </div>                             
        <span id="${colName}task-${taskId}-date">16.05.1987</span>
        <img src="../img/icons8-calendar-150.png" class="task-calender-icon">
    </div>

    `;
    // set n-comments
    document.getElementById(`${colName}task-${taskId}-n-commands`).innerHTML = tasks[taskId]['comments'].length;
    // set end data
    let dateTime = new Date(tasks[taskId]['endTask']);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; // month: 'long' -> 'april'
    document.getElementById(`${colName}task-${taskId}-date`).innerHTML = `${dateTime.toLocaleDateString('de-DE', options)}`;
}


/**
 * set title and text an task
 * 
 * @param {string} colName 
 * @param {int} taskId 
 * @param {JSON} tasks 
 */
 function createHTML_setTitleAndDescription(colName, taskId, tasks){
    document.getElementById(`${colName}task-${taskId}`).innerHTML += `

        <h2 id="${colName}task-${taskId}-title">${tasks[taskId]['title']}</h2>
        <p id="${colName}task-${taskId}-discreption">${tasks[taskId]['description']}</p>

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
    document.getElementById(`${colName}task-${taskId}`).innerHTML = `
    <div class="row-category-urgency">
        <div id="${colName}task-${taskId}-category" class="task-category"></div>
        <div id="${colName}task-${taskId}-urgency" class="task-urgency"></div>
    </div>
    `;
    // get indx of colors
    console.log(tasks[taskId]['category']);
    let categoryColorIndx = CATEGORY_NAMES.indexOf(tasks[taskId]['category']);
    let urgencyColorIndx = URGENCY_NAMES.indexOf(tasks[taskId]['urgency']);
    // set colors
    document.getElementById(`${colName}task-${taskId}-category`).style.backgroundColor = CATEGORY_COLORS[categoryColorIndx];
    document.getElementById(`${colName}task-${taskId}-urgency`).style.backgroundColor = URGENCY_COLORS[urgencyColorIndx];
}

/**
 * @param {string} colName 
 * @param {int} taskId 
 */
 function createHTML_TaskGrid(colName, taskId) {
    // clear column
    document.getElementById(`${colName}-tasks`).innerHTML += `
        <div id="${colName}task-${taskId}" class="task" draggable="true" ondragstart="drag('${colName}task-${taskId}')"></div>
        `;
}   

function goToAddTask(columnName) {
    console.log(getTicket());
    return;

    // localStorage.setItem('newTaskFromBoard', columnName);
    // location.href = "../addTask/addTask.html";
}

function getBlancTask(ticket) {
    let htmlCode = `
        <div id="task1" class="task" draggable="true" ondragstart="drag('task1')">
            <div class="row-category-urgency">
                <div class="task-category"></div>
                <div class="task-urgency"></div>
            </div>
            <h2>TEST2</h2>
            <p>Noch ein Text zum testen</p>
            <div class="task-expiration-date-row">
                <span class="task-expiration-date">16.05.1987</span>
                <img src="../img/icons8-calendar-150.png" class="task-calender-icon">
            </div>
            <div class="user-pics-container">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
                <img src="../img/KlausWerner.jpg" class="task-user-pic">
            </div>
        </div>
    `;
    return htmlCode;
}
/**
 * <div id="task0" class="task" draggable="true" ondragstart="drag('task0')">
                        <div class="row-category-urgency">
                            <div class="task-category"></div>
                            <div class="task-urgency"></div>
                        </div>
                        <h2>TEST</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio fugiat libero commodi
                            expedita, sint autem dolorem asperiores quidem laborum quos atque!</p>
                        <div class="task-expiration-date-row">
                            <span class="task-expiration-date">16.05.1987</span>
                            <img src="../img/icons8-calendar-150.png" class="task-calender-icon">
                        </div>
                        <div class="user-pics-container">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                            <img src="../img/KlausWerner.jpg" class="task-user-pic">
                        </div>
                    </div>
 */


/**
 * if exist task, load from server, if not, load test data 
 */
function loadTasks() {
    // load from server
    tasks = backend.getItem('tasks');
    // nothing exist?
    if (tasks == null) {
        // set test tasks
        tasks = getTestTasks();
        console.log('loadTasks: tasks == null -> getTestTasks()');
        console.log(tasks);
    }
    // parse JSON file
    else {
        tasks = JSON.parse(tasks);
        console.log('load json from server');
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

/**
 * show or hide the commands
 * 
 * @param {int} task_id 
 * @param {int} command_id 
 * @param {string} showState "show" || "hide"
 */
function showCommands(task_id, command_id, showState) {
    if (showState == "show") {
        document.getElementById(`commands-container-${task_id}-${command_id}`).classList.remove('d-none');
    }
    if (showState == "hide") {
        document.getElementById(`commands-container-${task_id}-${command_id}`).classList.add('d-none');
    }

}