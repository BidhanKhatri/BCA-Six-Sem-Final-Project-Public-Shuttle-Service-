import mongoose from "mongoose";

// Define the admin schema
const adminDriverEntrySchema = new mongoose.Schema({
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
adminDriverEntrySchema.index({ location: "2dsphere" });

// Create and export the model
const DriverEntry = mongoose.model("DriverEntry", adminDriverEntrySchema);
export default DriverEntry;

