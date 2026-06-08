import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase config: replace values with your Firebase project's settings
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://REPLACE_WITH_YOUR_PROJECT.firebaseio.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function generateTracking(clientId) {
  const prefix = clientId ? clientId.toString().substring(0,3).toUpperCase() : 'PG';
  const ts = Date.now().toString().slice(-6);
  const rand = Math.random().toString(36).substring(2,5).toUpperCase();
  return `${prefix}${ts}${rand}`;
}

const createForm = document.getElementById('createForm');
const createResult = document.getElementById('createResult');

if (createForm) {
  createForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const customer_name = document.getElementById('createCustomerName').value.trim();
    const customer_address = document.getElementById('createCustomerAddress').value.trim();
    const status = document.getElementById('createStatus').value.trim() || 'Processing';
    const eta = document.getElementById('createEta').value.trim();
    const lastUpdate = document.getElementById('createLastUpdate').value.trim();
    const route = document.getElementById('createRoute').value
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
    const clientId = document.getElementById('createClientId').value.trim() || 'PG';

    createResult.style.display = 'none';
    createResult.textContent = '';

    const trackingNumber = generateTracking(clientId);
    const payload = {
      trackingNumber,
      status,
      location: customer_address || 'Unknown',
      eta,
      lastUpdate,
      route,
      clientId,
      customer_name,
      customer_address,
      createdAt: new Date().toISOString(),
      timeline: [ { status: 'created', timestamp: new Date().toISOString() } ]
    };

    try {
      await set(ref(db, `shipments/${trackingNumber}`), payload);
      createResult.textContent = `Shipment created: ${trackingNumber}`;
      createResult.style.color = '#059669';
      createResult.style.display = 'block';
      createForm.reset();
    } catch (err) {
      createResult.textContent = err.message || 'Error writing to Firebase';
      createResult.style.color = '#c92a2a';
      createResult.style.display = 'block';
    }
  });
}
