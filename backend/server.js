const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock shipments data for development
const mockShipments = {
  "PG74833857558585": {
    trackingNumber: "PG74833857558585",
    status: "In Transit",
    location: "Dallas Distribution Center",
    eta: "2 business days",
    lastUpdate: "Departed Dallas sorting facility",
    route: ["Package received at Dallas hub", "Departed Dallas facility", "In transit to Memphis terminal", "Arriving at destination city soon"]
  },
  "PG92847593847582": {
    trackingNumber: "PG92847593847582",
    status: "Delivered",
    location: "New York Fulfillment Hub",
    eta: "Delivered",
    lastUpdate: "Package delivered to recipient",
    route: ["Package received at New York hub", "Out for delivery", "Delivered to recipient"]
  },
  "PG38475829384756": {
    trackingNumber: "PG38475829384756",
    status: "Processing",
    location: "Los Angeles Warehouse",
    eta: "3 business days",
    lastUpdate: "Label created and awaiting pickup",
    route: ["Shipment label created", "Awaiting pickup from Los Angeles warehouse", "In transit to regional facility"]
  },
  "PG56738294857384": {
    trackingNumber: "PG56738294857384",
    status: "Delayed",
    location: "Chicago Transit Center",
    eta: "Pending update",
    lastUpdate: "Delayed due to weather conditions",
    route: ["Shipment received in Chicago", "Delayed due to severe weather", "Rescheduled for next departure"]
  },
  "PG83746592837465": {
    trackingNumber: "PG83746592837465",
    status: "Out for Delivery",
    location: "Seattle Regional Hub",
    eta: "Today",
    lastUpdate: "Out for delivery to your address",
    route: ["Package received at Seattle hub", "Processed and sorted", "Out for delivery"]
  }
};

let mongoConnected = false;

// MongoDB connection (non-blocking)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackingdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('MongoDB connected');
  mongoConnected = true;
})
.catch(err => {
  console.log('MongoDB not available, using mock data');
  mongoConnected = false;
});

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, default: 'In Transit' },
  location: String,
  eta: String,
  lastUpdate: String,
  route: [String],
  clientId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

// Routes
app.get('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    const trackingNum = req.params.trackingNumber.toUpperCase();
    
    if (mongoConnected) {
      const shipment = await Shipment.findOne({ trackingNumber: trackingNum });
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      res.json(shipment);
    } else {
      // Use mock data
      const shipment = mockShipments[trackingNum];
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      res.json(shipment);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/shipments', async (req, res) => {
  try {
    if (mongoConnected) {
      const shipment = new Shipment(req.body);
      await shipment.save();
      res.status(201).json(shipment);
    } else {
      const trackingNum = req.body.trackingNumber.toUpperCase();
      mockShipments[trackingNum] = req.body;
      res.status(201).json(req.body);
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.put('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    const trackingNum = req.params.trackingNumber.toUpperCase();
    
    if (mongoConnected) {
      const shipment = await Shipment.findOneAndUpdate(
        { trackingNumber: trackingNum },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      res.json(shipment);
    } else {
      if (!mockShipments[trackingNum]) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      mockShipments[trackingNum] = { ...mockShipments[trackingNum], ...req.body };
      res.json(mockShipments[trackingNum]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    const trackingNum = req.params.trackingNumber.toUpperCase();
    
    if (mongoConnected) {
      const shipment = await Shipment.findOneAndDelete({ trackingNumber: trackingNum });
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      res.json({ message: 'Shipment deleted' });
    } else {
      if (!mockShipments[trackingNum]) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      delete mockShipments[trackingNum];
      res.json({ message: 'Shipment deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate tracking number
app.post('/api/generate-tracking', async (req, res) => {
  try {
    const { clientId } = req.body;
    const prefix = clientId ? clientId.substring(0, 3).toUpperCase() : 'PG';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const trackingNumber = `${prefix}${timestamp}${random}`;

    res.json({ trackingNumber });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all shipments for a client
app.get('/api/shipments/client/:clientId', async (req, res) => {
  try {
    if (mongoConnected) {
      const shipments = await Shipment.find({ clientId: req.params.clientId });
      res.json(shipments);
    } else {
      const clientShipments = Object.values(mockShipments).filter(s => s.clientId === req.params.clientId);
      res.json(clientShipments);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using ${mongoConnected ? 'MongoDB' : 'mock data (development)'}`);
});