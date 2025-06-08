import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const resetButton = document.querySelector("[data-reset]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");
let userSelectedDate;
let timerInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({ message: "Please choose a date in the future" });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
      localStorage.setItem("selectedDate", userSelectedDate);
    }
  },
};

flatpickr(datetimePicker, options);
startButton.disabled = true;
resetButton.disabled = true;

if (localStorage.getItem("selectedDate")) {
  userSelectedDate = new Date(localStorage.getItem("selectedDate"));
  startButton.disabled = false;
}

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  resetButton.disabled = false;
  datetimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      datetimePicker.disabled = false;
      resetButton.disabled = false;
      
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";

      daysEl.classList.add("expired");
      hoursEl.classList.add("expired");
      minutesEl.classList.add("expired");
      secondsEl.classList.add("expired");
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  }, 1000);
});

resetButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  localStorage.removeItem("selectedDate");
  datetimePicker.disabled = false;
  startButton.disabled = true;
  resetButton.disabled = true;

  daysEl.textContent = "00";
  hoursEl.textContent = "00";
  minutesEl.textContent = "00";
  secondsEl.textContent = "00";

  daysEl.classList.remove("expired");
  hoursEl.classList.remove("expired");
  minutesEl.classList.remove("expired");
  secondsEl.classList.remove("expired");
});

// Підставлена функція convertMs з коментарями
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Тестування функції convertMs


console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}







