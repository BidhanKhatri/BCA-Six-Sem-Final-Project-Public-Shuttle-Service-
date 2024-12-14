import express, { json } from 'express';
import FixShuttle from '../model/fixShuttle.js';
import axios from 'axios';
import Admin from '../model/admin.js';
import Driver from '../model/driver.js';
import User from '../model/user.js';

const router = express.Router();

// Helper function to geocode location names to coordinates
const geocodeLocation = async (location) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'YourAppName/1.0 (your.email@example.com)' // Add a User-Agent header
            }
        });
        const data = response.data[0];
        
        if (!data) {
            throw new Error(`Location "${location}" not found`);
        }

        return {
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon),
        };
    } catch (error) {
        throw new Error(`Geocoding error: ${error.message}`);
    }
};

// Helper function to calculate Haversine distance in kilometers
const haversine = ([lon1, lat1], [lon2, lat2]) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Earth radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Route to insert a new FixShuttle with geocoded coordinates
router.post("/admin/shuttle/insert", async (req, res) => {
    const { vehicleNumber, shuttleCapacity, fromLoc, toLoc, routeName, departureTime, arrivalTime } = req.body;

    try {

        const checkRegisterVehicle = await Driver.findOne({vehicleNumber});
        if(!checkRegisterVehicle) {
            return res.status(400).json({ message: `Driver of vehicle ${vehicleNumber} not registered` });
        }

        // Validate required fields
        if (!vehicleNumber || !shuttleCapacity || !fromLoc || !toLoc || !routeName || !departureTime || !arrivalTime) {
            return res.status(400).json({ message: "Please fill all fields" });
        }


        // Geocode fromLoc and toLoc names to get coordinates
        const fromLocCoords = await geocodeLocation(fromLoc);
        const toLocCoords = await geocodeLocation(toLoc);

        // Calculate distance between fromLoc and toLoc
        const distance = haversine([fromLocCoords.longitude, fromLocCoords.latitude], [toLocCoords.longitude, toLocCoords.latitude]);

        // Create a new FixShuttle document with geocoded coordinates
        const newShuttle = new FixShuttle({
            vehicleNumber,
            shuttleCapacity,
            routeName,
            departureTime,
            arrivalTime,
            fromLoc: {
                name: fromLoc,
                coordinates: [fromLocCoords.longitude, fromLocCoords.latitude],
            },
            toLoc: {
                name: toLoc,
                coordinates: [toLocCoords.longitude, toLocCoords.latitude],
            },
            status: false,
        });

        // Save the shuttle in the database
        const savedShuttle = await newShuttle.save();
        res.status(201).json({
            shuttle: savedShuttle,
            distanceInKilometers: distance,
        });

    } catch (error) {
        console.error("Error saving shuttle:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//API to login admin with his email and password 
router.post("/admin/login", async(req,res)=> {
try {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({msg: "Please fill all the fields"});
    }

    const validateAdmin = await Admin.findOne({email});

    if(validateAdmin  && validateAdmin.password === password){
        return res.status(201).json({
            msg: "Login Successful!", 
            data: {

                adminId: validateAdmin._id,
                role: validateAdmin.role,
                email: validateAdmin.email,
                phone: validateAdmin.phone
            }
        })
    }else {
        return res.status(400).json({msg: "Invalid Credentials!"});
    }
   
    
} catch (error) {
    return res.status(500).json({msg: "Internal server error !"})
}
});


//APi to get the admin role
router.get("/admin/role/:id", async(req,res)=> {
    try {
        const {id} = req.params;

        const findAdminRole = await Admin.findById(id);
        
        if(!findAdminRole){
            return res.status(400).json({msg: "Unable to find the admin role!"});
        }

        if(findAdminRole){
            return res.status(201).json({
                adminRole: findAdminRole.role
            })
        } else {
            return res.status(400).json({msg: "Unable to find the admin role!"})
        }
        
    } catch (error) {
     return res.status(500).json({msg: "Internal Server error occured!"})   
    }
})

//admin can delete the fix route 
router.delete("/admin/delete/fix-shuttle/:id", async(req,res)=> {
    try {
        const {id} = req.params;
        const deleteFixShuttle = await FixShuttle.findByIdAndDelete(id);
        if(deleteFixShuttle){
            return res.status(201).json({msg: "Fix shuttle deleted successfully!"});
        }else {
            return res.status(400).json({msg: "Fix shuttle not found!"});
        }
    } catch (error) {
        return res.status(500).json({msg: "Internal Server Error!"});
    }
})

//admin can update the fix route 
router.patch("/admin/update/fix-shuttle/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Validate ID format
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ msg: "Invalid ID format!" });
        // }

        // Check if the FixShuttle document exists
        const findRouteDetails = await FixShuttle.findById(id);
        if (!findRouteDetails) {
            return res.status(404).json({ msg: "Fix shuttle not found!" });
        }

        // Extract fields from the request body
        const { fromLoc, toLoc, ...otherUpdates } = req.body;

        // Prepare the update object
        let updateData = { ...otherUpdates };

        // Update coordinates if fromLoc or toLoc is provided
        if (fromLoc) {
            const fromLocCoords = await geocodeLocation(fromLoc); // Geocode new fromLoc
            updateData.fromLoc = {
                name: fromLoc,
                coordinates: [fromLocCoords.longitude, fromLocCoords.latitude],
            };
        }

        if (toLoc) {
            const toLocCoords = await geocodeLocation(toLoc); // Geocode new toLoc
            updateData.toLoc = {
                name: toLoc,
                coordinates: [toLocCoords.longitude, toLocCoords.latitude],
            };
        }

        // Perform the update
        const updateFixShuttle = await FixShuttle.findByIdAndUpdate(id, updateData, { new: true });
        if (updateFixShuttle) {
            return res.status(200).json({ msg: "Fix shuttle updated successfully!", data: updateFixShuttle });
        } else {
            return res.status(400).json({ msg: "Failed to update Fix shuttle!" });
        }

    } catch (error) {
        console.error("Error updating Fix shuttle:", error);
        return res.status(500).json({ msg: "Internal Server Error!", error: error.message });
    }
});

