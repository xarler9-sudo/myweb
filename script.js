// ==========================================================
// Portfolio behaviour: theme toggle, mobile menu, form check
// ==========================================================

// ---------- Set the footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Theme toggle (light / dark) ----------
const root = document.documentElement;
const themeBtn = document.getElementById("theme-btn");

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeBtn.textContent = "Light";
  } else {
    root.removeAttribute("data-theme");
    themeBtn.textContent = "Dark";
  }
}

// Remember the visitor's choice. localStorage can fail in private
// windows, so every access is wrapped in try/catch.
let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}

if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

themeBtn.addEventListener("click", function () {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

// Close the menu after a link is chosen
nav.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// ---------- Contact form validation ----------
const form = document.getElementById("contact-form");
const statusBox = document.getElementById("form-status");

// Returns an error message, or "" when the value is fine.
function checkName(value) {
  if (value.length < 2) return "Please enter your name (at least 2 characters).";
  return "";
}

function checkEmail(value) {
  // Simple pattern: something@something.something
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return "Please enter a valid email address.";
  return "";
}

function checkMessage(value) {
  if (value.length < 10) return "Please write at least 10 characters.";
  if (value.length > 1000) return "Please keep the message under 1000 characters.";
  return "";
}

// Shows or clears the error under one field.
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + "-error");
  errorBox.textContent = message;               // textContent, never innerHTML,
  input.parentElement.classList.toggle("invalid", message !== "");   // so typed text cannot inject HTML
}

form.addEventListener("submit", function (event) {
  event.preventDefault();                       // stop the page from reloading

  const name = form.elements["name"].value.trim();
  const email = form.elements["email"].value.trim();
  const message = form.elements["message"].value.trim();

  const nameError = checkName(name);
  const emailError = checkEmail(email);
  const messageError = checkMessage(message);

  showError("name", nameError);
  showError("email", emailError);
  showError("message", messageError);

  if (nameError || emailError || messageError) {
    statusBox.textContent = "";
    return;
  }

  // This site has no server yet, so the message is not sent anywhere.
  // Later, a PHP script (BCA 502) can receive it and store it in MySQL.
  statusBox.textContent = "Thanks, " + name + "! Your message passed all checks.";
  form.reset();
});
