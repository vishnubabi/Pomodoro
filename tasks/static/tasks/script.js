let minutes = 25;
let seconds = 0;
let timer;  // Stores the setInterval reference for clearing the timer
let isRunning = false;  // Tracks whether the timer is running or paused
let totalWorkSeconds = 0;
let totalWorkSecondsToday = 0; // variables to track daily and total time
let totalWorkSecondsAllTime = 0; //variables to track daily and total time



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




if (localStorage.getItem("workTime")){
    totalWorkSeconds = parseInt(localStorage.getItem("workTime"));
    updateWorkTimeDisplay();
}

// Updates the displayed minutes and seconds on the page
function updateDisplay() {
    // Format minutes and seconds as two digits and update the display
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

// Starts the timer if it is not already running
function startTimer() {
    if (isRunning) return;  // Prevent starting the timer if it's already running
    isRunning = true;

    // Set an interval to update the timer every second
    timer = setInterval(() => {
        // If seconds reach 0, we need to handle the minutes decrement
        if (seconds === 0) {
            // If minutes are also 0, stop the timer and alert the user
            if (minutes === 0) {
                clearInterval(timer);  // Stop the timer
                playWorkEndAlarm();
                addWorkTime(25 * 60);
                startBreakTimer();
                return;
            }
            // Decrement the minutes and reset seconds to 59
            minutes--;
            seconds = 59;
        } else {
            // Decrease the seconds by 1
            seconds--;
        }
        updateDisplay();  // Update the display after each second
    }, 1000);  // 1000ms = 1 second
}

// Pauses the timer
function pauseTimer() {
    clearInterval(timer);  // Stop the interval
    isRunning = false;  // Set isRunning to false so the timer can be resumed
}

// Resets the timer back to 25 minutes and 0 seconds
function resetTimer() {
    pauseTimer();  // First, pause the timer
    minutes = 25;  
    seconds = 0;   
    updateDisplay();  // Update the display to reflect the reset time
}




function startBreakTimer(){
    minutes = 5;
    seconds = 0;
    updateDisplay();


    timer = setInterval(()=>{
        if (seconds=== 0){
            if (minutes=== 0){
                clearInterval(timer);
                playBreakEndAlarm();
                resetTimer();
                return;
            }
            minutes--;
            seconds = 59;
        }else{
            seconds--;

        }updateDisplay();
    },1000);
}
function playWorkEndAlarm() {
    document.getElementById("workEndAlarm").play();
}

function playBreakEndAlarm() {
    document.getElementById("breakEndAlarm").play();
}

function updateWorkTimeDisplay(){
    const workMinutes = Math.floor(totalWorkSeconds / 60);
    const workSeconds = totalWorkSeconds % 60;
    document.getElementById("work-time").innerText =
    `Total Work Time Today: ${String(workMinutes).padStart(2, '0')}:${String(workSeconds).padStart(2, '0')}`;

}

function addWorkTime(seconds) {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("workTimeDate");

    // Reset today’s timer if new day
    if (today !== savedDate) {
        totalWorkSecondsToday = 0;
        localStorage.setItem("workTimeDate", today);
    }

    // Add to daily and all-time counters
    totalWorkSecondsToday += seconds;
    totalWorkSecondsAllTime += seconds;

    // Save to localStorage
    localStorage.setItem("workTimeToday", totalWorkSecondsToday);
    localStorage.setItem("workTimeTotal", totalWorkSecondsAllTime);

    updateWorkTimeDisplay(); // Update the on-screen display
}


updateDisplay();