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

    // removeAllTestTasks();

    // addNewTask(0);
    // addNewTask(1);

    console.log(getTicket());
}

function removeAllTestTasks(){
    document.getElementById('toDo-tasks').innerHTML = ``;
    document.getElementById('inProgress-tasks').innerHTML = ``;
    document.getElementById('testing-tasks').innerHTML = ``;
    document.getElementById('done-tasks').innerHTML = ``;
}

function addNewTask(num){
    let codeBefore = document.getElementById('toDo-tasks').innerHTML;
    let codeBehind = getBlancTask(num) + codeBefore;
    document.getElementById('toDo-tasks').innerHTML = codeBehind;
}

function goToAddTask(columnName){
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

function loadTasks() {
    tasks = backend.getItem('tasks');
    if (tasks == null) {
        tasks = getTestTasks();
    }
}

/**
 * create 3 pseudo tasks
 * @returns returns pseudo test tasks for testing prozess
 */
function getTestTasks() {
    tasks = [
        {
            'title': 'Erstelle Init',
            'category': 'main',
            'description': 'diese init wird benötigt um die ersten tests machen zu können',
            'date': new Date().getTime(),
            'urgency': 'wichtig',
            'ticket': 0,
            'state': 'toDo',
            'users': 'Klaus',
            'comments': ['command0', 'command1'],
            'comments_id': [123, 235]
        },

        {
            'title': 'erste tests',
            'category': 'board',
            'description': 'board boarder am boardesten',
            'date': new Date().getTime(),
            'urgency': 'mittel',
            'ticket': 1,
            'state': 'toDo',
            'users': 'Klaus',
            'comments': []
        },

        {
            'title': 'board spalten',
            'category': 'board',
            'description': 'ohne spalte kein platz zum dzurchklettern',
            'date': new Date().getTime(),
            'urgency': 'nicht dringend',
            'ticket': 2,
            'state': 'toDo',
            'users': 'Klaus',
            'comments': []
        }
    ];
    backend.setItem('tasks', tasks);
    return tasks;
}