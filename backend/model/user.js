import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({

    role:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {

            if (!validator.isEmail(value)) {
              throw new Error("Invalid Email");
            }
          }
    },
    password:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    }
})

const User = mongoose.model("User", userSchema);
export default User;


