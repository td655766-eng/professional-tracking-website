import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Initialize Firebase
let db = null;
try {
  const app = initializeApp(window.firebaseConfig);
  db = getDatabase(app);
  console.log('✓ Firebase initialized successfully');
} catch (error) {
  console.error('✗ Firebase error:', error.message);
}

const searchForm = document.getElementById('searchForm');
const trackingInput = document.getElementById('trackingInput');
const message = document.getElementById('message');
const shipmentDetails = document.getElementById('shipmentDetails');

// Search for shipment
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const trackingNumber = trackingInput.value.trim().toUpperCase();
  if (!trackingNumber) {
    message.innerHTML = '<p style="color: #b45309;">Please enter a tracking number</p>';
    message.style.display = 'block';
    shipmentDetails.style.display = 'none';
    return;
  }

  message.innerHTML = '<p style="color: #0066ff;">Searching...</p>';
  message.style.display = 'block';
  shipmentDetails.style.display = 'none';

  try {
    if (!db) {
      throw new Error('Firebase not initialized. Check your config.js');
    }

    // Get shipment from Firebase
    const snapshot = await get(ref(db, `shipments/${trackingNumber}`));
    
    if (snapshot.exists()) {
      const shipment = snapshot.val();
      displayShipment(trackingNumber, shipment);
      message.style.display = 'none';
    } else {
      message.innerHTML = '<p style="color: #c92a2a;">Tracking number not found. Try creating one from admin.html first.</p>';
      message.style.display = 'block';
      shipmentDetails.style.display = 'none';
    }
  } catch (error) {
    console.error('Search error:', error);
    message.innerHTML = `<p style="color: #c92a2a;">Error: ${error.message}</p>`;
    message.style.display = 'block';
    shipmentDetails.style.display = 'none';
  }
});

// Display shipment details
function displayShipment(trackingNumber, shipment) {
  document.getElementById('trackingNumber').textContent = trackingNumber;
  document.getElementById('customerName').textContent = shipment.customer_name || '---';
  document.getElementById('customerAddress').textContent = shipment.customer_address || '---';
  document.getElementById('status').textContent = shipment.status || 'Unknown';
  document.getElementById('location').textContent = shipment.location || 'Unknown';
  document.getElementById('eta').textContent = shipment.eta || 'TBD';
  document.getElementById('lastUpdate').textContent = shipment.lastUpdate || 'No updates yet';
  
  shipmentDetails.style.display = 'block';
}

