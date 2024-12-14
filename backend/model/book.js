import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({

user_id:{
    type:String,
    required: true
},    
email: {
    type: String,
    required: true,
},
phone:{
    type: String,
    required: true,
    unique: true,
},
vehicleNumber:{
    type: String,
    required: true,
},
routeName: {
    type: String,
    required: false,
},
status:{
    type: Boolean,
    required: true,
}


})


const Book = mongoose.model('Book', bookSchema);
export default Book;