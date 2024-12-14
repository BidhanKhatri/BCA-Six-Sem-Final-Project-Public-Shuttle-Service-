import mongoose from "mongoose";

const selectedPassengerSchema = new mongoose.Schema({
    selectedId: {
        type: String,
        required: true,
        unique: true
    },
    passengerName: {
        type:String,
        required: true,

    },
    urgency:{
        type:Number,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique: true
    },
    seatRequirement: {
        type: Number,
        required:true
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    }
})

const SelectedPassenger = mongoose.model("selectedPassenger", selectedPassengerSchema);
export default SelectedPassenger;