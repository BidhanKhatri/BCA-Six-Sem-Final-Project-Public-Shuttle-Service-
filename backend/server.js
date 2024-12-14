import express from 'express';
import http from 'http';  // Import http to create server
import { Server } from 'socket.io';  // Import Server from socket.io
import axios from 'axios';
import cors from 'cors';

// Connecting to the database
import './db/conn.js';

// Importing routers for routing different APIs
import driverRouter from './routers/driver-router.js';
import bookRouter from './routers/book-router.js';
import userRouter from './routers/user-router.js';
import adminRouter from './routers/admin-router.js';
import liveTracking from './routers/live-tracking.js';

const app = express();
const server = http.createServer(app);  // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins for CORS; adjust for production
    methods: ["GET", "POST"]
  }
});

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Attach routers for different routes
app.use(driverRouter);
app.use(bookRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(liveTracking);

// Listen for Socket.io connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for location updates from clients
  socket.on("locationUpdate", (location) => {
    console.log("Location update from user:", location);

    // Include the socket ID in the location update
    const locationWithSocketId = {
      ...location,
      socketId: socket.id // Add socket ID to location data
    };

    // Broadcast this location to all other connected clients
    socket.broadcast.emit("locationUpdate", locationWithSocketId);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Notify other clients that this user has disconnected
    socket.broadcast.emit("userDisconnected", socket.id);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
