import mongoose from "mongoose";

// Define the schema for storing vehicle location
const vehicleLocationSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,  // Ensure each vehicle has a unique number
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },

});

// Create the model using the schema
const VehicleLocation = mongoose.model('VehicleLocation', vehicleLocationSchema);

export default VehicleLocation;
