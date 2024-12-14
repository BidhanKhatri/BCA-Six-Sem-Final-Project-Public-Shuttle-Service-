import React from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const FixRouteModal = ({
  toggleModal,
  vehicleNumber,
  email,
  phone,
  urgency,
  seatRequirement,
  handleSeatRequirementChange,
  handleUrgencyChange,
}) => {
  const toast = useToast();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.post(
        "/proxy/user/fix-shuttle/book",
        {
          passenger: { passengerName: email, urgency, seatRequirement, phone },
          vehicleNumber,
        },
        config
      );
      if (result && result.data) {
        toast({
          title: result.data.msg || "Route requested successfully!",
          position: "top-right",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } catch (err) {
      console.log(err);
      toast({
        title: err.response?.data?.msg || "Something went wrong!",
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
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
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
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
                value={vehicleNumber}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* seat Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="rou"
              >
                Seat Requirement (1 - 7) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="rou"
                value={seatRequirement}
                onChange={handleSeatRequirementChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* urgency level Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="urg"
              >
                Set Urgency Limit (1 - 10){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="range"
                id="urg"
                min="0"
                max="10"
                value={urgency}
                onChange={handleUrgencyChange}
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
    </div>
  );
};

export default FixRouteModal;
