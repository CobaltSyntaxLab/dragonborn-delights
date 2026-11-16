
const toggle = document.querySelector(".mobile-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Uppdaterar årtalet i sidfoten
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Kontaktformulär med egen validering
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const nameInput = contactForm.querySelector('[name="name"]');
  const emailInput = contactForm.querySelector('[name="email"]');
  const messageInput = contactForm.querySelector('[name="message"]');
  const submitButton = contactForm.querySelector('[type="submit"]');
  const formStatus = contactForm.querySelector("#form-status");

  const fields = [nameInput, emailInput, messageInput];

  // Visar eller tar bort ett felmeddelande
  function setFieldError(input, message) {
    const errorElement = document.getElementById(`${input.name}-error`);

    if (!errorElement) return;

    errorElement.textContent = message;

    if (message) {
      input.classList.add("field-invalid");
      input.setAttribute("aria-invalid", "true");
    } else {
      input.classList.remove("field-invalid");
      input.removeAttribute("aria-invalid");
    }
  }

  // Kontrollerar ett enskilt fält
  function validateField(input) {
    const value = input.value.trim();
    let error = "";

    if (input.name === "name") {
      if (!value) {
        error = "Please enter your name.";
      }
    }

    if (input.name === "email") {
      if (!value) {
        error = "Please enter your email address.";
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
          error = "Please enter a valid email address.";
        }
      }
    }

    if (input.name === "message") {
      if (!value) {
        error = "Please enter a message.";
      }
    }

    setFieldError(input, error);

    return error === "";
  }

  // Tar bort felmeddelanden när användaren rättar fälten
  fields.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("field-invalid")) {
        validateField(input);
      }

      formStatus.textContent = "";
      formStatus.className = "form-status";
    });
  });

  // Kontrollerar formuläret innan det skickas
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    let firstInvalidField = null;

    fields.forEach((input) => {
      const isValid = validateField(input);

      if (!isValid && !firstInvalidField) {
        firstInvalidField = input;
      }
    });

    // Stoppar skickningen om något fält är felaktigt
    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    // Förhindrar flera skickningar samtidigt
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        window.location.href = "thank-you.html";
        return;
      }

      formStatus.textContent =
        "Your message could not be sent. Please try again.";

      formStatus.classList.add("form-status-error");
    } catch (error) {
      formStatus.textContent =
        "A connection error occurred. Please try again later.";

      formStatus.classList.add("form-status-error");
      console.error("Form submission error:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send message";
    }
  });
}
