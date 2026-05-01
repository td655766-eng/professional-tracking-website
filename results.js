const shipments = {
  PG74833857558585: {
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
  PG92847593847582: {
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
  PG38475829384756: {
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
  PG56738294857384: {
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
  PG83746592837465: {
    status: "Out for Delivery",
    location: "Seattle Regional Hub",
    eta: "Today",
    lastUpdate: "Out for delivery to your address",
    route: [
      "Package received at Seattle hub",
      "Processed and sorted",
      "Out for delivery"
    ],
  },
  PG47583920847583: {
    status: "Returned to Sender",
    location: "Miami Processing Center",
    eta: "N/A",
    lastUpdate: "Package returned due to incorrect address",
    route: [
      "Shipment received in Miami",
      "Delivery attempt failed",
      "Returned to sender"
    ],
  },
  PG74829384756283: {
    status: "In Transit",
    location: "Denver Sorting Facility",
    eta: "1 business day",
    lastUpdate: "Arrived at Denver facility",
    route: [
      "Package received at Denver hub",
      "Departed Denver facility",
      "In transit to final destination"
    ],
  },
  PG92847583746294: {
    status: "Delivered",
    location: "Boston Distribution",
    eta: "Delivered",
    lastUpdate: "Delivered to front door",
    route: [
      "Package received at Boston hub",
      "Out for delivery",
      "Delivered successfully"
    ],
  },
  PG38475920837465: {
    status: "Processing",
    location: "Phoenix Warehouse",
    eta: "4 business days",
    lastUpdate: "Awaiting customs clearance",
    route: [
      "Shipment label created",
      "Awaiting customs clearance",
      "In transit to Phoenix warehouse"
    ],
  },
  PG56729384756382: {
    status: "Delayed",
    location: "Atlanta Transit Hub",
    eta: "Pending",
    lastUpdate: "Delayed due to carrier issue",
    route: [
      "Shipment received in Atlanta",
      "Delayed due to carrier issue",
      "Rescheduled for delivery"
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

async function loadShipmentData() {
  if (!tracking) {
    renderNotFound("No tracking number provided. Please return to the tracker and enter a valid code.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/shipments/${tracking}`);
    const shipment = await response.json();

    if (!response.ok) {
      throw new Error(shipment.error || 'Tracking number not found');
    }

    renderShipment(shipment);
  } catch (error) {
    renderNotFound(`Error loading tracking data: ${error.message}`);
  }
}

function renderShipment(shipment) {
  resultDescription.textContent = `Latest status for ${tracking}`;

  // Format route for display
  const routeHtml = shipment.route && shipment.route.length > 0
    ? shipment.route.map(step => `<li>${step.location || step} - ${step.status || ''}</li>`).join("")
    : '<li>No route information available</li>';

  resultContent.innerHTML = `
    <div class="summary-card">
      <h2>${tracking}</h2>
      <p><strong>Status:</strong> ${shipment.status}</p>
      <p><strong>Current Location:</strong> ${shipment.currentLocation?.address || 'Unknown'}</p>
      <p><strong>Estimated delivery:</strong> ${shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
      <p><strong>Last update:</strong> ${new Date(shipment.updatedAt || shipment.createdAt).toLocaleString()}</p>
    </div>
    <div class="timeline-card">
      <h2>Delivery timeline</h2>
      <ul>
        ${routeHtml}
      </ul>
    </div>
    <div class="map-card">
      <h2>Package location</h2>
      <div id="map" style="height: 300px; width: 100%;"></div>
    </div>
  `;

  // Initialize map if coordinates are available
  if (shipment.currentLocation?.coordinates) {
    initializeMap(shipment.currentLocation.coordinates);
  }
}

function initializeMap(coordinates) {
  const map = L.map('map').setView(coordinates, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker(coordinates).addTo(map)
    .bindPopup('Current location')
    .openPopup();
}

// Load data when page loads
loadShipmentData();
      <h2>Shipment location</h2>
      <div id="map" style="height: 300px; border-radius: 8px;"></div>
    </div>
  `;

  // Initialize map
  const locationCoords = {
    "Dallas Distribution Center": [32.7767, -96.7970],
    "New York Fulfillment Hub": [40.7128, -74.0060],
    "Los Angeles Warehouse": [34.0522, -118.2437],
    "Chicago Transit Center": [41.8781, -87.6298],
    "Seattle Regional Hub": [47.6062, -122.3321],
    "Miami Processing Center": [25.7617, -80.1918],
    "Denver Sorting Facility": [39.7392, -104.9903],
    "Boston Distribution": [42.3601, -71.0589],
    "Phoenix Warehouse": [33.4484, -112.0740],
    "Atlanta Transit Hub": [33.7490, -84.3880]
  };

  const coords = locationCoords[shipment.location] || [39.8283, -98.5795]; // Default to US center
  const map = L.map('map').setView(coords, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  L.marker(coords).addTo(map).bindPopup(shipment.location);
}

const emailAlerts = document.getElementById("emailAlerts");
emailAlerts.addEventListener("change", () => {
  if (emailAlerts.checked) {
    alert("Email alerts enabled! You'll receive updates for this shipment.");
  }
});
