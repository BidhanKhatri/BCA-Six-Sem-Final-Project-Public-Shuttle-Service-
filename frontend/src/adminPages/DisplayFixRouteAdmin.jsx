import React, { useEffect, useState } from "react";
import axios from "axios";
import FixRouteModal from "../components/FixRouteModal";
import { useParams } from "react-router-dom";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { useToast } from "@chakra-ui/react";
import AdminUpdateShuttleModal from "../components/AdminUpdateShuttleModal";

const DisplayFixRouteAdmin = () => {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [seatRequirement, setSeatRequirement] = useState(1);
  const [urgency, setUrgency] = useState(1);
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  // Toggle Modal
  const toggleModal = (route = null) => {
    setIsOpen(!isOpen);
    setSelectedRoute(route);
  };

  const fetchFixShuttle = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
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

  const handleDelete = async (id) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const result = await axios.delete(
        `/proxy/admin/delete/fix-shuttle/${id}`,
        config
      );
      if (result?.data) {
        toast({
          title: result.data.msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        setData(data.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFixShuttle();
    fetchUserProfile();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <NavbarLeftSide />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">
            Fixed Shuttle Routes
          </h1>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white text-sm uppercase tracking-wide">
                  <th className="py-3 px-6 border-b">Route</th>
                  <th className="py-3 px-6 border-b">Vehicle No</th>
                  <th className="py-3 px-6 border-b">Departure Time</th>
                  <th className="py-3 px-6 border-b">Arrival Time</th>
                  <th className="py-3 px-6 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((route) => (
                  <tr key={route._id} className="hover:bg-gray-50">
                    <td className="py-3 px-6">{route.routeName}</td>
                    <td className="py-3 px-6">{route.vehicleNumber}</td>
                    <td className="py-3 px-6">{route.departureTime}</td>
                    <td className="py-3 px-6">{route.arrivalTime}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => toggleModal(route)}
                          className="bg-blue-500 text-white font-medium py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(route._id)}
                          className="bg-red-500 text-white font-medium py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-gray-500 italic"
                    >
                      No fixed shuttle routes available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isOpen && selectedRoute && (
        <AdminUpdateShuttleModal
          toggleModal={toggleModal}
          vehicleNumber={selectedRoute.vehicleNumber}
          shuttleCapacity={selectedRoute.shuttleCapacity}
          fromLoc={selectedRoute.fromLoc?.name}
          toLoc={selectedRoute.toLoc?.name}
          departureTime={selectedRoute.departureTime}
          arrivalTime={selectedRoute.arrivalTime}
          id={selectedRoute._id}
        />
      )}
    </div>
  );
};

export default DisplayFixRouteAdmin;
