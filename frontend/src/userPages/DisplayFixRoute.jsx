import React, { useEffect, useState } from "react";
import axios from "axios";
import FixRouteModal from "../components/FixRouteModal";
import { useNavigate, useParams } from "react-router-dom";
import NavbarLeftSide from "../components/NavbarLeftSide";
import {
  FaBus,
  FaClock,
  FaMapSigns,
  FaRoad,
  FaUserCheck,
} from "react-icons/fa";

const DisplayFixRoute = () => {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [seatRequirement, setSeatRequirement] = useState(1);
  const [urgency, setUrgency] = useState(1);
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes());
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [liveTrackVechNumber, setLiveTrackVechNumber] = useState(null);
  const navigate = useNavigate();

  const toggleModal = (route = null) => {
    setIsOpen(!isOpen);
    setSelectedRoute(route);
  };

  const handleSeatRequirementChange = (e) => {
    setSeatRequirement(e.target.value);
  };

  const handleUrgencyChange = (e) => {
    setUrgency(e.target.value);
  };

  const fetchFixShuttle = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get("/proxy/user/shuttle/display-all", config);
      if (Array.isArray(result.data)) {
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const result = await axios.get(`/proxy/user/profile/${id}`);
      setPhone(result.data.phone);
      setEmail(result.data.email);
    } catch (err) {
      console.log(err);
    }
  };

  //function to create a watch
  const createWatch = () => {
    const interval = setInterval(() => {
      const date = new Date();
      setHours(date.getHours());
      setMinutes(date.getMinutes());
      setSeconds(date.getSeconds());
    }, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    fetchFixShuttle();
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    createWatch();
  }, []);

  return (
    <>
      <div className="flex bg-gray-100 min-h-screen">
        <NavbarLeftSide />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className=" mb-6 text-gray-800 flex justify-between">
              <span className="text-3xl font-semibold">
                <FaBus className="inline-block mr-2 text-blue-500 " />
                <span
                  className="
                bg-gradient-to-r from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text"
                >
                  Fixed Shuttle Routes
                </span>
              </span>

              <span className="flex space-x-6 items-center">
                <span className="text-xl font-semibold bg-gradient-to-t from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text flex ">
                  {hours > 9 ? hours : `0${hours}`} :{" "}
                  {minutes < 10 ? `0${minutes}` : minutes} :{" "}
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
                <span className="flex  items-center">
                  <div className="bg-red-500 w-4 h-4 text-white rounded-full mr-4"></div>{" "}
                  Not Active
                </span>
                <span className="flex items-center">
                  <div className="bg-green-500 w-4 h-4 text-white rounded-full mr-4"></div>{" "}
                  Active
                </span>
              </span>
            </h1>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg rounded-lg">
                <thead>
                  <tr className="bg-blue-600 text-white text-left text-sm font-medium">
                    <th className="py-4 px-6 flex border border-gray-300">
                      {" "}
                      Route
                    </th>
                    <th className="py-4 px-6 border border-gray-300 ">
                      Veh No
                    </th>
                    <th className="py-4 px-6 border border-gray-300 ">
                      Depart Time
                    </th>
                    <th className="py-4 px-6 border border-gray-300 ">
                      Arrival Time
                    </th>
                    <th className="py-4 px-6 border border-gray-300 ">
                      Shuttle Capacity
                    </th>
                    <th className="py-4 px-6 border border-gray-300 ">
                      Status
                    </th>
                    <th className="py-4 px-6 border border-gray-300 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((route) => (
                    <tr
                      key={route._id}
                      className="border-b even:bg-gray-50 hover:bg-gray-100 transition duration-200"
                    >
                      <td className="py-4 px-6 border-b border-gray-300">
                        {route.routeName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        {route.vehicleNumber}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        {route.departureTime}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        {route.arrivalTime}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        {route.shuttleCapacity || "N/A"}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-300">
                        {route.status === false ? (
                          <div className="bg-red-500 w-4 h-4 text-white rounded-full"></div>
                        ) : (
                          <div className="bg-green-500 w-4 h-4 text-white rounded-full"></div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center flex">
                        <button
                          disabled={route.status === false}
                          onClick={() => toggleModal(route)}
                          className={`${
                            route.status === false
                              ? "bg-gray-400/60"
                              : "bg-blue-500  hover:bg-blue-600 "
                          } text-white font-medium py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out`}
                        >
                          Book
                        </button>
                        <button
                          disabled={route.status === false}
                          onClick={() =>
                            setLiveTrackVechNumber(route.vehicleNumber)
                          }
                          className={`${
                            route.status === false
                              ? "bg-gray-400/60"
                              : "bg-black hover:bg-opacity-90 "
                          } text-white font-medium py-2 px-4 rounded shadow hover:shadow-lg transition ease-in-out ml-2`}
                        >
                          Track
                        </button>
                        {isOpen && (
                          <FixRouteModal
                            toggleModal={toggleModal}
                            vehicleNumber={selectedRoute.vehicleNumber}
                            email={email}
                            phone={phone}
                            seatRequirement={seatRequirement}
                            urgency={urgency}
                            handleSeatRequirementChange={
                              handleSeatRequirementChange
                            }
                            handleUrgencyChange={handleUrgencyChange}
                          />
                        )}
                      </td>
                    </tr>
                  ))}

                  {liveTrackVechNumber &&
                    navigate(`/user/live-tracking/${id}`, {
                      state: { vehicleNumber: liveTrackVechNumber },
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayFixRoute;
