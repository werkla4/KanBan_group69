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
 * function to open Details of Tasks
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
    <div class="details-layer-background">
        <div class="details-layer">
        <span onclick="closeTaskDetail()">Schließen</span>
        <div>Titel ${title}
        </div>
        <div>Name ${blName}
        </div>
        <div>Kategorie ${category}
        </div>
        <div>Description ${description}
        </div>
        <div>Date ${date}
        </div>
        <div>Prio ${prio}
        </div>
        </div>
    </div>
    `;
}

/**
 * function to close Detail layer
 */
function closeTaskDetail() {
    let detailLayer = document.getElementById('taskDetails');
    detailLayer.innerHTML = '';
}