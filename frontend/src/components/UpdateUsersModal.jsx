import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

const UpdateUsersModal = ({
  onClose,
  email,
  phone,
  role,
  id,
  vehicleNumber,
}) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: email,
    phone: phone,
    vehicleNumber: vehicleNumber,
    role: role,
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (role === "driver") {
      try {
        const result = await axios.patch(
          `/proxy/admin/update/driver/${id}`,
          formData,
          config
        );
        if (result && result.data) {
          toast({
            title: result.data.msg,
            position: "top-right",
            duration: 3000,
            isClosable: true,
            status: "success",
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: error.response?.data?.msg || "An error occurred!",
          position: "top-right",
          duration: 3000,
          isClosable: true,
          status: "error",
        });
      }
      return;
    }

    if (role === "user") {
      try {
        const result = await axios.patch(
          `/proxy/admin/update/user/${id}`,
          formData,
          config
        );
        if (result && result.data) {
          toast({
            title: result.data.msg,
            position: "top-right",
            duration: 3000,
            isClosable: true,
            status: "success",
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: error.response?.data?.msg || "An error occurred!",
          position: "top-right",
          duration: 3000,
          isClosable: true,
          status: "error",
        });
      }
      return;
    }
  };

  // Close the modal if clicked outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose(); // Trigger the close function passed as a prop
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center h-screen "
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Update User Details
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {/* Vehicle Number Field */}

        {role === "driver" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter vehicle number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        )}

        {/* Role Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateUsersModal;
