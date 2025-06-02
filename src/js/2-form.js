const formData = {
  email: "",
  message: "",
};

const form = document.querySelector(".feedback-form");
const localStorageKey = "feedback-form-state";

document.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem(localStorageKey);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);

      if (
        typeof parsedData.email === "string" &&
        typeof parsedData.message === "string"
      ) {
        formData.email = parsedData.email.trim();
        formData.message = parsedData.message.trim();

        form.elements.email.value = formData.email;
        form.elements.message.value = formData.message;
      } else {
        throw new Error("Невірний формат даних");
      }
    } catch (error) {
      console.error("Помилка при парсингу даних з localStorage:", error);

      localStorage.removeItem(localStorageKey);

      form.reset();
      formData.email = "";
      formData.message = "";
    }
  }
});

form.addEventListener("input", (event) => {
  if (event.target.name in formData) {
    formData[event.target.name] = event.target.value.trim();

    localStorage.setItem(localStorageKey, JSON.stringify(formData));
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formData.email || !formData.message) {
    alert("Fill please all fields");
    return;
  }

  // Перевірка формату email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    alert("Please enter a valid email address");
    return;
  }

  console.log("Відправлені дані форми:", formData);

  localStorage.removeItem(localStorageKey);

  formData.email = "";
  formData.message = "";
  form.reset();
});