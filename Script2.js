/* =========================================================
   TASKLY — SIMPLE JAVASCRIPT
   ========================================================= */


/* -------------------- ELEMENTS -------------------- */

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const progressText = document.getElementById("progressText");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

const languageSelect = document.getElementById("languageSelect");

const todayDate = document.getElementById("todayDate");


/* -------------------- LOAD TASKS -------------------- */

let tasks = JSON.parse(localStorage.getItem("tasklyTasks")) || [];


/* -------------------- TODAY -------------------- */

function showToday() {

    const today = new Date();

    todayDate.textContent = today.toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

showToday();


/* -------------------- SAVE -------------------- */

function saveTasks() {

    localStorage.setItem(
        "tasklyTasks",
        JSON.stringify(tasks)
    );
}


/* -------------------- DISPLAY TASKS -------------------- */

function displayTasks() {

    taskList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase().trim();

    const filter =
        filterSelect.value;


    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;

    });


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        let priorityText =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);


        let dateText = "";

        if (task.date) {

            dateText =
                new Date(
                    task.date + "T00:00:00"
                ).toLocaleDateString(
                    "en-US",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        li.innerHTML = `

            <button
                class="complete-btn"
                onclick="toggleTask(${task.id})"
                title="Complete task"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="task-content">

                <span class="task-name">
                    ${escapeHTML(task.text)}
                </span>


                <div class="task-meta">

                    ${
                        dateText
                        ? `<span class="task-date">◷ ${dateText}</span>`
                        : ""
                    }

                    <span class="priority ${task.priority}">
                        ${priorityText}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="task-action delete"
                    onclick="deleteTask(${task.id})"
                    title="Delete task"
                >
                    ×
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    updateStats();

}


/* -------------------- ESCAPE TEXT -------------------- */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* -------------------- ADD TASK -------------------- */

function addTask() {

    const text =
        taskInput.value.trim();

    const date =
        taskDate.value;

    const priority =
        taskPriority.value;


    if (text === "") {

        taskInput.focus();

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        date: date,

        priority: priority,

        completed: false

    };


    tasks.unshift(newTask);

    saveTasks();

    taskInput.value = "";

    taskDate.value = "";

    taskPriority.value = "medium";

    displayTasks();

    taskInput.focus();
}


addBtn.addEventListener(
    "click",
    addTask
);


/* -------------------- ENTER KEY -------------------- */

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* -------------------- COMPLETE -------------------- */

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

        return task;

    });


    saveTasks();

    displayTasks();
}


/* -------------------- DELETE -------------------- */

function deleteTask(id) {

    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();
}


/* -------------------- STATISTICS -------------------- */

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(function(task) {
            return task.completed;
        }).length;

    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;


    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressBar.style.width =
        percentage + "%";

    progressPercent.textContent =
        percentage + "%";


    if (total === 0) {

        progressText.textContent =
            "Start completing your tasks.";

    } else if (percentage === 100) {

        progressText.textContent =
            "All tasks completed.";

    } else {

        progressText.textContent =
            completed +
            " of " +
            total +
            " tasks completed.";

    }


    updateTaskCount();

}


/* -------------------- TASK COUNT -------------------- */

function updateTaskCount() {

    const visibleTasks =
        taskList.querySelectorAll(".task-item").length;


    if (visibleTasks === 1) {

        taskCount.textContent =
            "1 task";

    } else {

        taskCount.textContent =
            visibleTasks + " tasks";

    }

}


const taskCount =
    document.getElementById("taskCount");


/* -------------------- SEARCH -------------------- */

searchInput.addEventListener(
    "input",
    displayTasks
);


/* -------------------- FILTER -------------------- */

filterSelect.addEventListener(
    "change",
    displayTasks
);


/* -------------------- THEME -------------------- */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("tasklyTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeIcon.textContent = "☀";

    } else {

        themeIcon.textContent = "☾";

    }

}


themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            localStorage.setItem(
                "tasklyTheme",
                "dark"
            );

            themeIcon.textContent = "☀";

        } else {

            localStorage.setItem(
                "tasklyTheme",
                "light"
            );

            themeIcon.textContent = "☾";

        }

    }
);


/* -------------------- LANGUAGE -------------------- */

const translations = {

    en: {

        welcomeSmall: "PERSONAL PRODUCTIVITY",

        welcomeTitle:
            "Organize your day.<br><span>Get things done.</span>",

        welcomeText:
            "Keep your tasks simple, focused and under control.",

        todayLabel: "TODAY",

        totalLabel: "Total Tasks",

        completedLabel: "Completed",

        pendingLabel: "Pending",

        totalDescription: "All your tasks",

        completedDescription: "Finished tasks",

        pendingDescription: "Tasks remaining",

        progressLabel: "Your Progress",

        createLabel: "CREATE",

        addTitle: "Add a new task",

        taskLabel: "Task name",

        dateLabel: "Due date",

        priorityLabel: "Priority",

        addText: "Add Task",

        workspaceLabel: "WORKSPACE",

        tasksTitle: "My Tasks",

        searchPlaceholder: "Search tasks...",

        all: "All",

        pending: "Pending",

        completed: "Completed",

        emptyTitle: "No tasks yet",

        emptyText:
            "Add your first task and start organizing your day.",

        footerText:
            "Simple. Focused. Productive."

    },


    ta: {

        welcomeSmall: "தனிப்பட்ட திட்டமிடல்",

        welcomeTitle:
            "உங்கள் நாளை ஒழுங்குபடுத்துங்கள்.<br><span>வேலைகளை முடிக்கலாம்.</span>",

        welcomeText:
            "உங்கள் பணிகளை எளிமையாகவும் ஒழுங்காகவும் நிர்வகிக்கவும்.",

        todayLabel: "இன்று",

        totalLabel: "மொத்த பணிகள்",

        completedLabel: "முடிக்கப்பட்டவை",

        pendingLabel: "நிலுவையில்",

        totalDescription: "அனைத்து பணிகளும்",

        completedDescription: "முடிந்த பணிகள்",

        pendingDescription: "மீதமுள்ள பணிகள்",

        progressLabel: "உங்கள் முன்னேற்றம்",

        createLabel: "உருவாக்கு",

        addTitle: "புதிய பணியைச் சேர்க்கவும்",

        taskLabel: "பணி பெயர்",

        dateLabel: "கடைசி தேதி",

        priorityLabel: "முக்கியத்துவம்",

        addText: "பணி சேர்க்கவும்",

        workspaceLabel: "பணிகள்",

        tasksTitle: "என் பணிகள்",

        searchPlaceholder: "பணிகளைத் தேடுங்கள்...",

        all: "அனைத்தும்",

        pending: "நிலுவையில்",

        completed: "முடிக்கப்பட்டவை",

        emptyTitle: "பணிகள் இல்லை",

        emptyText:
            "உங்கள் முதல் பணியைச் சேர்த்து நாளை ஒழுங்குபடுத்துங்கள்.",

        footerText:
            "எளிமை. கவனம். முன்னேற்றம்."

    }

};


languageSelect.addEventListener(
    "change",
    function() {

        const language =
            languageSelect.value;

        const t =
            translations[language];


        document.getElementById(
            "welcomeSmall"
        ).textContent = t.welcomeSmall;


        document.getElementById(
            "welcomeTitle"
        ).innerHTML = t.welcomeTitle;


        document.getElementById(
            "welcomeText"
        ).textContent = t.welcomeText;


        document.getElementById(
            "todayLabel"
        ).textContent = t.todayLabel;


        document.getElementById(
            "totalLabel"
        ).textContent = t.totalLabel;


        document.getElementById(
            "completedLabel"
        ).textContent = t.completedLabel;


        document.getElementById(
            "pendingLabel"
        ).textContent = t.pendingLabel;


        document.getElementById(
            "totalDescription"
        ).textContent = t.totalDescription;


        document.getElementById(
            "completedDescription"
        ).textContent = t.completedDescription;


        document.getElementById(
            "pendingDescription"
        ).textContent = t.pendingDescription;


        document.getElementById(
            "progressLabel"
        ).textContent = t.progressLabel;


        document.getElementById(
            "createLabel"
        ).textContent = t.createLabel;


        document.getElementById(
            "addTitle"
        ).textContent = t.addTitle;


        document.getElementById(
            "taskLabel"
        ).textContent = t.taskLabel;


        document.getElementById(
            "dateLabel"
        ).textContent = t.dateLabel;


        document.getElementById(
            "priorityLabel"
        ).textContent = t.priorityLabel;


        document.getElementById(
            "addText"
        ).textContent = t.addText;


        document.getElementById(
            "workspaceLabel"
        ).textContent = t.workspaceLabel;


        document.getElementById(
            "tasksTitle"
        ).textContent = t.tasksTitle;


        searchInput.placeholder =
            t.searchPlaceholder;


        filterSelect.options[0].textContent =
            t.all;

        filterSelect.options[1].textContent =
            t.pending;

        filterSelect.options[2].textContent =
            t.completed;


        document.getElementById(
            "emptyTitle"
        ).textContent = t.emptyTitle;


        document.getElementById(
            "emptyText"
        ).textContent = t.emptyText;


        document.getElementById(
            "footerText"
        ).textContent = t.footerText;


        displayTasks();

    }
);


/* -------------------- INITIAL LOAD -------------------- */

loadTheme();

displayTasks();