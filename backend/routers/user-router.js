import express from 'express';
import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import Book from '../model/book.js';
import Driver from '../model/driver.js';
import PriorityQueue from 'js-priority-queue';
import FixShuttle from '../model/fixShuttle.js';
import Passenger from '../model/passengers.js';
import SelectedPassenger from '../model/selectedPassenger.js';
import VehicleLocation from '../model/vehicleLocation.js';

const router = new express.Router();

// API to insert user
router.post('/user/insert', async (req, res)=>{

    const {email, password, phone} = req.body;
    console.log(req.body);

    if(!email || !password || !phone){
        return res.status(400).json({message: "Please fill all of the fields"});
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    try{
    
    //hashing the password
    const hashedPassword = await bcrypt.hash( password, 10);

    const newUser = await User.create({
        role: "user",
        email,
        password: hashedPassword,
        phone
    })
    res.status(201).json(newUser);

    }catch(err){
    res.status(500).json({message: "Internal server error"});
}

})

//API to validate the user and accesing to te home page 
router.post('/user/authenticate', async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
    }

    try{

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

       const isMatch = await bcrypt.compare(password, user.password);

       if(isMatch){
        res.status(201).json({
            role: user.role,
            _id: user._id,
            email: user.email,
            phone: user.phone,
            message: "Login Successful"
        })
       }else{
        res.status(400).json({message: "Invalid Credentials"});
       }

    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
})

//API to display/get the users profile

router.get('/user/profile/:id', async(req,res)=>{

const id = req.params.id;

try{

const user = await User.findById(id);

if(user){
    res.status(200).json({
        _id: user._id,
        email: user.email,
        phone: user.phone
    });
}else{
    res.status(404).json({message: "Unable to find the user"});
}
}catch(err){
res.status(500).json({message: "Internal server error"});
}


})

//API to display te booked user details

router.get('/user/bookings/:id', async(req,res)=>{


const id = req.params.id;

try{

const bookingDetails = await Book.findById(id);
console.log(bookingDetails);

if(bookingDetails){

    res.status(201).json({
        _id: bookingDetails._id,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        vehicleNumber: bookingDetails.vehicleNumber,
        routeName: bookingDetails.routeName
    })
    
}else{
    res.status(404).json({message: "Unable to find the booking details"})
}


}catch(err){
    res.status(500).json({message: "Internal Server Error"})
}

})

// user can get all routes detail

router.get('/display/routes/', async(req,res) =>{

    try{
        const routes = await Driver.find({});
        if(routes.length > 0){
            const routeDetails = routes.map(route => ({
                email: route.email,
                phone: route.phone,
                vehicleNumber: route.vehicleNumber,
                routeName: route.route,
                distance: route.distance,
                isVerified: route.isVerified
            }));
            res.status(200).json(routeDetails);
        }else{
            res.status(404).json({message: "Unable to find the routes"});
        }
    }catch(err){res.status(500).json({message: "Internal server error"})}
})

//user can get the short distance routes using some algorithm
// Haversine function to calculate distance between two coordinates
const haversineDistance = (coord1, coord2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Dijkstra's algorithm to find the shortest path in a graph
const dijkstra = (graph, startNode, endNode) => {
    const distances = {}; 
    const prev = {}; 
    const queue = new PriorityQueue({ comparator: (a, b) => a.distance - b.distance });

    // Initialize distances and queue
    for (const node in graph) {
        distances[node] = node === startNode ? 0 : Infinity;
        queue.queue({ node, distance: distances[node] });
    }

    while (queue.length > 0) {
        const { node: currentNode, distance: currentDistance } = queue.dequeue();

        if (currentNode === endNode) break;

        for (const [neighbor, weight] of Object.entries(graph[currentNode].neighbors)) {
            const newDistance = currentDistance + weight;
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                prev[neighbor] = currentNode;
                queue.queue({ node: neighbor, distance: newDistance });
            }
        }
    }

    // Reconstruct path and include vehicle details from the graph
    let path = [];
    let at = endNode;
    if (distances[endNode] === Infinity) {
        return { distance: null, path: [] };
    }

    while (at !== undefined) {
        path.push({
            location: at,
            vehicleDetails: graph[at].details, // Include vehicle details for each node
        });
        at = prev[at];
    }
    path.reverse();

    return { distance: distances[endNode], path };
};

