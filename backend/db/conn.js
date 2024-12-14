import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/public-suttle-service")
.then(()=> console.log("Connected to database"))
.catch((err)=> console.log(err));

