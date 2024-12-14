// routes/live-tracking.js
import express from "express";
import Driver from "../model/driver.js";
import VehicleLocation from "../model/vehicleLocation.js";
const router = express.Router();

// Basic route for health check
router.get("/", (req, res) => {
  res.send("Live tracking API is running.");
});

router.get('/api/vehicle/location/:vehicleNumber', async (req, res) => {
  const { vehicleNumber } = req.params;
  
  // Fetch vehicle details from database or tracking system
  const vehicle = await Driver.findOne({ vehicleNumber });
  
  if (vehicle) {
    return res.json({
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
      vehicleNumber: vehicle.vehicleNumber,
    });
  }

  res.status(404).json({ message: "Vehicle not found" });
});


// Endpoint to update vehicle location
router.post('/live-tracking/updateLocation', async (req, res) => {
  const { vehicleNumber, latitude, longitude } = req.body;

  if (!vehicleNumber || !latitude || !longitude) {
    return res.status(400).json({ message: 'Vehicle number, latitude, and longitude are required' });
  }

  try {
    // Find the vehicle by its number and update its location
    const vehicle = await VehicleLocation.findOneAndUpdate(
      { vehicleNumber: vehicleNumber },
      { latitude, longitude, timestamp: new Date()}, // Update the latitude, longitude, and timestamp
      { new: true, upsert: true } // 'upsert' will create a new record if one doesn't exist
    );

    return res.json(vehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating vehicle location' });
  }
});



export default router;
