import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Initialize Firebase from config.js
let db = null;
if (window.firebaseConfig && window.firebaseConfig.apiKey !== "REPLACE_WITH_YOUR_API_KEY") {
  try {
    const app = initializeApp(window.firebaseConfig);
    db = getDatabase(app);
  } catch (e) {
    console.warn('Firebase init error:', e.message);
  }
}

// Generate a unique tracking number
function generateTracking() {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PG${timestamp}${random}`;
}

// Copy to clipboard helper
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Tracking number copied to clipboard!');
  }).catch(() => {
    console.log('Fallback copy');
  });
}

const form = document.getElementById('shipmentForm');
const resultContainer = document.getElementById('resultContainer');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultContainer.style.display = 'none';
    resultContainer.innerHTML = '';

    // Get form values
    const customer_name = document.getElementById('customerName').value.trim();
    const customer_address = document.getElementById('customerAddress').value.trim();
    const status = document.getElementById('status').value.trim();
    const eta = document.getElementById('eta').value.trim();
    const location = document.getElementById('location').value.trim() || customer_address;

    // Validate required fields
    if (!customer_name || !customer_address || !status) {
      resultContainer.innerHTML = '<div class="error-box"><strong>Error:</strong> Please fill in all required fields.</div>';
      resultContainer.style.display = 'block';
      return;
    }

    // Generate tracking number
    const trackingNumber = generateTracking();

    // Build shipment data
    const shipmentData = {
      trackingNumber,
      customer_name,
      customer_address,
      status,
      location,
      eta: eta || 'TBD',
      lastUpdate: 'Shipment created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (!db) {
        throw new Error('Firebase not configured. Check config.js');
      }

      // Save to Firebase
      await set(ref(db, `shipments/${trackingNumber}`), shipmentData);

      // Show success with tracking number
      resultContainer.innerHTML = `
        <div class="success-box">
          <strong>✓ Shipment created successfully!</strong>
          <div class="tracking-display">
            <div class="label">Tracking Number</div>
            <div class="code">${trackingNumber}</div>
            <div class="hint">Share this code with your customer to track the shipment</div>
            <button type="button" class="copy-btn" onclick="navigator.clipboard.writeText('${trackingNumber}'); alert('Copied!')">Copy to clipboard</button>
          </div>
        </div>
      `;
      resultContainer.style.display = 'block';

      // Reset form
      form.reset();
    } catch (error) {
      resultContainer.innerHTML = `<div class="error-box"><strong>Error:</strong> ${error.message}</div>`;
      resultContainer.style.display = 'block';
      console.error('Firebase error:', error);
    }
  });
}
