import React, { useEffect, useState } from "react";
import NavbarLeftSide from "../components/NavbarLeftSide";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  FaBus,
  FaRoute,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import BookingNotImg from "../assets/images/booking-not.jpg";

function BusBookedDetailsPage() {
  const { id } = useParams();
  const toast = useToast();
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: "N/A",
    routeName: "N/A",
    distance: "N/A",
    status: "N/A",
    email: "N/A",
    phone: "N/A",
  });

  const [isEditing, setIsEditing] = useState(false);

  const fetchBookingDetails = async () => {
    try {
      const result = await axios.get(`/proxy/route/booking-details/${id}`);
      setVehicleDetails(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const deleteBooking = async () => {
    try {
      await axios.delete(
        `/proxy/route/booking-details/delete/${vehicleDetails._id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Booking details deleted successfully",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err.response?.data?.msg || "An error occurred",
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex">
      <NavbarLeftSide />
      <div className="flex-1 h-screen flex flex-col items-center justify-center bg-gray-200/40 ">
        {!vehicleDetails._id && (
          <>
            <div>
              <img
                src={BookingNotImg}
                alt="booking-not"
                className="w-80 max-w-3xl  mix-blend-multiply animate-pulse"
              />
            </div>
            <div className="w-fit bg-white  p-6 text-center flex items-center justify-center  font-semibold text-3xl bg-gradient-to-r from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text">
              <FaExclamationTriangle className="mr-4 text-red-500 animate-bounce " />{" "}
              No booking details found
            </div>
          </>
        )}
        {vehicleDetails._id && (
          <div className="w-full max-w-3xl bg-white border border-sky-500/20 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-8  text-gray-800">
              Booking Details
            </h2>
            {!isEditing ? (
              <div className="space-y-6">
                <DetailRow
                  label="Vehicle Number"
                  value={vehicleDetails.vehicleNumber}
                  icon={<FaBus className="text-blue-600" />}
                />
                <DetailRow
                  label="Route"
                  value={vehicleDetails.routeName}
                  icon={<FaRoute className="text-purple-600" />}
                />
                <DetailRow
                  label="Email"
                  value={vehicleDetails.email}
                  icon={<FaEnvelope className="text-red-600" />}
                />
                <DetailRow
                  label="Phone"
                  value={vehicleDetails.phone}
                  icon={<FaPhone className="text-green-600" />}
                />
                <DetailRow
                  label="Status"
                  value={
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                        vehicleDetails.status === false
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {vehicleDetails.status === false ? "Pending" : "Booked"}
                    </span>
                  }
                  icon={<FaMapMarkerAlt className="text-gray-600" />}
                />

                <div className="flex justify-end space-x-4 pt-6">
                  {/* <button className="bg-gray-500 text-white flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-gray-600 transition-transform transform hover:scale-105">
                    <FaMapMarkerAlt className="mr-2" />
                    Live Track
                  </button> */}
                  <button
                    className="bg-red-500 text-white flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-red-600 transition-transform transform hover:scale-105"
                    onClick={deleteBooking}
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <EditableField
                  label="Vehicle Number"
                  value={vehicleDetails.vehicleNumber}
                  onChange={(e) =>
                    setVehicleDetails({
                      ...vehicleDetails,
                      vehicleNumber: e.target.value,
                    })
                  }
                />
                <EditableField
                  label="Route"
                  value={vehicleDetails.routeName}
                  onChange={(e) =>
                    setVehicleDetails({
                      ...vehicleDetails,
                      routeName: e.target.value,
                    })
                  }
                />
                <EditableField
                  label="Distance"
                  value={vehicleDetails.distance}
                  onChange={(e) =>
                    setVehicleDetails({
                      ...vehicleDetails,
                      distance: e.target.value,
                    })
                  }
                />
                <div className="flex justify-end space-x-4 pt-4">
                  <button className="bg-blue-500 text-white flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-600 transition-transform transform hover:scale-105">
                    <FaEdit className="mr-2" />
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-gray-500 transition-transform transform hover:scale-105"
                    onClick={() => setIsEditing(false)}
                  >
                    <FaTrash className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const DetailRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center border-b pb-4">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-gray-600 font-semibold">{label}:</span>
    </div>
    <span className="text-gray-800">{value}</span>
  </div>
);

const EditableField = ({ label, value, onChange }) => (
  <div>
    <label className="text-gray-600 font-semibold">{label}:</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 mt-1 p-2 rounded-md focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
    />
  </div>
);

export default BusBookedDetailsPage;
