import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/images/login-signup-bg.jpg";
import WhiteLogo from "../assets/images/ps-w-logo.png";
import Navbar from "../components/Navbar";

export default function SignupPage() {
  const toast = useToast();
  const naviigation = useNavigate();

  // Managing states for driver or passenger signup form
  const [passengerSignupForm, setPassengerSignupForm] = useState(false);

  // States for storing the signup data for driver
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [fromLoc, setFromLoc] = useState("");
  const [midPointLoc, setMidPointLoc] = useState("");
  const [toLoc, setToLoc] = useState("");

  const [route, setRoute] = useState("");

  // Functions to toggle to driver or passenger signup form
  const handlePassengerSignupForm = () => {
    setPassengerSignupForm(true);
  };
  const handleDriverSignupForm = () => {
    setPassengerSignupForm(false);
  };

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

    if (
      !email ||
      !password ||
      !phone ||
      !vehicleNumber ||
      !fromLoc ||
      !midPointLoc ||
      !toLoc
    ) {
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
        "/proxy/driver/insert",
        {
          email,
          password,
          phone,
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

      naviigation("/login");

      localStorage.setItem("DriverInfo", JSON.stringify(data));

      toast({
        title: "Account Created Successfully",
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

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (!email || !password || !phone) {
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
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/proxy/user/insert",
        { email, password, phone },
        config
      );
      if (data) {
        toast({
          title: "Account Created Successfully",
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      naviigation("/login");
    } catch (err) {
      console.error("Error details:", err);
      const errorMessage = err.response?.data?.message || "An error occurred";
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
      className={`relative ${
        passengerSignupForm ? "h-screen" : ""
      } flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('assets/images/login-signup-bg.jpg')]`}
    >
      <Navbar />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <form
        className="relative bg-white/70 max-w-md mx-auto w-full py-4 px-6 rounded-md space-y-4 border border-gray-400/40 shadow-md my-10 mt-28"
        onSubmit={passengerSignupForm ? handleSubmitUser : handleSubmit}
      >
        <img
          src={WhiteLogo}
          alt="logo"
          className="absolute top-0 left-[50%]  -translate-y-1/2 -translate-x-1/2 h-44 w-auto "
        />
        <h1 className="text-3xl font-normal text-center pt-4">Signup</h1>

        <div className="flex justify-center items-center">
          <div className="bg-gray-400/60 border border-gray-400/20 flex justify-center items-center space-x-2 py-2 px-4 rounded-lg w-fit">
            <span
              onClick={handleDriverSignupForm}
              className={`${
                passengerSignupForm ? "bg-transparent" : "bg-blue-500"
              } p-2 rounded-lg text-white font-normal min-w-24 text-center cursor-pointer hover:bg-blue-500 transition-all delay-100 ease-in-out`}
            >
              Driver
            </span>
            <span
              onClick={handlePassengerSignupForm}
              className={`${
                passengerSignupForm ? "bg-blue-500" : "bg-transparent"
              } p-2 rounded-lg text-white font-normal min-w-24 text-center cursor-pointer hover:bg-blue-500 transition-all delay-100 ease-in-out`}
            >
              Passenger
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="font-normal">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="font-normal">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="font-normal">
            Phone Number:
          </label>
          <input
            type="number"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
          />
        </div>

        {!passengerSignupForm ? (
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
        ) : null}

        <div className="w-full flex items-center justify-center">
          <input
            type="submit"
            value="Signup"
            className="bg-blue-500 px-2 py-2 rounded-md text-white w-full font-normal cursor-pointer hover:bg-blue-600 bg-cyan"
          />
        </div>

        <div>
          <p className="text-center">
            Already have an account?{" "}
            <span className="font-normal text-blue-600 cursor-pointer hover:underline">
              <Link to="/login"> Login</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
