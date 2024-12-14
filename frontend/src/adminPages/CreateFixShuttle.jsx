import React, { useState } from "react";
import NavbarLeftSide from "../components/NavbarLeftSide";

import { FaBusAlt, FaRoute, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdLocationOn, MdAirlineSeatReclineNormal } from "react-icons/md";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const CreateFixShuttle = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [shuttleCapacity, setShuttleCapacity] = useState(0);
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [routeName, setRouteName] = useState("");
  const toast = useToast();

  //function to inser fix shuttle data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const data = {
        vehicleNumber,
        shuttleCapacity: Number(shuttleCapacity), // Ensure numeric
        fromLoc,
        toLoc,
        routeName,
        arrivalTime,
        departureTime,
      };

      const result = await axios.post(
        "/proxy/admin/shuttle/insert",
        data,
        config
      );
      if (result && result.data) {
        toast({
          title: "Shuttle Inserted Successfully",
          position: "top-right",
          isClosable: true,
          duration: 3000,
          status: "success",
        });
      } else {
        toast({
          title: result.data.message || "Driver not Registered!",
          position: "top-right",
          isClosable: true,
          duration: 3000,
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast({
        title: error.response?.data?.message || "Failed to insert shuttle",
        // description: error.response?.data?.msg || "Something went wrong",
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    }
  };

  return (
    <div className="flex">
      <NavbarLeftSide />
      <div className="flex-1 bg-gray-400/20 p-6 min-h-screen">
        <div>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white p-8 rounded-md shadow-md space-y-6"
          >
            <p className="text-center font-semibold text-xl ">
              Insert Fix Shuttle
            </p>
            <div>
              <label
                htmlFor="vehicleNumber"
                className="flex items-center gap-3"
              >
                <FaBusAlt className="text-blue-500" />{" "}
                <span>Vehicle Number:</span>
              </label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                className="w-full outline-none border focus:border-blue-500 p-2 rounded-md mt-2"
                placeholder="enter vehicle number"
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="shuttleCapacity"
                className="flex items-center gap-2"
              >
                <MdAirlineSeatReclineNormal className="text-green-500 text-xl" />{" "}
                <span>Shuttle Capacity</span>{" "}
              </label>
              <input
                type="number"
                id="shuttleCapacity"
                name="shuttleCapacity"
                className="w-full outline-none border focus:border-blue-500 px-2 p-2 rounded-md mt-2"
                placeholder="enter shuttlle capacity"
                onChange={(e) => setShuttleCapacity(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="fromLoc" className="flex items-center gap-2">
                {" "}
                <MdLocationOn className="text-red-500 text-xl" />
                From Location
              </label>
              <input
                type="text"
                id="fromLoc"
                name="fromLoc"
                className="w-full outline-none border focus:border-blue-500 px-2 p-2 rounded-md mt-2"
                placeholder="enter from location "
                onChange={(e) =>
                  setFromLoc(e.target.value + ",Kathmandu,Nepal")
                }
              />
            </div>
            <div>
              <label
                htmlFor="vehicleNumber"
                className="flex items-center gap-2"
              >
                <FaMapMarkerAlt className="text-purple-500" />
                To Location
              </label>
              <input
                type="text"
                id="toLoc"
                name="toLoc"
                className="w-full outline-none border focus:border-blue-500 px-2 p-2 rounded-md mt-2"
                placeholder="enter to location "
                onChange={(e) => setToLoc(e.target.value + ",Kathmandu,Nepal")}
              />
            </div>
            <div>
              <label htmlFor="routeName" className="flex items-center gap-2">
                {" "}
                <FaRoute className="text-yellow-500" />
                Route Name
              </label>
              <input
                type="text"
                id="routeName"
                name="routeName"
                className="w-full outline-none border focus:border-blue-500 px-2 p-2 rounded-md mt-2"
                placeholder="enter to route name"
                onChange={(e) => setRouteName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="departureTime"
                className="flex items-center gap-2"
              >
                {" "}
                <FaClock className="text-orange-500" />
                Departure Time
              </label>
              <input
                type="text"
                id="departureTime"
                name="departureTime"
                className="w-full outline-none border focus:border-blue-500 px-2 p-2 rounded-md mt-2"
                placeholder="enter departure time"
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="arrivalTime" className="flex items-center gap-2">
                <FaClock className="text-gray-500" />
                Arrival Time
              </label>
              <input
                type="text"
                id="arrivalTime"
                name="arrivalTime"
                className="w-full outline-none border focus:border-blue-500 px-2 p-2 rounded-md mt-2"
                placeholder="enter arrival time"
                onChange={(e) => setArrivalTime(e.target.value)}
              />
            </div>
            <div>
              <button className="bg-blue-500 transition-all duration-300 hover:bg-blue-600 text-white w-full p-2 rounded-md">
                Insert Shuttle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFixShuttle;
