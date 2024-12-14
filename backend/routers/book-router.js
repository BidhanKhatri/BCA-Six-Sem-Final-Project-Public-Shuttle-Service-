import express from 'express';
import Book from '../model/book.js';
const router = new express.Router();


//API to insert the booking results of user in 
router.post('/driver/book-route', async (req, res)=>{

const {userEmail, userPhone, vehicleNum, routeName, user_id} = req.body;
console.log(req.body);

    if(!userEmail || !userPhone || ! vehicleNum || !routeName){
        return res.status(400).json({message: "Please fill all the fieldsssss"});
    }
    
    const existingUser = await Book.findOne({userPhone});

    if(existingUser){
        return res.status(400).json({message: "You have already booked your route "});
    }

    try{

    // Create a new booking entry
    const newBookedUser = new Book({
        user_id,
        email: userEmail,                
        phone: userPhone,             
        vehicleNumber: vehicleNum,     
        routeName,
        status: false
      });

      const savedBookedUser =  await newBookedUser.save();

      return res.status(201).json(savedBookedUser);

    }catch(err){
        return res.status(500).json({message: "Internal Server Error"});
    }



})

//API to get the booking results of user 
router.get('/route/booking-details/:id', async(req,res)=>{
try{
const id = req.params.id;
const bookingDetails = await Book.findOne({user_id:id});
if(bookingDetails){
    res.status(200).json({
        _id:bookingDetails._id,
        user_id:bookingDetails.user_id,
        routeName:bookingDetails.routeName,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        vehicleNumber: bookingDetails.vehicleNumber,
        status: bookingDetails.status
    })
    return;
}else{
    res.status(404).json({msg:"Booking details not found"});
    return;
}
}catch(err){
    res.status(500).json({msg:"Internal server error"});
}
})

//User can delete the booking details
router.delete('/route/booking-details/delete/:id',async(req,res)=>{

    const id = req.params.id;
    try{
        const deleteBooking = await Book.findByIdAndDelete(id);
        if(deleteBooking){
        res.status(201).json({msg:"Booking details deleted successfully"});
        }else{
            res.status(404).json({msg:"Booking details not found"});
        }
    }catch(err){
        res.status(500).json({msg:"Internal server error"});
    }
})

//driver can see the notifications with vehical number
router.get('/driver/notifications/:vehicleNumber', async(req,res)=>{
    try{
        const vehicleNumber = req.params.vehicleNumber;

        const displayNotification = await Book.find({vehicleNumber});
        if(displayNotification.length > 0){
           const formattedNotification = displayNotification.map(notification => ({
            userId : notification.user_id,
            userEmail : notification.email,
            userPhone : notification.phone,
            userRoute: notification.routeName,
            staus: notification.status,
            notificationId: notification._id
           }))
           res.status(201).json(formattedNotification);
           return;
        }else{
             return res.status(404).json({msg: "No notifications found"});
        }

    }catch(err){
        res.status(500).json({msg: "Internal server error"})
    }
})
// user will be able to wor
export default router;
