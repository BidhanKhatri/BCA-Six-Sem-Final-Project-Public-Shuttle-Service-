import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { FaExclamation, FaExclamationTriangle } from "react-icons/fa";

const DriverSelectPassengers = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalSelectedPassengers, setTotalSelectedPassengers] = useState(0);
  const [vehicleSeats, setVehicleSeats] = useState(0);
  const [seats, setSeats] = useState(0);
  const { id } = useParams();
  const toast = useToast();
  const [acceptedPassengers, setAcceptedPassengers] = useState(new Set());

  const fetchVehicleNumber = async () => {
    try {
      const result = await axios.get(`/proxy/driver/${id}`);
      if (result && result.data) {
        setVehicleNumber(result.data.vehicleNumber);
      }
    } catch (err) {
      console.error("Error fetching vehicle number:", err);
    }
  };

  // Fetch passengers data
  const fetchPassengers = async () => {
    if (!vehicleNumber) return;
    try {
      const result = await axios.get(
        `/proxy/driver/display-passenger/${vehicleNumber}`
      );
      if (result && result.data && Array.isArray(result.data.passengers)) {
        setPassengers(result.data.passengers);
        setTotalPassengers(result.data.count);
        console.log(result.data.passengers);
      }
    } catch (err) {
      console.error("Error fetching passengers:", err);
    }
  };

  const fetchShuttleSeats = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.get(
        `/proxy/driver/get-shuttleCapacity/${vehicleNumber}`,
        config
      );
      if (result && result.data) {
        setVehicleSeats(result.data.shuttleCapacity);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeats = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(
        `/proxy/driver/select-passenger/${vehicleNumber}?seatCapacity=${vehicleSeats}`,
        config
      );
      if (result && result.data) {
        setSelectedPassengers(result.data.passengers);
        setTotalSelectedPassengers(result.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (
    selectedId,
    passengerName,
    urgency,
    seatRequirement,
    phone
  ) => {
    try {
      const data = {
        selectedId,
        passengerName,
        urgency,
        seatRequirement,
        phone,
        vehicleNumber,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.post(
        "/proxy/driver/accept-passengers/",
        data,
        config
      );
      if (result && result.data) {
        setAcceptedPassengers((prev) => new Set(prev).add(selectedId));
        toast({
          title: result.data.msg,
          duration: 3000,
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: result.data.msg,
          duration: 3000,
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Internal server error";
      toast({
        title: errorMessage,
        duration: 3000,
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.delete(
        `/proxy/driver/delete-previous-req/${vehicleNumber}`,
        config
      );

      if (result && result.data) {
        toast({
          title: result.data.msg,
          position: "top-right",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: error.response?.data?.msg || "An error occurred!",
        position: "top-right",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (id) fetchVehicleNumber();
  }, [id]);

  useEffect(() => {
    if (vehicleNumber) {
      fetchPassengers();
      fetchShuttleSeats();
    }
  }, [vehicleNumber]);

  return (
    <>
      <div className="flex">
        <NavbarLeftSide />
        <div className="flex-1 ">
          {totalPassengers > 0 ? (
            <div className="max-w-7xl mx-auto p-8 space-y-8 ">
              <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex justify-between">
                  <div>
                    Select Passengers for Vehicle:{" "}
                    <span className="text-blue-600">{vehicleNumber}</span>
                  </div>
                  <div>
                    Total Seats:{" "}
                    <span className="text-blue-600">{vehicleSeats}</span>
                  </div>
                </h2>

                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="py-2 px-4 border border-gray-100">
                        Passenger Name
                      </th>
                      <th className="py-2 px-4 border border-gray-100">
                        Urgency
                      </th>
                      <th className="py-2 px-4 border border-gray-100">
                        Seat Requirement
                      </th>
                      <th className="py-2 px-4 border border-gray-100">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {passengers.map((item) => (
                      <tr key={item._id} className="odd:bg-gray-50">
                        <td className="py-2 px-4 border border-gray-100 text-center">
                          {item.passengerName}
                        </td>
                        <td className="py-2 px-4 border border-gray-100 text-center">
                          <span
                            className={`py-1 px-3 rounded-full text-white ${
                              item.urgency >= 8
                                ? "bg-green-500"
                                : item.urgency >= 5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          >
                            {item.urgency}
                          </span>
                        </td>
                        <td className="py-2 px-4 border border-gray-100 text-center">
                          {item.seatRequirement}
                        </td>
                        <td className="py-2 px-4 border border-gray-100 text-center">
                          {item.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-600">
                    <strong>Total Passengers:</strong> {totalPassengers}
                  </span>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete Requests
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white shadow-md rounded-lg mx-auto">
                <form>
                  <label
                    htmlFor="seat"
                    className="font-semibold text-gray-600 block mb-2"
                  >
                    Number of seats
                  </label>
                  <input
                    type="text"
                    id="seat"
                    value={vehicleSeats}
                    // onChange={(e) => setSeats(e.target.value)}
                    placeholder="Enter the number of seats"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    readOnly
                  />
                  <button
                    onClick={handleSeats}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4 w-full"
                  >
                    Submit
                  </button>
                </form>
              </div>

              {selectedPassengers.length > 0 && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    Selected Passengers
                  </h2>
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="py-2 px-4 border border-gray-100">
                          Passenger Name
                        </th>
                        <th className="py-2 px-4 border border-gray-100">
                          Urgency
                        </th>
                        <th className="py-2 px-4 border border-gray-100">
                          Seat Requirement
                        </th>
                        <th className="py-2 px-4 border border-gray-100">
                          Phone
                        </th>
                        <th className="py-2 px-4 border border-gray-100">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPassengers.map((item) => (
                        <tr key={item._id} className="odd:bg-gray-50">
                          <td className="py-2 px-4 border border-gray-100 text-center">
                            {item.passengerName}
                          </td>
                          <td className="py-2 px-4 border border-gray-100 text-center">
                            <span
                              className={`py-1 px-3 rounded-full text-white ${
                                item.urgency >= 8
                                  ? "bg-green-500"
                                  : item.urgency >= 5
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {item.urgency}
                            </span>
                          </td>
                          <td className="py-2 px-4 border border-gray-100 text-center">
                            {item.seatRequirement}
                          </td>
                          <td className="py-2 px-4 border border-gray-100 text-center">
                            {item.phone}
                          </td>
                          <td className="py-2 px-4 border border-gray-100 text-center">
                            <button
                              onClick={() =>
                                handleAccept(
                                  item._id,
                                  item.passengerName,
                                  item.urgency,
                                  item.seatRequirement,
                                  item.phone
                                )
                              }
                              disabled={acceptedPassengers.has(item._id)} // Disable if passenger already accepted
                              className={`px-4 py-1 rounded-md ${
                                acceptedPassengers.has(item._id)
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {acceptedPassengers.has(item._id)
                                ? "Accepted"
                                : "Accept"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-600">
                      <strong>Selected Total Passengers:</strong>{" "}
                      {totalSelectedPassengers}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-screen">
              <img
                src="https://cdn-icons-png.flaticon.com/128/13637/13637535.png"
                alt=""
                className=" mb-4 h-80 w-80 animate-pulse duration-300 ease-in-out"
              />
              <div className="w-fit bg-white  p-6 text-center flex items-center justify-center  font-semibold text-3xl bg-gradient-to-r from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text">
              <FaExclamationTriangle className="mr-4 text-red-500 animate-bounce " />{" "}
              No passenger requested yet!
            </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DriverSelectPassengers;