router.post("/display/routes/shortest-path", async (req, res) => {
    try {
        const routes = await Driver.find({});

        if (routes.length > 0) {
            const graph = {};

            routes.forEach(route => {
                const fromLoc = route.fromLoc.name;
                const midPointLoc = route.midPointLoc.name;
                const toLoc = route.toLoc.name;

                // Use stored distance if available, otherwise calculate with Haversine formula
                const fromToMidDistance = route.distance || haversineDistance(route.fromLoc.coordinates, route.midPointLoc.coordinates);
                const midToToDistance = route.distance || haversineDistance(route.midPointLoc.coordinates, route.toLoc.coordinates);

                // Vehicle details for each route
                const vehicleDetails = {
                    vehicleNumber: route.vehicleNumber,
                    phone: route.phone,
                    email: route.email,
                };

                // Initialize nodes and neighbors if they don't already exist
                if (!graph[fromLoc]) graph[fromLoc] = { neighbors: {}, details: vehicleDetails };
                if (!graph[midPointLoc]) graph[midPointLoc] = { neighbors: {}, details: vehicleDetails };
                if (!graph[toLoc]) graph[toLoc] = { neighbors: {}, details: vehicleDetails };

                // Add edges in both directions, taking the minimum distance if multiple paths exist
                graph[fromLoc].neighbors[midPointLoc] = Math.min(graph[fromLoc].neighbors[midPointLoc] || Infinity, fromToMidDistance);
                graph[midPointLoc].neighbors[fromLoc] = Math.min(graph[midPointLoc].neighbors[fromLoc] || Infinity, fromToMidDistance);

                graph[midPointLoc].neighbors[toLoc] = Math.min(graph[midPointLoc].neighbors[toLoc] || Infinity, midToToDistance);
                graph[toLoc].neighbors[midPointLoc] = Math.min(graph[toLoc].neighbors[midPointLoc] || Infinity, midToToDistance);
            });

            const start = req.body.startLocation;
            const end = req.body.endLocation;

            if (graph[start] && graph[end]) {
                const shortestPathResult = dijkstra(graph, start, end);

                res.status(200).json(shortestPathResult);
            } else {
                res.status(404).json({ message: "Start or End location not found in routes." });
            }
        } else {
            res.status(404).json({ message: "No routes found" });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Example data representing the passengers and shuttle capacity
// Knapsack Algorithm to maximize the shuttle’s load
function knapsack(capacity, passengers) {
    const n = passengers.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
    // Dynamic programming to find the maximum number of passengers within capacity
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        const passenger = passengers[i - 1];
        const passengerWeight = passenger.seatRequirement;
  
        if (passengerWeight <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - passengerWeight] + 1);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
  
    // Retrieve the selected passengers
    let w = capacity;
    const selectedPassengers = [];
    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedPassengers.push(passengers[i - 1]);
        w -= passengers[i - 1].seatRequirement;
      }
    }
  
    return selectedPassengers;
  }
  
  // API to calculate the optimal passengers for the shuttle based on the knapsack algorithm
  router.post("/api/select-passengers", (req, res) => {
    try {
      const { shuttleCapacity, passengers } = req.body; // Dynamic data from frontend
  
      if (!shuttleCapacity || shuttleCapacity <= 0) {
        return res.status(400).json({ error: "Invalid shuttle capacity" });
      }
  
      if (!Array.isArray(passengers) || passengers.length === 0) {
        return res.status(400).json({ error: "Invalid or empty passengers list" });
      }
  
      // Use the knapsack algorithm to get the optimal passengers based on shuttle capacity
      const selectedPassengers = knapsack(shuttleCapacity, passengers);
  
      if (selectedPassengers.length > 0) {
        res.json({
          message: "Passengers selected successfully",
          passengers: selectedPassengers,
        });
      } else {
        res.status(400).json({
          error: "No passengers can fit within the given shuttle capacity",
        });
      }
    } catch (error) {
      console.error("Error calculating selected passengers:", error);
      res.status(500).json({ error: "An error occurred while selecting passengers." });
    }
  });
  

  //user can get the data of fix shuttle 
  router.get('/user/shuttle/display-all', async(req,res)=> {
    try {

        const displayAllShuttle = await FixShuttle.find({});
        if(displayAllShuttle){
           return res.status(201).json(displayAllShuttle);
        }

    }catch(err){
       res.status(500).json({message: "Internal Server Error"})
    }
  })
  
//multiple user/passenger can book the fix shuttle
router.post('/user/fix-shuttle/book', async (req, res) => {
    try {
        const { passenger, vehicleNumber } = req.body;

        // Check if there is an existing booking for the vehicle number
        const existingBooking = await Passenger.findOne({ vehicleNumber });

        if (existingBooking) {
            // Check if the passenger with the same phone number already exists
            const passengerExists = existingBooking.passengers.some(
                (existingPassenger) => existingPassenger.phone === passenger.phone
            );

            if (passengerExists) {
                return res.status(409).json({
                    msg: "Already requested the shuttle",
                    data: existingBooking
                });
            }

            // If passenger does not exist, add them to the passengers array
            const updatedBooking = await Passenger.findOneAndUpdate(
                { vehicleNumber },
                { $push: { passengers: passenger } },
                { new: true }
            );

            return res.status(201).json({
                msg: "Shuttle request sent successfully",
                data: updatedBooking
            });
        } else {
            // If no existing booking for the vehicle number, create a new booking
            const newBooking = new Passenger({
                passengers: [passenger],
                vehicleNumber
            });

            await newBooking.save();

            return res.status(201).json({
                msg: "Shuttle request sent successfully",
                data: newBooking
            });
        }
    } catch (err) {
        console.error("Error booking shuttle:", err);
        return res.status(500).json({ msg: "Internal Server Error!" });
    }
});


//user can see his fixed shuttle booking details with status, pending, accepted or rejected
router.get("/user/display-fix-booking/:phone", async(req,res)=>{
    try {
        const {phone} = req.params;
        const showFixBookingDetails = await SelectedPassenger.findOne({phone});
        if(showFixBookingDetails){
            const singlePassengerBookingDetails = {
                bookingId: showFixBookingDetails.selectedId,
                passengerName: showFixBookingDetails.passengerName,
                urgency: showFixBookingDetails.urgency,
                phone: showFixBookingDetails.phone,
                seatRequirement: showFixBookingDetails.seatRequirement,
                vehicleNumbe: showFixBookingDetails.vehicleNumber,
                status: showFixBookingDetails.status
            }
            return res.status(201).json(singlePassengerBookingDetails);
        }
        else{
            return res.status(404).json(
                {
                    msg: "No booking details found",
                    status: "rejected"
                }
            );
        }
    } catch (error) {
        return res.status(500).json({msg: "Internal server error"});
    }
})

//get all the users data
router.get('/user/display-all',async(req,res)=>{
    try {

        const displayAllUsers = await User.find({});
        if(displayAllUsers.length > 0){
            return res.status(201).json({
                count: displayAllUsers.length,
                data: displayAllUsers
            })
        }else{
            return res.status(404).json({msg:"No users found!"});
        }
        
    } catch (error) {
        return res.status(500).json({msg:"Internal server error"})
    }
})

//get the single user data with his id 
router.get("/user/get-single-user/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const singleUser = await User.findById(id);
        if(singleUser){
            return res.status(201).json(singleUser);
        }else{
            return res.status(400).json({msg: "No user found!"});
        }
        
    } catch (error) {
        return res.status(500).json({msg: "Expected ID, but got invalid ID"});
    }
})

