/**
 * JSON of created Tasks
 */
// JSON will BE FILLED from AddTask - just for testing
let backlogTasks = [
    {
        'title': 'It Infrastruktur erstellen',
        'name': 'Felicitas Mock',
        'category': 'IT',
        'description': 'Infrastruktur erstellen. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'createdDate': '11.04.2021',
        'urgency': 'high'
    },
    {
        'title': 'Werbekampagne aufsetzen',
        'name': 'Thomas Müller',
        'category': 'Marketing',
        'description': 'Werbekampagne aufsetzen. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'createdDate': '18.03.2021',
        'urgency': 'medium'
    },
    {
        'title': 'Layout erstellen',
        'name': 'Hans Peter',
        'category': 'Design',
        'description': 'Layout erstellen. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'createdDate': '13.04.2021',
        'urgency': 'low'
    },
    {
        'title': 'Werbekampagne Kickof Vorbereiten',
        'name': 'Claudia Vogt',
        'category': 'Marketing',
        'description': 'Kickof Vorbereiten. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur harumanimi qui deseruntpossimus. Ea, ullam vitae. Sed commodi aliquam incidunt expedita, pariatur, iusto accusamus odit,autem quia ipsa numquam.',
        'createdDate': '10.04.2021',
        'urgency': 'low'
    }
];
/**
 * function to load main init and get JSON from Server and show tasks
 */
async function initBacklog() {
    await main_init();
    //to get JSON from Server
    backlogTasks = JSON.parse(backend.getItem('tasks'));
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
        let task = backlogTasks[i];
        document.getElementById('taskContainer').innerHTML += `
        <div onclick="openTaskDetail(${i})" class="bl-task">
            <div id="color${i}" class="color-category"></div>
            <div class="bl-name">${task['name']}</div>
            <div id="category${i}" class="bl-category">${task['category']}</div>
            <div class="bl-description">${task['description']}</div>
        </div>
        `;
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
 * 
 * @param {string} i - function to open Details of Tasks
 */
function openTaskDetail(i) {
    let detailLayer = document.getElementById('taskDetails');

    let title = backlogTasks[i]['title'];
    let blName = backlogTasks[i]['name'];
    let category = backlogTasks[i]['category'];
    let description = backlogTasks[i]['description'];
    let date = backlogTasks[i]['createdDate'];
    let prio = backlogTasks[i]['urgency'];

    let startdate = backlogTasks[i]['startdate'];

    detailLayer.innerHTML = generateOpenTaskHTML(title, blName, prio, date, category, description, i);

}

/**
 * function to generate HTML of Detail Layer
 * 
 * @param {string} title  - parameter to show titel of Task
 * @param {string} blName - parameter to show Name of Task
 * @param {string} prio - parameter to show prio
 * @param {string} date - paramter tp show date
 * @param {string} category - parameter to show category
 * @param {string} description - parameter to show description
 * @param {string} i - defines i
 * @returns 
 */
function generateOpenTaskHTML(title, blName, prio, date, category, description, i) {
    return `
    <div class="details-layer-background">
        <div id="layer" class="details-layer">
            <span class="close-detail-layer" onclick="closeTaskDetail()">Schließen</span>
            <div class="details"><b>Titel:</b> ${title}
            </div>
            <div class="details"><b>Name:</b> ${blName}
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
                <button class="btn-move" onclick="moveToBoard(${i}), pushDates(${i}), closeTaskDetail()">Task starten</button>
            </div>
            <button onclick="deleteBacklogTask(${i}), showDeleteNotification(${i})">Löschen</button>
        </div>
    </div>
    `;
}

/**
 * JSON for moved Task from Backlog to Board
 */
// BOARD GETS ITS TASK FROM HERE
let boardTasks = [];

/**
 * function to close Detail layer
 */
function closeTaskDetail() {
    document.getElementById('taskDetails').innerHTML = '';
}

/**
 * 
 * @param {string} i - function to move Task from Backlog onto Board 
 */
function moveToBoard(i) {
    let moveTask = backlogTasks[i];
    backlogTasks.splice(i, 1);
    boardTasks.push(moveTask);
    showBacklogTask();
    console.log('seleced Task', moveTask)
}


function pushDates(i) {
    boardTasks[i].enddate = document.getElementById(`date${i}`).value;
    boardTasks[i].startdate =  new Date().getTime();

  console.log('pushed Dates', boardTasks[i].enddate , boardTasks[i].startdate);
}

/**
 * 
 * @param {string} position - function to delete task of backlog (forever)
 */
function deleteBacklogTask(position) {
    backlogTasks.splice(position, 1);
    showBacklogTask();
}

/**
 * function to show delete notification of deleted task
 */
function showDeleteNotification(i) {
    let title = backlogTasks[i]['title'];
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


