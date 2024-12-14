import axios from "axios";
import React, { useEffect, useState } from "react";
import ModelPopup from "../components/ModelPopup";
import { useParams } from "react-router-dom";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { FaRoad, FaTaxi } from "react-icons/fa";
import { MdGroup, MdSearch } from "react-icons/md";

const ShortRoute = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [shortRouteData, setShortRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const { id } = useParams();

  function toggleModal(route = null) {
    setIsOpen(!isOpen);
    setSelectedRoute(route);
  }

  // Function to fetch the shortest route
  const fetchShortRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.post(
        "/proxy/display/routes/shortest-path",
        { startLocation, endLocation },
        config
      );
      if (result && result.data) {
        setShortRouteData(result.data);
      }
    } catch (err) {
      setError("There was an error fetching the route.");
      console.error("Error fetching route:", err);
    } finally {
      setLoading(false);
    }
  };

  //fetching the user email and phone number
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
    return () => {};
  }, []);

  return (
    <>
      <div className="flex">
        <NavbarLeftSide />
        <div className="flex-1">
          <div className="min-h-screen py-8 px-4 bg-gray-200/40">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              <span className="flex items-center space-x-2 mb-6">
            <span className="flex">
                <FaRoad size={32} className="text-green-500"/> <MdSearch size={32} className="text-red-500"/>
              </span>
              
              <h2 className="text-3xl font-semibold text-blue-600 mb-0 bg-gradient-to-r from-cyan-700 to-fuchsia-400 bg-clip-text text-transparent w-fit">
                Search Short Route
              </h2>
              </span>
              <form onSubmit={fetchShortRoute} className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="start-location"
                    className="block text-lg text-gray-700 font-medium"
                  >
                    Start Location
                  </label>
                  <input
                    type="text"
                    id="start-location"
                    onChange={(e) =>
                      setStartLocation(
                        e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1) +
                          ",Kathmandu,Nepal"
                      )
                    }
                    className="w-full border-2 border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter start location"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-location"
                    className="block text-lg text-gray-700 font-medium"
                  >
                    End Location
                  </label>
                  <input
                    type="text"
                    id="end-location"
                    onChange={(e) =>
                      setEndLocation(
                        e.target.value.charAt(0).toUpperCase() +
                          e.target.value.slice(1) +
                          ",Kathmandu,Nepal"
                      )
                    }
                    className="w-full border-2 border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter end location"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-blue-600 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                    onClick={() => {
                      setStartLocation("");
                      setEndLocation("");
                      setShortRouteData(null);
                      setError(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>

              {/* Display Error */}
              {error && (
                <div className="text-red-500 text-center mt-4">{error}</div>
              )}

              {/* Display Shortest Path */}
              {shortRouteData && shortRouteData.path ? (
                <div className="mt-6">
                  <h3 className="text-2xl text-gray-800 font-semibold">
                    Shortest Path:
                  </h3>
                  <p className="text-xl text-gray-600 mt-2">
                    Distance: {shortRouteData.distance.toFixed(2)} km
                  </p>
                  <div className="mt-4 space-y-4">
                    {shortRouteData.path
                      .filter((locationDetail, index) => index === 1) // Filter to show only Tripureshwor
                      .map((locationDetail, index) => (
                        <div
                          key={index}
                          className="p-4 border-2 border-gray-300 rounded-lg shadow-sm flex justify-between"
                        >
                          <div>
                            <p className="text-lg font-semibold text-gray-700">
                              Location: {locationDetail.location}
                            </p>
                            {locationDetail.vehicleDetails && (
                              <div className="mt-2 text-sm text-gray-600">
                                <p>
                                  Vehicle Number:{" "}
                                  {locationDetail.vehicleDetails.vehicleNumber}
                                </p>
                                <p>
                                  Phone: {locationDetail.vehicleDetails.phone}
                                </p>
                                <p>
                                  Email: {locationDetail.vehicleDetails.email}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-center">
                            {" "}
                            <button
                              onClick={() => toggleModal(locationDetail)}
                              className="text-white bg-blue-500 px-4 py-2 rounded-md text-lg font-semibold hover:bg-blue-600 transition-all duration-300"
                            >
                              Book
                            </button>
                            {isOpen && (
                              <ModelPopup
                                toggleModal={toggleModal}
                                vehicleNum={
                                  locationDetail.vehicleDetails.vehicleNumber
                                }
                                routeName={locationDetail.location}
                                phone={phone}
                                email={email}
                                user_id={id}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                !loading && (
                  <p className="text-center text-gray-500 mt-6">
                    Enter locations and click "Search" to find the shortest
                    route.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortRoute;
