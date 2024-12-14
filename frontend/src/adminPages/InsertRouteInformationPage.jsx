import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/images/login-signup-bg.jpg";

const InsertRouteInformationPage = () => {
  const toast = useToast();
  const naviigation = useNavigate();

  // States for storing the signup data for driver

  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fromLoc, setFromLoc] = useState("");
  const [midPointLoc, setMidPointLoc] = useState("");
  const [toLoc, setToLoc] = useState("");

  const [route, setRoute] = useState("");

  // Handling signup form submission
  // Geocoding API (example using OpenStreetMap Nominatim)
  const geocodeLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
      );

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        console.log("Geocode Response:", data);
        return {
          latitude: parseFloat(data.lat),
          longitude: parseFloat(data.lon),
        };
      } else {
        throw new Error(`No results found for location: ${location}`);
      }
    } catch (error) {
      throw new Error(`Geocoding error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleNumber || !fromLoc || !midPointLoc || !toLoc) {
      toast({
        title: "Please fill all the fields",
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Geocode 'fromLoc' and 'toLoc' before submitting the form
      const fromCoordinates = await geocodeLocation(fromLoc);
      const midPointCoordinates = await geocodeLocation(midPointLoc);
      const toCoordinates = await geocodeLocation(toLoc);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/proxy/admin/insert/route",
        {
          vehicleNumber,
          route,
          fromLoc: {
            name: fromLoc,
            coordinates: fromCoordinates,
          },
          midPointLoc: {
            name: midPointLoc,
            coordinates: midPointCoordinates,
          },
          toLoc: {
            name: toLoc,
            coordinates: toCoordinates,
          },
        },
        config
      );

      toast({
        title: "Route inserted successfully",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: errorMessage,
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div
      className={` h-screen
       flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('assets/images/login-signup-bg.jpg')]`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <form
        className="relative bg-white/70 max-w-md mx-auto w-full py-4 px-6 rounded-md space-y-4 border border-gray-400/40 shadow-md my-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-normal text-center">Insert Route</h1>

        <>
          <div>
            <label htmlFor="vehicle" className="font-normal">
              Vehicle Number:
            </label>
            <input
              type="text"
              id="vehicle"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter your vehicle number"
              className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="from" className="font-normal">
              From Location:
            </label>
            <input
              type="text"
              id="from"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value.trim())}
              placeholder="Enter from location"
              className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="mid" className="font-normal">
              Mid-Point Location:
            </label>
            <input
              type="text"
              id="mid"
              value={midPointLoc}
              onChange={(e) => setMidPointLoc(e.target.value.trim())}
              placeholder="Enter mid location"
              className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="to" className="font-normal">
              To Location:
            </label>
            <input
              type="text"
              id="to"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value.trim())}
              placeholder="Enter to location"
              className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="route" className="font-normal">
              Route (Optional):
            </label>
            <input
              type="text"
              id="route"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="Enter route"
              className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
            />
          </div>
        </>

        <div className="w-full flex items-center justify-center">
          <input
            type="submit"
            value="Signup"
            className="bg-blue-500 px-2 py-2 rounded-md text-white w-full font-normal cursor-pointer hover:bg-blue-600 bg-cyan"
          />
        </div>
      </form>
    </div>
  );
};

export default InsertRouteInformationPage;
