import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

const AdminUpdateShuttleModal = ({
  toggleModal,
  vehicleNumber,
  shuttleCapacity,
  fromLoc,
  toLoc,
  departureTime,
  arrivalTime,
  id,
}) => {
  const [vNum, setVNum] = useState(vehicleNumber);
  const [sCap, setSCap] = useState(shuttleCapacity);
  const [fLoc, setFLoc] = useState(fromLoc);
  const [tLoc, setTLoc] = useState(toLoc);
  const [dTime, setDTime] = useState(departureTime);
  const [aTime, setATime] = useState(arrivalTime);
  const [updatingId, setUpdatingId] = useState(id);
  console.log(updatingId);
  const toast = useToast();

  //function to update the fix route details

  const handleUpdate = async (e) => {
    e.preventDefault();
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const data = {
      vehicleNumber: vNum,
      shuttleCapacity: sCap,
      fromLoc: fLoc,
      toLoc: tLoc,
      departureTime: dTime,
      arrivalTime: aTime,
    };

    try {
      const result = await axios.patch(
        `/proxy/admin/update/fix-shuttle/${updatingId}`,
        data,
        config
      );
      if (result && result.data) {
        toast({
          title: result.data.msg,
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "success",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: err.response.data.msg,
        duration: 3000,
        isClosable: true,
        position: "top-right",
        status: "error",
      });
    }
  };

  return (
    <div>
      <div className="fixed min-h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 pt-10 overflow-y-scroll">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative ">
          {/* Close Button */}
          <button
            className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            onClick={toggleModal}
          >
            &times;
          </button>

          {/* Modal Content */}
          <h2 className="text-lg font-semibold mb-4">Update Route</h2>

          <form onSubmit={handleUpdate}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="vehicleNumber"
              >
                VehicleNumber
              </label>
              <input
                type="text"
                id="vehileNumber"
                value={vNum}
                onChange={(e) => setVNum(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Your Name"
              />
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="shuttleCapacity"
              >
                Shuttle Capacity
              </label>
              <input
                type="number"
                id="shuttleCapacity"
                value={sCap}
                onChange={(e) => setSCap(Number(e.target.value))}
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
                From Location
              </label>
              <input
                type="text"
                id="vechNo"
                value={fLoc}
                onChange={(e) => setFLoc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="toLoc"
              >
                To Location
              </label>
              <input
                type="text"
                id="toLoc"
                value={tLoc}
                onChange={(e) => setTLoc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="d-time"
              >
                Departure Time
              </label>
              <input
                type="text"
                id="d-time"
                value={dTime}
                onChange={(e) => setDTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2 text-left"
                htmlFor="a-time"
              >
                Arrival Time
              </label>
              <input
                type="text"
                id="a-time"
                value={aTime}
                onChange={(e) => setATime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ease-in-out transition-all
                duration-300"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateShuttleModal;
