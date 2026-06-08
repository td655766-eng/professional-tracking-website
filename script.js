const statusResult = document.getElementById("statusResult");
const trackingForm = document.getElementById("trackingForm");
const trackButton = document.getElementById("trackButton");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const contactResult = document.getElementById("contactResult");

// Note: recent searches removed per user preference

// Theme toggle
function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
});

trackingForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const input = document.getElementById("trackingInput").value.toUpperCase().trim();

  if (input === "") {
    statusResult.innerHTML = "<p>Please enter a tracking number to continue.</p>";
    statusResult.style.color = "#b45309";
    return;
  }

  // Show loading state
  trackButton.classList.add("loading");
  trackButton.disabled = true;
  statusResult.innerHTML = "<p>Searching for your package...</p>";
  statusResult.style.color = "#059669";

  try {
    // Call backend API
    const response = await fetch(`${API_BASE_URL}/api/shipments/${input}`);
    const shipment = await response.json();

    if (!response.ok) {
      throw new Error(shipment.error || 'Tracking number not found');
    }

    // Redirect to results
    window.location.href = `results.html?tracking=${encodeURIComponent(input)}`;

  } catch (error) {
    statusResult.innerHTML = `<p>${error.message}. Please check the tracking number and try again.</p>`;
    statusResult.style.color = "#c92a2a";
    trackButton.classList.remove("loading");
    trackButton.disabled = false;
  }
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    contactResult.innerHTML = "<p>Please fill in all fields.</p>";
    contactResult.style.color = "#c92a2a";
    contactResult.style.display = "block";
    return;
  }

  // Simulate sending
  contactResult.innerHTML = "<p>Thank you! Your message has been sent. We'll respond within 24 hours.</p>";
  contactResult.style.color = "#0f172a";
  contactResult.style.display = "block";
  contactForm.reset();
});
