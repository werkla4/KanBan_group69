/**
 * JSON of created Tasks
 */
// NEEDS TO BE FILLED from AddTask
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

/**
 * function to show all tasks of JSON
 */

function showBacklogTask() {
    document.getElementById('taskContainer').innerHTML = '';
    let taskContainer = document.getElementById('taskContainer');

    if (backlogTasks == '') {
        taskContainer.innerHTML = `
            <div class="no-tasks">Es wurden bisher keine Tasks angelegt.
            </div>
        `;
    } else {
        for (let i = 0; i < backlogTasks.length; i++) {
            let task = backlogTasks[i];
            taskContainer.innerHTML += `
        <div onclick="openTaskDetail(${i})" class="bl-task">
            <div id="color${i}" class="color-category"></div>
            <div class="bl-name">${task['name']}</div>
            <div id="category${i}" class="bl-category">${task['category']}</div>
            <div class="bl-description">${task['description']}</div>
        </div>
        `;
        }
        showCategory();
    }
}
/**
 * function to define the color of the different categories
 */
function showCategory() {
    for (let i = 0; i < backlogTasks.length; i++) {
        //let category = document.getElementById(`category${i}`).innerHTML;
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
    let date = backlogTasks[i]['date'];
    let prio = backlogTasks[i]['urgency'];

    detailLayer.innerHTML = `
    <div onclick="closeTaskDetail()" class="details-layer-background">
        <div class="details-layer">
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
        <div class="horizontal-line"></div>
        <div class="details"><b>Beschreibung:</b> <br>${description}
        </div>
        
       
       <div class="btn-container">
        <button class="btn-move" onclick="moveToBoard(${i})">Task starten</button>
        </div>
    </div>
    `;
}

/**
 * JSON for moved Task from Backlog to Board
 */
// BOARD GETS ITS TASK FROM HERE
let boardTask = [];

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
function moveToBoard(i){
    let moveTask = backlogTasks[i];
    backlogTasks.splice(i, 1);
    boardTask.push(moveTask);
    showBacklogTask();
}
