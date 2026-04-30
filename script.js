const shipments = {
  TRK001: {
    status: "In Transit",
    location: "Dallas Distribution Center",
    eta: "2 business days",
    lastUpdate: "Departed Dallas sorting facility",
  },
  TRK002: {
    status: "Delivered",
    location: "New York Fulfillment Hub",
    eta: "Delivered",
    lastUpdate: "Package delivered to recipient",
  },
  TRK003: {
    status: "Processing",
    location: "Los Angeles Warehouse",
    eta: "3 business days",
    lastUpdate: "Label created and awaiting pickup",
  },
  TRK004: {
    status: "Delayed",
    location: "Chicago Transit Center",
    eta: "Pending update",
    lastUpdate: "Delayed due to weather conditions",
  },
};

const statusResult = document.getElementById("statusResult");
const trackingForm = document.getElementById("trackingForm");

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

  window.location.href = `results.html?tracking=${encodeURIComponent(input)}`;
});
