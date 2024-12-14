import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaCog,
  FaBookmark,
  FaStopCircle,
  FaTimes,
  FaClock,
  FaCheck,
  FaRoad,
  FaLocationArrow,
  FaSearch,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdBusAlert,
  MdGpsFixed,
  MdGroup,
  MdLocalTaxi,
  MdLocationOn,
  MdLogout,
  MdPerson,
  MdPublic,
  MdRequestQuote,
  MdSearch,
  MdShortcut,
  MdStop,
} from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import logoBlack from "../assets/images/ps-b-logo.png";
import logoWhite from "../assets/images/ps-w-logo.png";
import { useToast } from "@chakra-ui/react";

function NavbarLeftSide() {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState(null);
  const [isToggleLiveOpen, setIsToggleLiveOpen] = useState(false);
  const [isToggleShuttleReqOpen, setIsToggleShuttleReqOpen] = useState(false);
  const [enableDisable, setEnableDisable] = useState();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [shuttleStatusDriver, setShuttleStatusDriver] = useState();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const toast = useToast();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleLive = () => {
    setIsToggleLiveOpen(!isToggleLiveOpen);
  };

  const toggleShuttleReq = () => {
    setIsToggleShuttleReqOpen(!isToggleShuttleReqOpen);
  };

  //function to update the shuttle status
  const updateShuttleStatus = async (status) => {
    // Accept status as parameter
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.patch(
        `/proxy/driver/update-shuttle-status/${vehicleNumber}`,
        { status }, // Send the status directly
        config
      );
      if (result && result.data) {
        setFeedbackMessage(result.data.msg);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectShuttleReq = (e) => {
    const value = e.target.value;
    const newStatus = value === "enable"; // true for "enable", false for "disable"

    setUpdatingStatus(newStatus); // Update the status in state

    // Immediately call the updateShuttleStatus function with the new status
    updateShuttleStatus(newStatus);
  };

  const { id } = useParams();

  //function to render the navigation according to the user role

  //function to get driver role
  const getDriverRole = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(
        `/proxy/driver/get-driver-role/${id}`,
        config
      );
      if (result && result.data) {
        setRole(result.data.role);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to get user role
  const getUserRole = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(`/proxy/user/get-user-role/${id}`, config);
      if (result && result.data) {
        setRole(result.data.role);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to get admin role
  const getAdminRole = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(`/proxy/admin/role/${id}`, config);
      if (result && result.data) {
        setRole(result.data.adminRole);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to get vehicle number
  const getVehicleNumber = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(`/proxy/driver/${id}`, config);
      if (result && result.data) {
        setVehicleNumber(result.data.vehicleNumber);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Post Live Location
  const postLiveLocation = async (action) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };

      if (action === "enable") {
        // Enable tracking
        const updateLocation = async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await axios.post(
              "/proxy/live-tracking/updateLocation",
              {
                vehicleNumber: vehicleNumber,
                latitude,
                longitude,
              },
              config
            );
            console.log("Location updated:", { latitude, longitude });
          } catch (error) {
            console.error(
              "Error in posting live location:",
              error.response?.data || error.message
            );
          }
        };

        // Watch the user's position and update every second
        const watchId = navigator.geolocation.watchPosition(
          updateLocation,
          (error) => {
            console.error("Error fetching location:", error.message);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );

        // Store the watchId so it can be cleared later
        window.liveTrackingWatchId = watchId;
        setFeedbackMessage("Live tracking enabled successfully.");
      } else if (action === "disable") {
        // Disable tracking
        if (window.liveTrackingWatchId) {
          navigator.geolocation.clearWatch(window.liveTrackingWatchId);
          delete window.liveTrackingWatchId;
        }
        setFeedbackMessage("Live tracking disabled successfully.");
      }
    } catch (error) {
      console.error(
        "Error in posting live location:",
        error.response?.data || error.message
      );
      setFeedbackMessage("Error updating live tracking. Please try again.");
    }
  };

  // Handle Select Change
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setEnableDisable(value);
    if (value === "enable" || value === "disable") {
      postLiveLocation(value);
    }
  };

  //function to get shuttle req status
  const getShuttleReqStatus = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(
        `/proxy/driver/get-shuttle-status/${vehicleNumber}`,
        config
      );
      if (result && result.data) {
        setShuttleStatusDriver(result.data.shuttleStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getUserRole();
      getDriverRole();
      getAdminRole();
      getVehicleNumber();
    }
  }, [id]);

  useEffect(() => {
    if (vehicleNumber) {
      getShuttleReqStatus();
    }
  }, [vehicleNumber]);

  return (
    <div className="flex  w-64">
      {/* Sidebar */}
      <div
        className={`scrollbar-hide fixed top-0 left-0 w-64 h-full bg-white overflow-y-scroll text-black transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        }`}
        style={{ boxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex  p-4  flex-col">
          <div className="flex gap-2 items-center">
            {<img src={logoWhite} alt="logo" className="w-16 " />}
            <h2 className="text-lg font-semibold bg-gradient-to-r from-cyan-700 to-fuchsia-400 bg-clip-text text-transparent">
              {role === "user" ? (
                <span>User</span>
              ) : role === "driver" ? (
                <span>Driver</span>
              ) : role === "admin" ? (
                <span>Admin</span>
              ) : (
                <span></span>
              )}{" "}
              Dashboard
            </h2>
          </div>
          <hr className="border border-gray-200 w-full mt-0" />
          {/* <button onClick={toggleNavbar} className="text-2xl bg-black">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button> */}
        </div>
        <nav className="mt-0  ">
          <ul>
            {role === "driver" ? (
              <>
                {/* Commented out for now */}
                {/* <li>
        <Link
          to={`/${id}`}
          className="flex items-center p-4 hover:bg-gray-200"
        >
          <FaHome className="mr-3" />
          Home
        </Link>
      </li> */}
                <li>
                  <Link
                    to={`/dashboard/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaHome className="mr-3 text-purple-600" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaUser className="mr-3 text-blue-500" />
                    Profile
                  </Link>
                </li>
                <li>
                  <div
                    className="flex flex-col justify-center p-4 hover:bg-gray-200 cursor-pointer"
                    onClick={toggleLive}
                  >
                    <div className="flex items-center">
                      <MdLocationOn className="mr-3 text-red-500" />
                      Live Tracking{" "}
                      {isToggleLiveOpen ? (
                        <MdArrowDropUp className="ml-10 text-2xl" />
                      ) : (
                        <MdArrowDropDown className="ml-10 text-2xl" />
                      )}
                    </div>
                  </div>
                  {isToggleLiveOpen && (
                    <div className="px-8 py-2">
                      <select
                        className="w-full text-black px-2 py-1 rounded-md"
                        onChange={handleSelectChange}
                        value={enableDisable}
                      >
                        <option value="">Select an option</option>
                        <option
                          value="enable"
                          onClick={() =>
                            toast({
                              status: "success",
                              title: feedbackMessage,
                              isClosable: true,
                              position: "top-right",
                              duration: 3000,
                            })
                          }
                        >
                          Enable
                        </option>
                        <option
                          value="disable"
                          onClick={() =>
                            toast({
                              status: "success",
                              title: feedbackMessage,
                              isClosable: true,
                              position: "top-right",
                              duration: 3000,
                            })
                          }
                        >
                          Disable
                        </option>
                      </select>
                    </div>
                  )}
                </li>
                <li>
                  <Link
                    to={`/display-driver-notifications/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdPublic className="text-green-500" />{" "}
                    <MdGroup className="mr-3 text-blue-500" />
                    Public Route Req
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={toggleShuttleReq}
                    to={`/display/fix-route/passengers/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdBusAlert className="text-amber-600" />{" "}
                    <FaClock className="mr-3 text-gray-500 text-sm" />
                    Fix Shuttle Req
                    {isToggleShuttleReqOpen ? (
                      <MdArrowDropUp className="ml-10 text-2xl" />
                    ) : (
                      <MdArrowDropDown className="ml-10 text-2xl" />
                    )}
                  </Link>
                  {isToggleShuttleReqOpen && (
                    <div className="px-8 py-2">
                      <select
                        className={`w-full px-2 py-1 rounded-md ${
                          shuttleStatusDriver === true
                            ? "text-green-700"
                            : "text-red-500"
                        }`}
                        onClick={handleSelectShuttleReq}
                        value={
                          shuttleStatusDriver === true ? "enable" : "disable"
                        }
                      >
                        <option
                          value="enable"
                          onClick={() =>
                            toast({
                              status: "success",
                              title: "Request Enabled",
                              isClosable: true,
                              position: "top-right",
                              duration: 3000,
                            })
                          }
                        >
                          Request Enable
                        </option>
                        <option
                          value="disable"
                          onClick={() =>
                            toast({
                              status: "success",
                              title: "Request Disabled",
                              isClosable: true,
                              position: "top-right",
                              duration: 3000,
                            })
                          }
                        >
                          Request Disable
                        </option>
                      </select>
                    </div>
                  )}
                </li>
                <li>
                  <Link
                    to={`/display/selected/passengers/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdGroup className="text-blue-500" />{" "}
                    <FaCheck className="mr-3 text-sm text-green-500" />
                    Selected Passengers
                  </Link>
                </li>
              </>
            ) : role === "user" ? (
              <>
                {/* Commented out for now */}
                {/* <li>
        <Link
          to={`/${id}`}
          className="flex items-center p-4 hover:bg-gray-200"
        >
          <FaHome className="mr-3" />
          Home
        </Link>
      </li> */}
                <li>
                  <Link
                    to={`/dashboard/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200 "
                  >
                    <FaHome className="mr-3 text-purple-600" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaUser className="mr-3 text-blue-500" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/display-all-route/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdLocalTaxi className="text-amber-500" />{" "}
                    <MdGroup className="mr-3 text-blue-500" />
                    Public Routes
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/diplay/short-route/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaRoad className="text-cyan-500" />{" "}
                    <MdSearch className="mr-3 text-red-500" />
                    Shortest Route
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/display/fix-route/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdGpsFixed className="text-red-500" />{" "}
                    <FaRoad className="mr-3 text-cyan-500" />
                    Fix Route
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/route/booking-details/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdLocalTaxi className="text-amber-500" />{" "}
                    <FaBookmark className="mr-3 text-green-500" />
                    Public Route Booking
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/fix-shuttle/booking/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdGpsFixed className="text-red-500" />{" "}
                    <FaBookmark className="mr-3 text-green-500" />
                    Fix Shuttle Booking
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/user/live-tracking/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <MdLocationOn className="mr-3 text-xl text-red-500" />
                    Live Tracking
                  </Link>
                </li>
              </>
            ) : role === "admin" ? (
              <>
                <li>
                  <Link
                    to={`/dashboard/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaHome className="mr-3" />
                    Dashboard
                  </Link>

                  <Link
                    to={`/admin/create/fix-route/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaBookmark className="mr-3" />
                    Create Fix Shuttle
                  </Link>
                  <Link
                    to={`/admin/display-all-fix-route/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaBookmark className="mr-3" />
                    Display Fix Shuttles
                  </Link>
                  <Link
                    to={`/admin/display-all-drivers/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaBookmark className="mr-3" />
                    Display All Drivers
                  </Link>

                  <Link
                    to={`/admin/display-all-users/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaBookmark className="mr-3" />
                    Display All Users
                  </Link>
                  <Link
                    to={`/admin/public-vehicle-req/${id}`}
                    className="flex items-center p-4 hover:bg-gray-200"
                  >
                    <FaBookmark className="mr-3" />
                    Public Vehicle Req
                  </Link>
                </li>
              </>
            ) : null}

            <li>
              <a href="#" className="flex items-center p-4 hover:bg-gray-200">
                <FaCog className="mr-3" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <div className=" bottom-0 left-0 w-full p-4 ">
          <Link
            to="/"
            href="#"
            className="flex bg-gray-300  w-full items-center px-4 py-2 hover:opacity-90 rounded-md"
            onClick={(e) => {
              const confirmHandel = window.confirm(
                "Do you really want to Logout?"
              );

              if (!confirmHandel) {
                e.preventDefault();
              }
            }}
          >
            <MdLogout className="mr-3 text-red-500" />
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* <h1 className="text-3xl font-bold">Welcome to My App</h1> */}
        {/* Your min content goes here */}
      </div>
    </div>
  );
}

export default NavbarLeftSide;
