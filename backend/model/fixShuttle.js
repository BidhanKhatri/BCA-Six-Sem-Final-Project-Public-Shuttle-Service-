import mongoose from "mongoose";

const fixShuttleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
    },
    shuttleCapacity: {
        type: Number,
        required: true,
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
    routeName:{
        type: String,
        required: true,
    },
    departureTime: {
        type: String,
        required: true,
    },
    arrivalTime: {
        type: String,
        required: true,
    },
    status:{
        type: Boolean,
        default: false
    }
})
const FixShuttle = mongoose.model("fixShuttle", fixShuttleSchema);
export default FixShuttle;