const shipments = {
  PG74833857558585: {
    status: "In Transit",
    location: "Dallas Distribution Center",
    eta: "2 business days",
    lastUpdate: "Departed Dallas sorting facility",
  },
  PG92847593847582: {
    status: "Delivered",
    location: "New York Fulfillment Hub",
    eta: "Delivered",
    lastUpdate: "Package delivered to recipient",
  },
  PG38475829384756: {
    status: "Processing",
    location: "Los Angeles Warehouse",
    eta: "3 business days",
    lastUpdate: "Label created and awaiting pickup",
  },
  PG56738294857384: {
    status: "Delayed",
    location: "Chicago Transit Center",
    eta: "Pending update",
    lastUpdate: "Delayed due to weather conditions",
  },
  PG83746592837465: {
    status: "Out for Delivery",
    location: "Seattle Regional Hub",
    eta: "Today",
    lastUpdate: "Out for delivery to your address",
  },
  PG47583920847583: {
    status: "Returned to Sender",
    location: "Miami Processing Center",
    eta: "N/A",
    lastUpdate: "Package returned due to incorrect address",
  },
  PG74829384756283: {
    status: "In Transit",
    location: "Denver Sorting Facility",
    eta: "1 business day",
    lastUpdate: "Arrived at Denver facility",
  },
  PG92847583746294: {
    status: "Delivered",
    location: "Boston Distribution",
    eta: "Delivered",
    lastUpdate: "Delivered to front door",
  },
  PG38475920837465: {
    status: "Processing",
    location: "Phoenix Warehouse",
    eta: "4 business days",
    lastUpdate: "Awaiting customs clearance",
  },
  PG56729384756382: {
    status: "Delayed",
    location: "Atlanta Transit Hub",
    eta: "Pending",
    lastUpdate: "Delayed due to carrier issue",
  },
};

const statusResult = document.getElementById("statusResult");
const trackingForm = document.getElementById("trackingForm");
const trackButton = document.getElementById("trackButton");
const recentList = document.getElementById("recentList");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const contactResult = document.getElementById("contactResult");

// Load recent tracks on page load
function loadRecentTracks() {
  const recent = JSON.parse(localStorage.getItem("recentTracks") || "[]");
  if (recent.length === 0) {
    recentList.innerHTML = "<p>No recent tracks yet.</p>";
  } else {
    recentList.innerHTML = recent.map(track => `<a href="results.html?tracking=${track}" class="recent-item">${track}</a>`).join("");
  }
}

loadRecentTracks();

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

trackingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const input = document.getElementById("trackingInput").value.toUpperCase().trim();

  if (input === "") {
    statusResult.innerHTML = "<p>Please enter a tracking number to continue.</p>";
    statusResult.style.color = "#b45309";
    return;
  }

  const shipment = shipments[input];
  if (!shipment) {
    statusResult.innerHTML = "<p>Tracking number not found. Check the code and try again.</p>";
    statusResult.style.color = "#c92a2a";
    return;
  }

  // Add to recent tracks
  const recent = JSON.parse(localStorage.getItem("recentTracks") || "[]");
  if (!recent.includes(input)) {
    recent.unshift(input);
    if (recent.length > 5) recent.pop();
    localStorage.setItem("recentTracks", JSON.stringify(recent));
    loadRecentTracks();
  }

  // Show loading state
  trackButton.classList.add("loading");
  trackButton.disabled = true;

  // Simulate database check delay
  setTimeout(() => {
    window.location.href = `results.html?tracking=${encodeURIComponent(input)}`;
  }, 1000);
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
