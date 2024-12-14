import express from 'express';
import axios from 'axios';
import geolib from 'geolib';
import haversine from 'haversine-distance';

const router = new express.Router();

//importing models for inserting data
import DriverSchema from '../model/driver.js';
import Book from '../model/book.js';
import Passenger from '../model/passengers.js';
import SelectedPassenger from '../model/selectedPassenger.js';
import Driver from '../model/driver.js';
import FixShuttle from '../model/fixShuttle.js';

// API to insert driver
// Geocoding API (example using OpenStreetMap Nominatim)
const geocodeLocation = async (location) => {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`);
  const data = response.data[0];
  return {
    latitude: parseFloat(data.lat),
    longitude: parseFloat(data.lon),
  };
};

// API to insert driver with geocoded route coordinates
// router.post('/driver/insert', async (req, res) => {
//   const { email, password, phone, vehicleNumber, fromLoc, midPointLoc, toLoc, route } = req.body;

//   try {
//     // Validate required fields
//     if (!email || !password || !phone || !vehicleNumber || !fromLoc || !midPointLoc || !toLoc) {
//       return res.status(400).json({ message: 'Please fill all fields' });
//     }
 
//     // Check if the driver already exists
//     const existingDriver = await DriverSchema.findOne({ email });
//     if (existingDriver) {
//       return res.status(400).json({ message: 'Driver already exists' });
//     }

//      // Calculate distances between locations
//      const fromToMidDistance = haversine(fromLoc.coordinates, midPointLoc.coordinates);
//      const midToToDistance = haversine(midPointLoc.coordinates, toLoc.coordinates);
//      const totalDistance = fromToMidDistance + midToToDistance;
//      const totalDistanceInKilometers = totalDistance/1000;

//     // Create a new driver entry with fromLoc and toLoc coordinates
//     const newDriver = new DriverSchema({
//       role: "driver",
//       isVerified: false,
//       email,
//       password,
//       phone,
//       vehicleNumber,
//       route,
//       fromLoc: {
//         name: fromLoc.name,
//         coordinates: [fromLoc.coordinates.longitude, fromLoc.coordinates.latitude],
//       },
//       midPointLoc:{
//         name: midPointLoc.name,
//         coordinates: [midPointLoc.coordinates.longitude, midPointLoc.coordinates.latitude],
//       },
//       toLoc: {
//         name: toLoc.name,
//         coordinates: [toLoc.coordinates.longitude, toLoc.coordinates.latitude],
//       },
//       distance: totalDistanceInKilometers
//     });

//     // Save the driver in the database
//     const savedDriver = await newDriver.save();
//     res.status(201).json(savedDriver);

//   } catch (error) {
//     console.error('Error saving driver:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

router.post('/driver/insert', async (req, res) => {
  const { email, password, phone, vehicleNumber, fromLoc, midPointLoc, toLoc, route } = req.body;

  try {
    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Validate phone number using regex (allowing numeric characters only, e.g., 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits' });
    }

    // Check if the driver already exists
    const existingDriver = await DriverSchema.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    // Calculate distances between locations if location data is provided
    let totalDistanceInKilometers = 0;
    if (fromLoc?.coordinates && midPointLoc?.coordinates && toLoc?.coordinates) {
      const fromToMidDistance = haversine(fromLoc.coordinates, midPointLoc.coordinates);
      const midToToDistance = haversine(midPointLoc.coordinates, toLoc.coordinates);
      const totalDistance = fromToMidDistance + midToToDistance;
      totalDistanceInKilometers = totalDistance / 1000;
    }

    // Create a new driver entry
    const newDriver = new DriverSchema({
      role: "driver",
      isVerified: false,
      email,
      password,
      phone,
      vehicleNumber, // Optional
      route,         // Optional
      fromLoc: fromLoc
        ? {
            name: fromLoc.name,
            coordinates: [fromLoc.coordinates.longitude, fromLoc.coordinates.latitude],
          }
        : undefined, // Only add if provided
      midPointLoc: midPointLoc
        ? {
            name: midPointLoc.name,
            coordinates: [midPointLoc.coordinates.longitude, midPointLoc.coordinates.latitude],
          }
        : undefined, // Only add if provided
      toLoc: toLoc
        ? {
            name: toLoc.name,
            coordinates: [toLoc.coordinates.longitude, toLoc.coordinates.latitude],
          }
        : undefined, // Only add if provided
      distance: totalDistanceInKilometers,
    });

    // Save the driver in the database
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);

  } catch (error) {
    console.error('Error saving driver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




  //API to authenticate user
  router.post('/driver/authenticate', async(req,res)=>{
    const {email, password} = req.body;
    
    
    try{
      const user = await DriverSchema.findOne({email});
      // console.log(user);
      if(user && user.password === password){
        res.status(201).json({
          role: user.role,
          _id: user._id,
          email: user.email,
          message: "Login Successful",
        })
      }else{
          return res.status(400).json({message: "Invalid Credentials"});
      }
      
    }catch(err){
     return res.status(400).json({message: "Invalid Credentials"});
    }
  })
  
  //API to get all data from the database
  router.get('/driver', async(req,res)=>{
  
    try{
      const result = await DriverSchema.find();
      console.log(result);
      res.status(201).send(result);
    }catch(err){
      res.status(400).send(err);
    }
  
  })
  
  //API to get single user data from the database
  router.get('/driver/:id', async(req,res)=>{
    const _id = req.params.id; //getting the id from the url using params
    try{
      const result = await DriverSchema.findById({_id})
      console.log(result);
      res.status(201).send(result);
    }catch(err){
      res.status(400).send(err);
    }
  })
  
  //API to update a user
  router.patch('/driver/:id', async(req,res)=>{
    try{
      const _id = req.params.id;
     const updateResult = await DriverSchema.findByIdAndUpdate(_id, req.body, {new: true});
     res.status(201).send(updateResult);
    }catch(err){
      res.status(404).send(err)
    }
  })
  
  //API to delete a user
  router.delete('/driver/:id', async(req,res)=>{
    try{
      const _id = req.params.id;
      const deleteResult = await DriverSchema.findByIdAndDelete({_id});
      
      if(!_id){
        return res.send(404).send("User not found");
      }
      res.status(201).send(deleteResult);
  
    }catch(err){
      res.status(500).send(err);
    }
  
  })

// Route to get possible routes based on user input
router.post('/driver/find-routes', async (req, res) => {
  try {
    const { fromLocation, toLocation } = req.body;

    // Get latitude and longitude for "from" and "to" locations
    const fromCoords = await geocodeLocation(fromLocation);
    const toCoords = await geocodeLocation(toLocation);

    // Retrieve all routes from the database
    const routes = await DriverSchema.find({});
    console.log("Data from database " + routes);

    // Filter and calculate the distances for matching routes
    const availableRoutes = routes.map((route) => {
      // Get coordinates from the route
      const fromRouteCoords = { 
        latitude: route.fromLoc.coordinates[1], 
        longitude: route.fromLoc.coordinates[0] 
      };
      const toRouteCoords = { 
        latitude: route.toLoc.coordinates[1], 
        longitude: route.toLoc.coordinates[0] 
      };

      // Check if the user's fromLocation and toLocation match the route's locations
      const isFromLocationMatch = (
        Math.abs(fromCoords.latitude - fromRouteCoords.latitude) < 0.01 &&
        Math.abs(fromCoords.longitude - fromRouteCoords.longitude) < 0.01
      );
      const isToLocationMatch = (
        Math.abs(toCoords.latitude - toRouteCoords.latitude) < 0.01 &&
        Math.abs(toCoords.longitude - toRouteCoords.longitude) < 0.01
      );

      if (isFromLocationMatch && isToLocationMatch) {
        // Calculate the distance from "from" location to "to" location
        const distance = geolib.getDistance(
          { latitude: fromCoords.latitude, longitude: fromCoords.longitude },
          { latitude: toCoords.latitude, longitude: toCoords.longitude }
        ) / 1000; // Convert to km

        return {
          routeId: route._id,
          routeName: route.route,
          distance: distance.toFixed(2), // Return distance in kilometers
          vehicleNum: route.vehicleNumber,
          driverEmail: route.email,
        };
      }
      return null;
    }).filter(route => route !== null); // Remove null values

    // Sort by distance (shortest route first)
    availableRoutes.sort((a, b) => a.distance - b.distance);

    // Send the sorted routes back to the frontend
    res.json(availableRoutes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//api to change the status of users booking
router.patch('/driver/change-status/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch the booking details for the given user ID
    const bookingDetails = await Book.findOne({ user_id: id });

    if (bookingDetails) {
      // Check if the status is already true
      if (bookingDetails.status === true) {
        return res.status(200).json({ msg: "Already accepted" });
      }

      // If status is not true, proceed to update it
      const updateStatus = await Book.findByIdAndUpdate(bookingDetails._id, req.body, { new: true });
      
      if (updateStatus) {
        res.status(201).json({ msg: "Status updated successfully" });
      } else {
        res.status(404).json({ msg: "Status update failed" });
      }
      return;
    } else {
      // If booking details are not found for the given user ID
      res.status(404).json({ msg: "Booking details not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

//driver can select the passenger using knapsack algorithm
router.get('/driver/select-passenger/:vehicleNumber', async (req, res) => {
  try {
      const vehicleNumber = req.params.vehicleNumber;
      const seatCapacity = parseInt(req.query.seatCapacity, 10);  // Parse seatCapacity from query parameters

      if (isNaN(seatCapacity)) {
          return res.status(400).json({ msg: "Invalid seat capacity" });
      }

      const findPassengers = await Passenger.findOne({ vehicleNumber });

      if (findPassengers && findPassengers.passengers) {
          console.log("Passengers data:", findPassengers.passengers);

          // Apply the knapsack algorithm to select the optimal passengers
          const selectedPassengers = knapsackAlgorithm(findPassengers.passengers, seatCapacity);

          // Respond with selected passengers
          return res.status(201).json({
              msg: "Selected passengers using knapsack algorithm",
              count: selectedPassengers.length,
              passengers: selectedPassengers
          });
      } else {
          return res.status(404).json({ msg: "No passengers found for this vehicle number" });
      }
  } catch (err) {
      console.error("Error selecting passengers:", err.message, err.stack);
      return res.status(500).json({ msg: "Internal server error" });
  }
});

// Knapsack Algorithm Function with Debugging
function knapsackAlgorithm(passengers, capacity) {
  const n = passengers.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
          const passenger = passengers[i - 1];
          const weight = passenger.seatRequirement;
          const value = passenger.urgency;

          if (weight <= w) {
              dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
          } else {
              dp[i][w] = dp[i - 1][w];
          }
      }
  }

  // Debugging DP table
  console.log("DP Table:", dp);

  // Backtrack to find the selected passengers
  const selectedPassengers = [];
  let w = capacity;

  for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
          const passenger = passengers[i - 1];
          selectedPassengers.push(passenger);
          w -= passenger.seatRequirement;
      }
  }

  return selectedPassengers.reverse();  // Reverse to maintain the original order
}


//display passenger request with vehicle number
router.get('/driver/display-passenger/:vehicleNumber', async(req,res)=>{
  try{

    const vehicleNumber = req.params.vehicleNumber;

    if(!vehicleNumber){
      return res.status(404).json({msg:"Vehicle number not found"});
    }

    const displayPassenger = await Passenger.findOne({vehicleNumber});

    if(displayPassenger){
      return res.status(201).json({
        count: displayPassenger.passengers.length,
        passengers: displayPassenger.passengers
      })
    }
    else{
      return res.status(404).json({msg:"Passenger not found"});
    }

  }catch(err){
    return res.status(500).json({msg:"Internal server error"});
  }
})

//driver can accept the passengers
router.post("/driver/accept-passengers/", async(req,res)=>{
  try {

    const {selectedId, passengerName, urgency, phone, vehicleNumber, seatRequirement} = req.body;


    if(!selectedId || !passengerName || !urgency || !phone || !vehicleNumber || !seatRequirement){
      return res.status(400).json({msg:"Please fill all the fields"});
    }

    const acceptPassengers = await SelectedPassenger.findOne({selectedId});
    if(acceptPassengers){
      return res.status(400).json({msg: "passenger already accepted"});
    }else {
      const createSelectedPassengers = new SelectedPassenger({
        selectedId,
        passengerName,
        urgency,
        seatRequirement,
        phone,
        vehicleNumber,
        status:true
      })
      await createSelectedPassengers.save();
      return res.status(201).json({msg: "Passengers selected succefully"});
    }
    
  } catch (error) {
      console.log(error)
  }
})

//driver can delete the previously requested passngers while clicking accept button
router.delete('/driver/delete-previous-req/:vehicleNumber', async(req,res)=>{
  try {

    const vehicleNumber = req.params.vehicleNumber;
    const deletedPassengers = await Passenger.findOneAndDelete({vehicleNumber});
    if(deletedPassengers) return res.status(201).json({msg:`All passengers of vehicle number ${vehicleNumber} deleted successfully`});
    else return res.status(404).json({msg:"No passengers have been requested"})
    
  } catch (error) {
    return res.status(500).json({msg:"Internal server error"});
    
  }
})

//driver can see the selected Passenger data
router.get('/driver/display-selectedPassenger/:vehicleNumber', async(req,res)=>{
  try{
    const {vehicleNumber} = req.params;
    const displaySelectedPassengers = await SelectedPassenger.find({vehicleNumber})
    
    if(displaySelectedPassengers.length > 0){
      return res.status(201).json(
        {
          count: displaySelectedPassengers.length,
          data: displaySelectedPassengers
        }
      )
    }
    else{
      return res.status(400).json({msg:"Unable to find seleted passengers "})
    }
  }catch(err){
    return res.status(500).json({msg:"Internal server error"});
  }
})

//get the role of driver using id
router.get('/driver/get-driver-role/:id', async(req,res)=>{
  try {
    const {id} = req.params;
    const getDriverRole = await Driver.findById(id);
    if(getDriverRole){
      return res.status(201).json({
        role: getDriverRole.role
      })
    }else{
      return res.status(400).json({msg:"Unable to get the role"})
    }
  } catch (error) { 
    return res.status(500).json({msg: ["Internal server error!","Unable to get the role"]})
    
  }
})

//driver can delete the single selected passenger
router.delete('/driver/delete-single-selectedPassenger/:phone', async(req,res)=>{
  try {
    const {phone} = req.params;

    const deleteSingleSelectedPassenger = await SelectedPassenger.findOneAndDelete({phone});
    if(!deleteSingleSelectedPassenger){
      return res.status(404).json({msg: "Unable to delete the passenger"});
    }
    if(deleteSingleSelectedPassenger){
      return res.status(201).json({msg: "Passenger deleted successfully"})
    }else{
      return res.status(400).json({msg:"Unable to delete passenger"})
    }
    
  } catch (error) {
    return res.status(500).json({msg: "Internal server error!"});
  }
})

//driver can delete all selected passengers after completing the ride
router.delete('/driver/delete-all-selectedPassengers/:vehicleNumber',async(req,res)=>{
  try {
    const {vehicleNumber} = req.params;

    const deleteAllSelectedPassengers = await SelectedPassenger.deleteMany({vehicleNumber});
    const deleteRequestedPassengers = await Passenger.deleteOne({vehicleNumber});
    if(deleteAllSelectedPassengers.deletedCount > 0 && deleteRequestedPassengers){
      return res.status(201).json({msg:"All selected passengers deleted successfully. Route completed!"})
    }else{
      return res.status(404).json({msg: "No selected passengers found for the specified vehicle number."})
    }
    
  } catch (error) {
    return res.status(500).json({msg: "Internal server error!"})
    
  }
})


//driver can get the shuttleCapacity of the vehicle
router.get('/driver/get-shuttleCapacity/:vehicleNumber', async(req,res)=>{
  try {
    
    const {vehicleNumber} = req.params;
    const getShuttleCapacity = await FixShuttle.findOne({vehicleNumber});
    if(getShuttleCapacity){
      return res.status(201).json({
        shuttleCapacity: getShuttleCapacity.shuttleCapacity
      })
    }else{
      return res.status(400).json({msg:"Unable to get the shuttle capacity"})
    }
    
  } catch (error) {
    return res.status(500).json({msg:"Internal server error"})
  }
})

//driver can get the status of the shuttle
router.get('/driver/get-shuttle-status/:vehicleNumber', async(req,res)=>{
  try {
    
    const {vehicleNumber} = req.params;
    const getShuttleStatus = await FixShuttle.findOne({vehicleNumber});
    if(getShuttleStatus){
      return res.status(201).json({
        shuttleStatus: getShuttleStatus.status
      })
    }else{
      return res.status(400).json({msg:"Unable to get the shuttle status"})
    }
    
  } catch (error) {
    return res.status(500).json({msg:"Internal server error"})
  }
})

//driver can update the status of the shuttle
router.patch('/driver/update-shuttle-status/:vehicleNumber', async(req,res)=>{
  try {
    const {vehicleNumber} = req.params;
    const updateShuttleStatus = await FixShuttle.findOneAndUpdate({vehicleNumber}, req.body, {new: true});
    if(updateShuttleStatus){
      return res.status(201).json({msg:"Shuttle status updated successfully"})
    }else{
      return res.status(400).json({msg:"Unable to update the shuttle status"})
    }
    
  } catch (error) {
    return res.status(500).json({msg:"Internal server error"})
  }
})


  export default router;