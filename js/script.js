document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // THEME INITIALIZATION
  // -------------------------------
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");

  // Load saved theme from localStorage, or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);


  // -------------------------------
  // THEME TOGGLE HELPER
  // -------------------------------
  function toggleTheme() {
    const current = root.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }


  // -------------------------------
  // ADD CLICK EVENT TO THE BUTTON
  // -------------------------------
  toggleBtn.addEventListener("click", toggleTheme);

  // === ELEMENT REFERENCES ===
  const form = document.querySelector(".contact-form");

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");

  const inlineErrorOutput = document.getElementById("inline-error");
  const submitErrorOutput = document.getElementById("submit-error");
  const formInfoOutput = document.getElementById("form-info");
  const formErrorsField = document.getElementById("form-errors");

  const messageCounter = document.getElementById("message-counter");
  const dialog = document.getElementById("submitted-dialog");


  // === HELPER: Show temporary error message (TOP INLINE ERROR) ===
  function flashInlineError(msg) {
    inlineErrorOutput.textContent = msg;
    inlineErrorOutput.classList.add("visible");

    setTimeout(() => {
      inlineErrorOutput.textContent = "";
      inlineErrorOutput.classList.remove("visible");
    }, 5000);
  }


  // ========================================================
  // 1. Prevent illegal characters in real time (Name field)
  // ========================================================
  nameField.addEventListener("beforeinput", (e) => {
    const disallowed = /[^A-Za-z\s]/;

    if (e.data && disallowed.test(e.data)) {
      e.preventDefault();

      nameField.classList.add("flash");
      setTimeout(() => nameField.classList.remove("flash"), 150);

      flashInlineError("Illegal character: letters and spaces only.");
    }
  });


  // ========================================================
  // 2. Character countdown for textarea
  // ========================================================
  function updateMessageCounter() {
    let max = messageField.maxLength;
    let used = messageField.value.length;
    let remaining = max - used;

    messageCounter.textContent = `${remaining} characters remaining`;

    messageCounter.classList.remove("warn", "error");

    if (remaining <= 50 && remaining > 0) {
      messageCounter.classList.add("warn");
    }
    if (remaining <= 0) {
      messageCounter.classList.add("error");
    }
  }

  messageField.addEventListener("input", updateMessageCounter);
  updateMessageCounter();


  // ========================================================
  // 3. Live PURPOSE INFO (radio explanations)
  // ========================================================
  const purposeDescriptions = {
    feedback:
      "Feedback — Tell me what you think of the site or offer suggestions.",
    question:
      "Question — Ask me something specific. I’ll get back to you soon.",
    request:
      "Feature Request — Suggest new site sections, tools, or content.",
    other:
      "Other — Anything that doesn't fit the above categories."
  };

  form.addEventListener("change", (e) => {
    if (e.target.name === "purpose") {
      formInfoOutput.textContent = purposeDescriptions[e.target.value];
      formInfoOutput.classList.add("visible");

      // Auto-hide after 7 seconds (optional)
      setTimeout(() => {
        formInfoOutput.classList.remove("visible");
      }, 7000);
    }
  });


  // ========================================================
  // 4. Collect submit-time errors in JSON format
  // ========================================================
  let formErrors = [];

  form.addEventListener("submit", (e) => {
    let attemptErrors = [];

    [...form.elements].forEach((el) => {
      if (!el.name || el.type === "hidden") return;

      if (!el.checkValidity()) {
        attemptErrors.push({
          field: el.name,
          value: el.value,
          error: el.validationMessage,
          timestamp: new Date().toISOString()
        });
      }
    });

    if (attemptErrors.length > 0) {
      e.preventDefault();

      formErrors.push({
        attempt: formErrors.length + 1,
        errors: attemptErrors
      });

      submitErrorOutput.textContent =
        "The form has errors. Please fix them.";
      submitErrorOutput.classList.add("visible");

      formErrorsField.value = JSON.stringify(formErrors);

      let firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();

      return;
    }

    formErrorsField.value = JSON.stringify(formErrors);

    dialog.showModal();
  });

});