//admin can get the all users data
router.get("/admin/display-all-user", async(req,res) => {
    try {

        const displayAllUsers = await User.find({});
        if(displayAllUsers){
            return res.status(201).json(displayAllUsers);
        }
        
    } catch (error) {
        return res.status(500).json({msg: "Internal Server Error!"})
    }
} )

//admin can delete all users
router.delete("/admin/delete/user/:id", async(req,res)=>{

    const {id} = req.params;

    try {
        const deleteUser = await User.findByIdAndDelete(id);

        if(!deleteUser){
            return res.status(400).json({msg: "User not found!"});
        }
        if(deleteUser){
            return res.status(201).json({msg: "User Deleted Successfully"});
        }
    
} catch (error) {
    return res.status(500).json({msg:"Internal Server Error!"})
}

})

//admin can delete drivers
router.delete("/admin/delete/driver/:id", async(req,res)=>{

    const {id} = req.params;

    try {
        const deleteDriver = await Driver.findByIdAndDelete(id);

        if(!deleteDriver){
            return res.status(400).json({msg: "Driver not found!"});
        }
        if(deleteDriver){
            return res.status(201).json({msg: "Driver Deleted Successfully"});
        }
    
} catch (error) {
    return res.status(500).json({msg:"Internal Server Error!"})
}

})

//admin can update the drivers
router.patch("/admin/update/driver/:id", async(req,res)=>{
    const {id} = req.params;
    try {
        const updateDriver = await Driver.findByIdAndUpdate(id, req.body, {new: true})
        if(!updateDriver){
            return res.status(400).json({msg: "Driver not found"})
        }
        if(updateDriver) {
            return res.status(201).json({msg: "Driver update successfully"})
        }else{
            return res.status(400).json({msg: "Unable to update driver"})
        }
        
    } catch (error) {
        return res.status(500).json({msg: "Internal Server error"})
    }
})

//admin can update the users
router.patch("/admin/update/user/:id", async(req,res)=>{
    const {id} = req.params;
    try {

        const updateuUser = await User.findByIdAndUpdate(id, req.body, {new: true})
        if(!updateuUser){
            return res.status(400).json({msg: "User not found"})
        }
        if(updateuUser) {
            return res.status(201).json({msg: "User update successfully"})
        }else{
            return res.status(400).json({msg: "Unable to update user"})
        }
        
    } catch (error) {
        return res.status(500).json({msg: "Internal Server error"})
    }
})

//admin can change the status of public shuttle request
router.patch('/admin/verify-accept/public-shuttle-request/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;
        const updateVerification = await Driver.findById(id)
        if(!updateVerification){
            return res.status(400).json({msg: "No user Id found"});
        }else{
         const result =   await Driver.findByIdAndUpdate(id, {isVerified:status}, {new:true} )

         if(result){
            return res.status(201).json({msg: "Status updated successfully"})
         }
        }
    } catch (error) {
        return res.status(500).json({msg: "Internal server error"})
    }
})



export default router;
