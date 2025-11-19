document.addEventListener("DOMContentLoaded", () => {
  let root = document.documentElement;

  // Theme Toggle
  let toggleBtn = document.getElementById("theme-toggle");

  let savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);

  function toggleTheme() {
    let current = root.getAttribute("data-theme");
    let next = current === "light" ? "dark" : "light";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  toggleBtn.addEventListener("click", toggleTheme);



  // Form Script
  let form = document.querySelector(".contact-form");

  let nameField = document.getElementById("name");
  let emailField = document.getElementById("email");
  let messageField = document.getElementById("message");

  let inlineErrorOutput = document.getElementById("inline-error");
  let submitErrorOutput = document.getElementById("submit-error");
  let formInfoOutput = document.getElementById("form-info");
  let formErrorsField = document.getElementById("form-errors");

  let messageCounter = document.getElementById("message-counter");
  let dialog = document.getElementById("submitted-dialog");

  function flashInlineError(msg) {
    inlineErrorOutput.textContent = msg;
    inlineErrorOutput.classList.add("visible");

    setTimeout(() => {
      inlineErrorOutput.textContent = "";
      inlineErrorOutput.classList.remove("visible");
    }, 5000);
  }


  // Check characters in name field
  nameField.addEventListener("beforeinput", (e) => {
    let disallowed = /[^A-Za-z\s]/;

    if (e.data && disallowed.test(e.data)) {
      e.preventDefault();

      nameField.classList.add("flash");
      setTimeout(() => nameField.classList.remove("flash"), 150);

      flashInlineError("Illegal character: letters and spaces only.");
    }
  });


  // Character countdown
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


  // Info pop-up for buttons
  let purposeDescriptions = {
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


  // Error collection
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



  // MPA View Transition (LCD)
  // Only activate if the browser supports it
  if (document.startViewTransition) {
    document.addEventListener("click", (e) => {
      let link = e.target.closest("a");
      if (!link) return;

      // Only intercept same-origin normal navigation links
      let url = new URL(link.href);
      if (url.origin !== location.origin) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();

      // The LCD screen area we want to transition
      let screen = document.querySelector(".screen");

      document.startViewTransition(() => {
        // Navigate after DOM is in "old" state
        window.location.href = link.href;
      });
    });
  }

});
