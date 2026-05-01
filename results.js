const params = new URLSearchParams(window.location.search);
const tracking = params.get("tracking")?.toUpperCase().trim();
const resultDescription = document.getElementById("resultDescription");
const resultContent = document.getElementById("resultContent");

// Map locations to coordinates
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

function renderNotFound(message) {
  resultDescription.textContent = message;
  resultContent.innerHTML = `
    <div class="status-card">
      <p style="color: #c92a2a;">${message}</p>
    </div>
  `;
}

async function loadShipmentData() {
  if (!tracking) {
    renderNotFound("No tracking number provided. Please return to the tracker and enter a valid code.");
    return;
  }

  try {
    const apiHost = window.location.hostname || 'localhost';
    const apiBase = `http://${apiHost}:5000`;
    const response = await fetch(`${apiBase}/api/shipments/${tracking}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Tracking number not found');
    }

    const shipment = await response.json();
    renderShipment(shipment);
  } catch (error) {
    console.error('API Error:', error);
    renderNotFound(`${error.message}. Please check the tracking number and try again.`);
  }
}

function renderShipment(shipment) {
  resultDescription.textContent = `Latest status for ${tracking}`;

  const routeHtml = shipment.route && shipment.route.length > 0
    ? shipment.route.map(step => `<li>${step}</li>`).join("")
    : '<li>No route information available</li>';

  resultContent.innerHTML = `
    <div class="summary-card">
      <h2>${tracking}</h2>
      <p><strong>Status:</strong> <span style="color: #0066ff; font-weight: bold;">${shipment.status}</span></p>
      <p><strong>Location:</strong> ${shipment.location || 'Unknown'}</p>
      <p><strong>Estimated Delivery:</strong> ${shipment.eta || 'TBD'}</p>
      <p><strong>Last Update:</strong> ${shipment.lastUpdate || 'No updates yet'}</p>
    </div>
    <div class="timeline-card">
      <h2>Delivery Timeline</h2>
      <ul>
        ${routeHtml}
      </ul>
    </div>
    <div class="map-card">
      <h2>Package Location</h2>
      <div id="map" style="height: 300px; width: 100%; border-radius: 8px; background-color: #f0f0f0;"></div>
    </div>
  `;

  const coords = locationCoords[shipment.location] || [39.8283, -98.5795];
  try {
    const map = L.map('map').setView(coords, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker(coords).addTo(map).bindPopup(`<strong>${shipment.location}</strong>`).openPopup();
  } catch (e) {
    console.warn('Map initialization error:', e);
    document.getElementById('map').innerHTML = `<p style="padding: 10px; color: #666;">Location: ${shipment.location || 'Unknown'}</p>`;
  }

  setTimeout(() => {
    const emailAlerts = document.getElementById("emailAlerts");
    if (emailAlerts) {
      emailAlerts.addEventListener("change", () => {
        if (emailAlerts.checked) {
          alert("Email alerts enabled! You'll receive updates for this shipment.");
        }
      });
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', loadShipmentData);
