import React, { useState } from "react";
import axios from "axios";

const ShuttlePassengerManager = () => {
  // State to hold passenger data, shuttle capacity, and selected passengers
  const [passengers, setPassengers] = useState([]);
  const [shuttleCapacity, setShuttleCapacity] = useState("");
  const [selectedPassengers, setSelectedPassengers] = useState([]);

  // Handle passenger form submission
  const handleAddPassenger = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const urgency = parseInt(e.target.urgency.value);
    const seatRequirement = parseInt(e.target.seatRequirement.value);

    // Add new passenger to state
    setPassengers([...passengers, { name, urgency, seatRequirement }]);

    // Clear form inputs
    e.target.name.value = "";
    e.target.urgency.value = "";
    e.target.seatRequirement.value = "";
  };

  // Handle shuttle capacity input change
  const handleShuttleCapacityChange = (e) => {
    setShuttleCapacity(e.target.value);
  };

  // Function to calculate optimal passengers using backend API
  const calculateOptimalPassengers = async () => {
    if (shuttleCapacity <= 0 || passengers.length === 0) {
      alert("Please enter valid shuttle capacity and passengers.");
      return;
    }

    try {
      // Send the data to the backend API
      const response = await axios.post("/proxy/api/select-passengers", {
        shuttleCapacity,
        passengers,
      });

      // Update selected passengers in state
      setSelectedPassengers(response.data.passengers);
    } catch (error) {
      console.error("Error calculating selected passengers:", error);
      alert("An error occurred while calculating the optimal passengers.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Shuttle Passenger Management
      </h1>

      {/* Passenger Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Passenger</h2>
        <form onSubmit={handleAddPassenger}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="mt-2 p-2 border rounded-lg w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Urgency (1-10)</label>
            <input
              type="number"
              name="urgency"
              min="1"
              max="10"
              className="mt-2 p-2 border rounded-lg w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Seat Requirement</label>
            <input
              type="number"
              name="seatRequirement"
              min="1"
              className="mt-2 p-2 border rounded-lg w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg mt-4 hover:bg-blue-700"
          >
            Add Passenger
          </button>
        </form>
      </div>

      {/* Shuttle Capacity */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Shuttle Capacity</h2>
        <label className="block text-gray-700">Enter Shuttle Capacity</label>
        <input
          type="number"
          value={shuttleCapacity}
          onChange={handleShuttleCapacityChange}
          min="1"
          className="mt-2 p-2 border rounded-lg w-full"
          required
        />
        <button
          onClick={calculateOptimalPassengers}
          className="w-full bg-green-600 text-white p-2 rounded-lg mt-4 hover:bg-green-700"
        >
          Calculate Optimal Passengers
        </button>
      </div>

      {/* List of Passengers */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">All Passengers</h2>
        <ul className="list-disc pl-5">
          {passengers.map((passenger, index) => (
            <li key={index}>
              {passenger.name} (Urgency: {passenger.urgency}, Seats:{" "}
              {passenger.seatRequirement})
            </li>
          ))}
        </ul>
      </div>

      {/* List of Selected Passengers */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Selected Passengers for the Shuttle
        </h2>
        {selectedPassengers.length > 0 ? (
          <ul className="list-disc pl-5">
            {selectedPassengers.map((passenger, index) => (
              <li key={index}>
                {passenger.name} (Urgency: {passenger.urgency}, Seats:{" "}
                {passenger.seatRequirement})
              </li>
            ))}
          </ul>
        ) : (
          <p>No passengers selected. Please check the shuttle capacity.</p>
        )}
      </div>
    </div>
  );
};

export default ShuttlePassengerManager;
