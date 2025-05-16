let minutes = 25;
let seconds = 0;
let timer = null;
let isRunning = false;
let totalWorkSecondsToday = 0;
let totalWorkSecondsAllTime = 0;
let selectedTask = null;
let tasks = {};

// Load saved tasks from localStorage
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

// Load work time (today and all-time) from localStorage
if (localStorage.getItem("workTimeToday")) {
    const storedDate = localStorage.getItem("workTimeDate");
    const today = new Date().toDateString();
    if (storedDate === today) {
        totalWorkSecondsToday = parseInt(localStorage.getItem("workTimeToday"));
    } else {
        localStorage.setItem("workTimeDate", today);
        localStorage.setItem("workTimeToday", "0");
    }
}
if (localStorage.getItem("workTimeTotal")) {
    totalWorkSecondsAllTime = parseInt(localStorage.getItem("workTimeTotal"));
}

// Update the timer display
function updateDisplay() {
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

// Start the Pomodoro timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                playWorkEndAlarm();
                addWorkTime(25 * 60);
                if (selectedTask) addTaskTime(selectedTask, 25 * 60);
                startBreakTimer();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

// Reset the timer to 25:00
function resetTimer() {
    pauseTimer();
    minutes = 25;
    seconds = 0;
    updateDisplay();
}

// Start the break timer (5 minutes)
function startBreakTimer() {
    minutes = 5;
    seconds = 0;
    updateDisplay();
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                playBreakEndAlarm();
                resetTimer();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

// Play alarm sound when work ends
function playWorkEndAlarm() {
    document.getElementById("workEndAlarm").play();
}

// Play alarm sound when break ends
function playBreakEndAlarm() {
    document.getElementById("breakEndAlarm").play();
}

// Update work time display for today and all-time
function updateWorkTimeDisplay() {
    const workMinutesToday = Math.floor(totalWorkSecondsToday / 60);
    const workSecondsToday = totalWorkSecondsToday % 60;
    const workMinutesTotal = Math.floor(totalWorkSecondsAllTime / 60);
    const workSecondsTotal = totalWorkSecondsAllTime % 60;
    document.getElementById("work-time").innerText =
        `Today: ${String(workMinutesToday).padStart(2, '0')}:${String(workSecondsToday).padStart(2, '0')} | 🕓 Total: ${String(workMinutesTotal).padStart(2, '0')}:${String(workSecondsTotal).padStart(2, '0')}`;
}

// Add work time to daily and all-time counters
function addWorkTime(seconds) {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("workTimeDate");
    if (today !== savedDate) {
        totalWorkSecondsToday = 0;
        localStorage.setItem("workTimeDate", today);
    }
    totalWorkSecondsToday += seconds;
    totalWorkSecondsAllTime += seconds;
    localStorage.setItem("workTimeToday", totalWorkSecondsToday);
    localStorage.setItem("workTimeTotal", totalWorkSecondsAllTime);
    updateWorkTimeDisplay();
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskName = taskInput.value.trim();
    if (taskName && !tasks[taskName]) {
        tasks[taskName] = 0;
        saveTasks();
        renderTaskList();
        renderTaskStats();
        taskInput.value = '';
    }
}

// Render the task dropdown list
function renderTaskList() {
    const select = document.getElementById("taskList");
    select.innerHTML = '<option disabled selected>Select a task</option>';
    for (let task in tasks) {
        const option = document.createElement("option");
        option.value = task;
        option.textContent = task;
        select.appendChild(option);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render time spent per task
function renderTaskStats() {
    const statDiv = document.getElementById("taskStats");
    statDiv.innerHTML = '<h3>📝 Time Spent Per Task</h3>';
    for (let task in tasks) {
        let mins = Math.floor(tasks[task] / 60);
        let secs = tasks[task] % 60;
        statDiv.innerHTML += `<p><strong>${task}</strong>: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</p>`;
    }
}

// Add time to a specific task
function addTaskTime(task, seconds) {
    tasks[task] = (tasks[task] || 0) + seconds;
    saveTasks();
    renderTaskStats();
}

// Handle task selection
document.getElementById("taskList").addEventListener("change", function () {
    selectedTask = this.value;
});

// Initial rendering on page load
updateDisplay();
updateWorkTimeDisplay();
renderTaskList();
renderTaskStats();