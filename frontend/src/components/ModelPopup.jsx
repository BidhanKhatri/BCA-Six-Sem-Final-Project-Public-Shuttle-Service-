import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function ModelPopup({
  toggleModal,
  vehicleNum,
  routeName,
  phone,
  email,
  user_id,
  distance,
}) {
  const [userEmail, setUserEmail] = useState(email);
  const [userPhone, setUserPhone] = useState(phone);
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!userEmail || !userPhone) {
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
        "/proxy/driver/book-route",
        {
          user_id,
          userEmail,
          userPhone,
          vehicleNum,
          routeName,
          status: false,
        },
        config
      );

      if (data) {
        toast({
          title: "Route Booked Successfully",
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Already booked your route",
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 ">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative ">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
          onClick={toggleModal}
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-lg font-semibold mb-4">Book Your Route</h2>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 text-left"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Your Name"
            />
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 text-left"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Your phone number"
            />
          </div>

          {/* VehicalNumber Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 text-left"
              htmlFor="vechNo"
            >
              Vehicle Number
            </label>
            <input
              type="text"
              id="vechNo"
              value={vehicleNum}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Route Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-left" htmlFor="rou">
              Route
            </label>
            <input
              type="text"
              id="rou"
              value={routeName}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModelPopup;
