import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaPhone,
  FaChair,
  FaSyncAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaIdCard,
  FaUser,
  FaExclamationCircle,
  FaCar,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import NavbarLeftSide from "../components/NavbarLeftSide";
import BookingNotImg from "../assets/images/booking-not.jpg";

const FixShuttleBookedDetailsPage = () => {
  const { id } = useParams();
  const [userPhone, setUserPhone] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user details to get user phone number by ID
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const result = await axios.get(
        `/proxy/user/get-single-user/${id}`,
        config
      );
      if (result && result.data) {
        setUserPhone(result.data.phone);
        setError(null);
      } else {
        setError("No user found.");
      }
    } catch (err) {
      setError("No Booking is available or accepted.");
      console.log(err.response?.data?.msg || err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking details using phone number
  const fetchFixShuttleBookingDetails = async () => {
    setLoading(true);
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const result = await axios.get(
        `/proxyuser/display-fix-booking/${userPhone}`,
        config
      );
      if (result && result.data) {
        setBookingData(result.data);
        setError(null);
      } else {
        setError("No booking details found.");
      }
    } catch (err) {
      setError("No Fix Route Booking details found");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user phone number when ID changes
  useEffect(() => {
    if (id) fetchUserDetails();
  }, [id]);

  // Fetch booking details when user phone changes
  useEffect(() => {
    if (userPhone) fetchFixShuttleBookingDetails();
  }, [userPhone]);

  return (
    <>
      <div className="flex">
        <NavbarLeftSide />
        <div className="flex-1">
          <div className="container mx-auto p-6">
            {/* Error and Loading States */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="text-blue-600 font-bold">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center py-12 h-[90vh]">
                <>
                  <div>
                    <img
                      src="https://img.freepik.com/free-vector/error-abstract-concept-illustration-error-webpage-browser-download-failure-page-found-server-request-unavailable-website-communication-problem_335657-938.jpg?ga=GA1.1.171552830.1720661916&semt=ais_hybrid"
                      alt="booking-not"
                      className="w-80 max-w-3xl  mix-blend-multiply animate-pulse"
                    />
                  </div>
                  <div className="w-fit bg-white  p-6 text-center flex items-center justify-center  font-semibold text-3xl bg-gradient-to-r from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text">
                    <FaExclamationTriangle className="mr-4 text-red-500 animate-bounce " />{" "}
                    No booking details found
                  </div>
                </>
              </div>
            ) : bookingData === null ? (
              <div className="flex flex-col justify-center items-center py-12 h-[90vh]">
                <>
                  <div>
                    <img
                      src="https://img.freepik.com/free-vector/error-abstract-concept-illustration-error-webpage-browser-download-failure-page-found-server-request-unavailable-website-communication-problem_335657-938.jpg?ga=GA1.1.171552830.1720661916&semt=ais_hybrid"
                      alt="booking-not"
                      className="w-80 max-w-3xl  mix-blend-multiply animate-pulse"
                    />
                  </div>
                  <div className="w-fit bg-white  p-6 text-center flex items-center justify-center  font-semibold text-3xl bg-gradient-to-r from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text">
                    <FaExclamationTriangle className="mr-4 text-red-500 animate-bounce " />{" "}
                    No fix shuttle booked
                  </div>
                </>
              </div>
            ) : (
              <div className="max-w-3xl p-8 my-10 bg-white rounded-lg shadow-lg mx-auto border border-blue-100">
                <p className="font-semibold text-2xl text-gray-800 mb-6">
                  Fix Shuttle Booking Details
                </p>

                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaIdCard className="text-blue-500" />
                      <span className="font-medium text-gray-700">
                        Booking ID:
                      </span>
                    </div>

                    <span>{bookingData.bookingId}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      <span className="font-medium text-gray-700">
                        Passenger Name:
                      </span>
                    </div>
                    <span>{bookingData.passengerName}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaExclamationCircle className="text-yellow-500" />

                      <span className="font-medium text-gray-700">
                        Urgency:
                      </span>
                    </div>
                    <span>{bookingData.urgency}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <FaChair className="text-blue-500" />
                      <span className="font-medium text-gray-700">
                        Seats Requested:
                      </span>
                    </div>
                    <span>{bookingData.seatRequirement}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaCar className="text-blue-500" />
                      <span className="font-medium text-gray-700">
                        Vehicle Number:
                      </span>
                    </div>
                    <span>{bookingData.vehicleNumbe}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-green-500" />
                      <span className="font-medium text-gray-700">
                        User Phone:
                      </span>
                    </div>
                    <span>{userPhone}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-lg font-semibold text-white ${
                        bookingData.status ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {bookingData.status ? (
                        <div className="flex items-center gap-2">
                          <FaCheckCircle /> Accepted
                        </div>
                      ) : (
                        "Pending"
                      )}
                    </span>
                  </div>

                  {/* QR Code Section */}
                  <div className="mt-6 flex items-center justify-between">
                    <p className="font-semibold text-gray-600 text-xl">
                      Scan this QR code
                    </p>
                    <QRCode
                      value={bookingData?.bookingId || "No Booking ID"}
                      size={128}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="Q"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FixShuttleBookedDetailsPage;
