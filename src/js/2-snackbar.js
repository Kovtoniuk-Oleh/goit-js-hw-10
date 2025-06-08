// Якщо ти використовуєш модулі, не забудь імпорти:
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".snackbar-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const delayInput = form.elements.delay;
  const stateInput = form.elements.state;

  const delay = Number(delayInput.value);
  const state = form.elements.state.value; // fulfilled або rejected

  if (!delay || delay < 0) {
    iziToast.error({ title: "Error", message: "Please enter a valid delay (≥ 0)" });
    return;
  }
  if (!state) {
    iziToast.error({ title: "Error", message: "Please select a state" });
    return;
  }

  // Створюємо проміс
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Обробка результату промісу
  promise
    .then((delay) => {
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });
});
