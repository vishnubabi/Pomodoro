let minutes = 25;
let seconds = 0;
let timer;  // Stores the setInterval reference for clearing the timer
let isRunning = false;  // Tracks whether the timer is running or paused

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
                alert("Time's up!");  // Notify the user that the time is up
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

updateDisplay();
