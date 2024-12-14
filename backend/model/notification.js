import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    userPhone: {
        type: String,
        required: true,

    },
    routeName : {
        type: String,
        required: true
    }
})

const Notification = mongoose.model("notification", notificationSchema);
export default Notification;