//get the role of user using id
router.get('/user/get-user-role/:id', async(req,res)=>{
    try {
      const {id} = req.params;
      const getUserRole = await User.findById(id);
      if(getUserRole){
        return res.status(201).json({
          role: getUserRole.role
        })
      }else{
        return res.status(400).json({msg:"Unable to get the role"})
      }
    } catch (error) { 
      return res.status(500).json({msg: ["Internal server error!", "Unable to get the role"]})
      
    }
  })

  //user can track the vehicle live location from vehicle Number

  router.get('/user/live-track-vehicle/:vehicleNumber',async(req,res)=>{
    try {
        
        const {vehicleNumber} = req.params;
    
        const vehicleLocation = await VehicleLocation.findOne({vehicleNumber});
        if(vehicleLocation){
            return res.status(201).json({
                vehicleNumber: vehicleLocation.vehicleNumber,
                latitude: vehicleLocation.latitude,
                longitude: vehicleLocation.longitude,
                time: vehicleLocation.timestamp,
                msg: `Vehicle no ${vehicleNumber} found!`
            })
        }else{return res.status(400).json({msg: `Unable to find the vehicle no ${vehicleNumber}`})}
        
        
    } catch (error) {
        return res.status(500).json({msg: "Internal server error"})
    }
  })



  //user can get the route mark from , mid and to location coordinates
  router.get('/user/get-latLng/:vehicleNumber', async(req,res)=>{

    try {

        const {vehicleNumber} = req.params;
        const findCoords = await Driver.findOne({vehicleNumber});
        if(findCoords){
            return res.status(201).json({
                fromLoc: findCoords.fromLoc.coordinates,
                midPointLoc: findCoords.midPointLoc.coordinates,
                toLoc: findCoords.toLoc.coordinates
            })
        }else{
            return res.status(400).json({msg: "Unable to find the coordinate!"});
        }
        
    } catch (error) {
        return res.status(500).json({msg:"Internal server error!"});
    }
  })

  

export default router;