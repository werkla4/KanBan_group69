/**
 * JSON of created Tasks
 */
// JSON will BE FILLED from AddTask - just for testing
/*
let backlogTasks = [
    {
        'title': 'It Infrastruktur erstellen',
        'name': 'Felicitas Mock',
        'category': 'IT',
        'description': 'Infrastruktur erstellen. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'date': '11.04.2021',
        'urgency': 'high'
    },
    {
        'title': 'Werbekampagne aufsetzen',
        'name': 'Thomas Müller',
        'category': 'Marketing',
        'description': 'Werbekampagne aufsetzen. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'date': '18.03.2021',
        'urgency': 'medium'
    },
    {
        'title': 'Layout erstellen',
        'name': 'Hans Peter',
        'category': 'Design',
        'description': 'Layout erstellen. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'date': '13.04.2021',
        'urgency': 'low'
    },
    {
        'title': 'Werbekampagne Kickof Vorbereiten',
        'name': 'Claudia Vogt',
        'category': 'Marketing',
        'description': 'Kickof Vorbereiten. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'date': '10.04.2021',
        'urgency': 'low'
    }
];

*/

let boardTasks = [];

/**
 * function to load main init and get JSON from Server and show tasks
 */
async function initBacklog() {
    await main_init();
    //to get JSON from Server
    backlogTasks = JSON.parse(backend.getItem('tasks'));
    boardTasks = JSON.parse(backend.getItem('boardTasks')); // BOARD GETS ITS TASK FROM HERE
    showBacklogTask();
}

/**
 * function to show all tasks of JSON
 */
function showBacklogTask() {
    let taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';

    if (backlogTasks.length == 0) {
        generateNoTaskHTML();
    } else {
        generateShowTaskHTML();

    }
    showCategory();
}
/**
 * function to generate HTML if there is no task
 */
function generateNoTaskHTML() {
    document.getElementById('taskContainer').innerHTML = `<div class="no-tasks">Es wurden bisher keine Tasks angelegt.</div>`;
}

/**
 * function to generate HTML to show task
 */
function generateShowTaskHTML() {
    for (let i = 0; i < backlogTasks.length; i++) {
        for (let j = 0; j < backlogTasks[i].assignedTo.length; j++) {
            let task = backlogTasks[i];
            let names = task['assignedTo'][j].name;
            console.log(names);
            document.getElementById('taskContainer').innerHTML += `
        <div onclick="openTaskDetail(${i})" class="bl-task">
            <div id="color${i}" class="color-category"></div>
            <div class="bl-name">${names}</div>
            <div id="category${i}" class="bl-category">${task['category']}</div>
            <div class="bl-description">${task['description']}</div>
        </div>
        `;
        }
    }
}


///category colors needs to be adjusted from main.css!!!!!!!!!

/**
 * function to define the color of the different categories
 */
function showCategory() {
    for (let i = 0; i < backlogTasks.length; i++) {
        let category = backlogTasks[i]['category'];
        let color = document.getElementById(`color${i}`);

        if (category == 'Marketing') {
            color.classList.add('color-1')
        }
        if (category == 'Design') {
            color.classList.add('color-2')
        }
        if (category == 'IT') {
            color.classList.add('color-3')
        }
    }
}

/**
 * function to open details of the Task
 * 
 * @param {number} i - This is the position of the selected task
 */
function openTaskDetail(i) {
    let detailLayer = document.getElementById('taskDetails');

    let title = backlogTasks[i]['title'];
    // let name = backlogTasks[i]['assignedTo']['name'];
    let category = backlogTasks[i]['category'];
    let description = backlogTasks[i]['description'];
    let date = new Date(backlogTasks[i]['date']);
    let prio = backlogTasks[i]['urgency'];

    detailLayer.innerHTML = generateOpenTaskHTML(title, name, prio, date, category, description, i);
}

