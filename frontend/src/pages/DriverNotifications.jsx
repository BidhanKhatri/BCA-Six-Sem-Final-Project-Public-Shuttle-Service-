import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const DriverNotifications = () => {
  const toast = useToast();
  const { id } = useParams();

  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

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

  const fetchNotifications = async () => {
    if (!vehicleNumber) return;
    try {
      const result = await axios.get(
        `/proxy/driver/notifications/${vehicleNumber}`
      );
      if (Array.isArray(result.data)) {
        setNotifications(result.data);
      } else {
        setErrorMsg(result.data.msg || "No notifications found.");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.msg ||
          "An error occurred while fetching notifications."
      );
    }
  };

  //function to handle notification accept button
  const handleAccept = async (notiId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.patch(
        `/proxy/driver/change-status/${notiId}`,
        { status: "true" },
        config
      );

      if (result && result.data) {
        toast({
          title: result.data.msg || "Status updated successfully!",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);

      // Display error notification
      toast({
        title: "Error updating status.",
        description: err.response?.data?.msg || "An error occurred.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  //function to handle decline
  async function handleDecline(userId) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await axios.delete(
        `/proxy/route/booking-details/delete/${userId}`,
        config
      );

      if (result && result.data) {
        toast({
          title: result.data.msg || "Status updated successfully!",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error occured!", error);
    }
  }

  useEffect(() => {
    if (id) fetchVehicleNumber();
  }, [id]);

  useEffect(() => {
    if (vehicleNumber) fetchNotifications();
  }, [vehicleNumber]);

  return (
    <div className="flex min-h-screen bg-gray-200/80">
      <NavbarLeftSide />
      <div className="flex-1 flex flex-col items-center py-12 px-6">
        <h1 className="text-4xl font-extrabold tracking-wide mb-8">
          Notifications
        </h1>

        <div className="w-full max-w-3xl space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    User ID: {notification.userId}
                  </p>
                  <p className="text-gray-600">
                    Email: {notification.userEmail}
                  </p>
                  <p className="text-gray-600">
                    Phone: {notification.userPhone}
                  </p>
                  <p className="text-gray-600">
                    Route: {notification.userRoute}
                  </p>
                </div>
                <div className="flex gap-2">
                  {notification.staus === false ? (
                    <>
                      <button
                        className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                        onClick={() =>
                          handleAccept(
                            notification.userId,
                            notification.userEmail,
                            notification.userPhone,
                            notification.userRoute
                          )
                        }
                      >
                        <FiCheckCircle className="mr-2" />
                        Accept
                      </button>
                      <button
                        className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                        onClick={() =>
                          handleDecline(notification.notificationId)
                        }
                      >
                        <FiXCircle className="mr-2" />
                        Decline
                      </button>
                    </>
                  ) : (
                    <button className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                      <FiCheckCircle className="mr-2" />
                      Accepted
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 text-lg font-semibold">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverNotifications;
