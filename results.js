const shipments = {
  TRK001: {
    status: "In Transit",
    location: "Dallas Distribution Center",
    eta: "2 business days",
    lastUpdate: "Departed Dallas sorting facility",
    route: [
      "Package received at Dallas hub",
      "Departed Dallas facility",
      "In transit to Memphis terminal",
      "Arriving at destination city soon"
    ],
  },
  TRK002: {
    status: "Delivered",
    location: "New York Fulfillment Hub",
    eta: "Delivered",
    lastUpdate: "Package delivered to recipient",
    route: [
      "Package received at New York hub",
      "Out for delivery",
      "Delivered to recipient"
    ],
  },
  TRK003: {
    status: "Processing",
    location: "Los Angeles Warehouse",
    eta: "3 business days",
    lastUpdate: "Label created and awaiting pickup",
    route: [
      "Shipment label created",
      "Awaiting pickup from Los Angeles warehouse",
      "In transit to regional facility"
    ],
  },
  TRK004: {
    status: "Delayed",
    location: "Chicago Transit Center",
    eta: "Pending update",
    lastUpdate: "Delayed due to weather conditions",
    route: [
      "Shipment received in Chicago",
      "Delayed due to severe weather",
      "Rescheduled for next departure"
    ],
  },
};

const params = new URLSearchParams(window.location.search);
const tracking = params.get("tracking")?.toUpperCase().trim();
const resultDescription = document.getElementById("resultDescription");
const resultContent = document.getElementById("resultContent");

function renderNotFound(message) {
  resultDescription.textContent = message;
  resultContent.innerHTML = `
    <div class="status-card">
      <p>${message}</p>
    </div>
  `;
}

if (!tracking) {
  renderNotFound("No tracking number provided. Please return to the tracker and enter a valid code.");
} else if (!shipments[tracking]) {
  renderNotFound("Tracking number not found. Please verify the code and try again.");
} else {
  const shipment = shipments[tracking];
  resultDescription.textContent = `Latest status for ${tracking}`;
  resultContent.innerHTML = `
    <div class="summary-card">
      <h2>${tracking}</h2>
      <p><strong>Status:</strong> ${shipment.status}</p>
      <p><strong>Location:</strong> ${shipment.location}</p>
      <p><strong>Estimated delivery:</strong> ${shipment.eta}</p>
      <p><strong>Last update:</strong> ${shipment.lastUpdate}</p>
    </div>
    <div class="timeline-card">
      <h2>Delivery timeline</h2>
      <ul>
        ${shipment.route.map(step => `<li>${step}</li>`).join("")}
      </ul>
    </div>
  `;
}