/**
 * function to generate HTML of Detail Layer
 * 
 * @param {string} title  - This is the title of the task
 * @param {string} name - These are the user names of the task
 * @param {string} prio - This shows the priorities of the task
 * @param {date} date - This is the created date of the task
 * @param {string} category - This is the category the task belongs to
 * @param {string} description - This is the description of the task
 * @param {number} i - This is the position of the selected task
 * @returns 
 */
function generateOpenTaskHTML(title, name, prio, date, category, description, i) {
    return `
    <div class="details-layer-background">
        <div id="layer" class="details-layer">
            <span class="close-detail-layer" onclick="closeTaskDetail()">Schließen</span>
            <div class="details"><b>Titel:</b> ${title}
            </div>
            <div class="details"><b>Name:</b> ${name}
            </div>
            <div class="details"><b>Prio:</b> ${prio}
            </div>
            <div class="details"><b>Datum:</b> ${date}
            </div>
            <div class="details"><b>Kategorie:</b> ${category}
            </div>
            <label for="enddate">Fällig am:</label>
            <input type="date" id="date${i}" name="end-date"
                value="2021-04-01"
                min="2021-01-01" max="2025-12-31">
</input>

            <div class="horizontal-line"></div>
            <div class="details"><b>Beschreibung:</b> <br>${description}
            </div>       
            <div class="btn-container">
                <button class="btn-move" onclick="moveToBoard(${i}), closeTaskDetail()">Task starten</button>
            </div>
            <button onclick="deleteBacklogTask(${i})">Löschen</button>
        </div>
    </div>
    `;
}


/**
 * function to close Detail layer
 */
function closeTaskDetail() {
    document.getElementById('taskDetails').innerHTML = '';
}

/**
 * function to move task from backlog to board
 * 
 * @param {number} position - This is the position of the selected task what will be push to board
 */
function moveToBoard(position) {
    //moves task to board task JSON
    let moveTask = backlogTasks[position];
    backlogTasks.splice(position, 1);
    boardTasks.push(moveTask);
    
    pushDates(position);
    changeState(position);

    // saves boardtask on server
    setArray('boardTasks', boardTasks);
     // deletes tasks out of task JSON on server
    setArray('tasks', backlogTasks);

    console.log('seleced Task', moveTask)
    showBacklogTask();
}


/**
 * function to add start and enddate to JSON for board
 * 
 * @param {number} i - This is the position of the selected task where the dated get pushed in
 */
function pushDates(i) {
    for (let a = 0; a < boardTasks.length; a++) {
        boardTasks[a].enddate = document.getElementById(`date${i}`).value;
        boardTasks[a].startdate = new Date().getTime();
    }
}

/**
 * function to change the state from backlog to board
 */
function changeState() {
    for (let i = 0; i < boardTasks.length; i++) {
        boardTasks[i]['state'] = 'board';
    }
}

/**
 * function to delete task of backlog (forever)
 * 
 * @param {number} position - This is the position of the deleted task
 */
function deleteBacklogTask(position) {
    let deletedTask = backlogTasks.splice(position, 1);
    setArray('tasks', backlogTasks);
    showDeleteNotification(deletedTask[0]['title']);
    showBacklogTask();

    console.log('deleted task', deletedTask[0]['title']);
}

/**
 * function to show delete notification with title of deleted task
 * 
 * @param {string} deletedTask - This is for the title of the deleted Task
 */
function showDeleteNotification(deletedTask) {
    let title = deletedTask;
    console.log('Task gelöscht:', title);
    document.getElementById('layer').classList.add('hide');

    document.getElementById('notificationContainer').innerHTML = `
    <div id="notification" class="delete-note">
    Der Task <span class="text-highlight">"${title}"</span> wurde erfolgreich gelöscht!
    </div>`;
    setTimeout(function () {
        closeTaskDetail();
        document.getElementById('notificationContainer').innerHTML = '';
    }, 1000);

}


function setArray(key, array) {
    backend.setItem(key, JSON.stringify(array));
}


function getArray(key) {
    return JSON.parse(backend.getItem(key)) || [];
    // gibt mir das was im local storage steht, ODER (||) gibt mir nichts ([])
}
