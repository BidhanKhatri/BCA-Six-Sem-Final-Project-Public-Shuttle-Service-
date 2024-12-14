import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NavbarLeftSide from "../components/NavbarLeftSide";
import LoadingSpinner from "../assets/news-loading.gif";
import ModelPopup from "../components/ModelPopup";
import { useParams } from "react-router-dom";
import axios from "axios";

const SearchRoutePage = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [routes, setRoutes] = useState([]);
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { id } = useParams();
  console.log(routes);
  console.log(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fromLocation || !toLocation) {
      setError("Please fill in both locations.");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await fetch("/proxy/driver/find-routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromLocation, toLocation }),
      });

      const data = await response.json();
      setRoutes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setError("Failed to fetch routes. Please try again.");
    }
  };

  function toggleModal(route = null) {
    setIsOpen(!isOpen);
    setSelectedRoute(route);
  }

  //Getting the user profile data and send the phone number as a props to the model popup
  const fetchUserProfile = async () => {
    try {
      const result = await axios.get(`/proxy/user/profile/${id}`);
      setPhone(result.data.phone);
      setEmail(result.data.email);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white h-screen flex justify-center items-center text-3xl">
        <img src={LoadingSpinner} alt="Loading..." className="w-72" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavbarLeftSide /> {/* Sidebar */}
      <div className="flex-1 flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-xl mt-10">
          <h1 className="text-2xl font-semibold text-white text-center mb-6 bg-blue-500 rounded-lg p-2">
            Search for all Route
          </h1>

          <form
            className="bg-white shadow-lg rounded-lg p-6 space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="fromLocation"
                className="block text-sm font-medium text-gray-700"
              >
                From Location
              </label>
              <input
                type="text"
                id="fromLocation"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                // value={fromLocation}
                onChange={(e) =>
                  setFromLocation(e.target.value + ", Kathmandu, Nepal")
                }
                placeholder="Enter starting point"
              />
            </div>

            <div>
              <label
                htmlFor="toLocation"
                className="block text-sm font-medium text-gray-700"
              >
                To Location
              </label>
              <input
                type="text"
                id="toLocation"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                // value={toLocation}
                onChange={(e) =>
                  setToLocation(e.target.value + ", Kathmandu, Nepal")
                }
                placeholder="Enter destination"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
            >
              Search Routes
            </button>
          </form>

          {/* Display available routes */}
          {routes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Available Routes
              </h2>
              <div className="space-y-4">
                {routes.map((route, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-md p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        {" "}
                        <p className="text-gray-700">
                          <span className="font-semibold">Route:</span>{" "}
                          {route.routeName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Vechile No:</span>{" "}
                          {route.vehicleNum}
                        </p>
                        {/* <p className="text-gray-700">
                      <span className="font-semibold">Driver Email:</span>{" "}
                      {route.driverEmail}
                    </p> */}
                        <p className="text-gray-700">
                          <span className="font-semibold">Distance:</span>{" "}
                          {route.distance} km
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleModal(route)}
                          className="bg-blue-500 text-white px-4 py-1 rounded-md"
                        >
                          Book Now
                        </button>
                        {isOpen && (
                          <ModelPopup
                            toggleModal={toggleModal}
                            vehicleNum={selectedRoute.vehicleNum}
                            routeName={selectedRoute.routeName}
                            phone={phone}
                            email={email}
                          />
                        )}

                        <button className="bg-green-500 text-white px-4 py-1 rounded-md">
                          Live Track
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchRoutePage;
