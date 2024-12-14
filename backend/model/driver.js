import mongoose from "mongoose";
import validator from "validator";

// Define the driver schema
const driverSchema = new mongoose.Schema({
  role:{
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  route: {
    type: String,
    required: false,
  },
  fromLoc: {
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  midPointLoc:{
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  toLoc: {
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  distance : {
    type: Number,
    required: true
  }
});

// Create a 2dsphere index for the location field to support geospatial queries
driverSchema.index({ location: "2dsphere" });

// Create and export the model
const Driver = mongoose.model("Driver", driverSchema);
export default Driver;

