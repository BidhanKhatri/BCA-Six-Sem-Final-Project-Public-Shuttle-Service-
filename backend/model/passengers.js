import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({

    passengers: [{
    
        passengerName: {
            type: String,
            required: true
        },
        urgency: {
            type: Number,
            required: true
        },
        seatRequirement: {
            type: Number,
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        }
    }],
    vehicleNumber: {
        type: String,
        required: true
    }
})
const Passenger = mongoose.model('passenger', passengerSchema);
export default Passenger;