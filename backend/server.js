const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackingdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'In Transit' },
  origin: {
    address: String,
    coordinates: [Number] // [longitude, latitude]
  },
  destination: {
    address: String,
    coordinates: [Number]
  },
  currentLocation: {
    address: String,
    coordinates: [Number]
  },
  route: [{
    location: String,
    coordinates: [Number],
    timestamp: { type: Date, default: Date.now },
    status: String
  }],
  estimatedDelivery: Date,
  clientId: String, // For multi-client support
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

// Routes
app.get('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/shipments', async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.put('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { trackingNumber: req.params.trackingNumber },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate tracking number
app.post('/api/generate-tracking', async (req, res) => {
  try {
    const { clientId } = req.body;
    const prefix = clientId ? clientId.substring(0, 3).toUpperCase() : 'TRK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const trackingNumber = `${prefix}-${timestamp}-${random}`;

    res.json({ trackingNumber });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all shipments for a client
app.get('/api/shipments/client/:clientId', async (req, res) => {
  try {
    const shipments = await Shipment.find({ clientId: req.params.clientId });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});