# Tracking Website Backend

A Node.js/Express backend for a professional shipment tracking website with multi-client support.

## Features

- RESTful API for shipment tracking
- MongoDB integration with Mongoose
- Dynamic tracking number generation
- Multi-client support
- Location tracking with coordinates
- Route history and status updates

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your MongoDB connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/trackingdb
   PORT=5000
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/shipments/:trackingNumber` - Get shipment details
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:trackingNumber` - Update shipment
- `POST /api/generate-tracking` - Generate new tracking number
- `GET /api/shipments/client/:clientId` - Get all shipments for a client

## Deployment

For production, use MongoDB Atlas and set the `MONGODB_URI` environment variable.