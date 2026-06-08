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
    const clientId = document.getElementById('createClientId').value.trim();

    createResult.style.display = 'none';
    createResult.textContent = '';

    try {
      const genResp = await fetch(`${API_BASE_URL}/api/generate-tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });
      const genJson = await genResp.json();
      const trackingNumber = genJson.trackingNumber;

      const payload = {
        trackingNumber,
        status,
        location: customer_address || 'Unknown',
        eta,
        lastUpdate,
        route,
        clientId,
        customer_name,
        customer_address
      };

      const resp = await fetch(`${API_BASE_URL}/api/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Create failed');

      createResult.textContent = `Shipment created: ${json.trackingNumber}`;
      createResult.style.color = '#059669';
      createResult.style.display = 'block';
      createForm.reset();
    } catch (err) {
      createResult.textContent = err.message;
      createResult.style.color = '#c92a2a';
      createResult.style.display = 'block';
    }
  });
}
