import React, { useEffect, useState } from "react";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import UpdateUsersModal from "../components/UpdateUsersModal";

const DisplayAllDriver = () => {
  const [driverData, setDriverData] = useState([]);
  const toast = useToast();

  const [selectedData, setSelectedData] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  //function to handle the toggle
  const handleToggle = (driver = null) => {
    setIsOpen(!isOpen);
    setSelectedData(driver);
  };

  const config = {
    headers: { "Content-Type": "application/json" },
  };

  //function to fetch all drivers details
  const fetchAllDriver = async () => {
    try {
      const result = await axios.get("/proxy/driver", config);
      if (result && Array.isArray(result.data)) {
        setDriverData(result.data);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching data",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  //function to delete a single driver
  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(
        `/proxy/admin/delete/driver/${id}`,
        config
      );
      if (result && result.data) {
        toast({
          title: result.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setDriverData(driverData.filter((driver) => driver._id !== id));
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.msg || "Error fetching data",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchAllDriver();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <NavbarLeftSide />
      <div className="flex-1 p-6">
        {/* Page Title */}
        <p className="text-3xl font-bold mb-6 text-gray-700">
          All Drivers Details
        </p>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-blue-600 text-white text-left text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Vehicle Number</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {driverData.map((driver) => (
                <tr key={driver._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{driver.email}</td>
                  <td className="px-6 py-4 text-gray-700">{driver.phone}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {driver.vehicleNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{driver.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(driver)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring focus:ring-blue-300"
                      >
                        Update
                      </button>
                      {isOpen && (
                        <UpdateUsersModal
                          onClose={() => setIsOpen(false)}
                          id={selectedData._id}
                          email={selectedData.email}
                          phone={selectedData.phone}
                          vehicleNumber={selectedData.vehicleNumber}
                          role={selectedData.role}
                        />
                      )}
                      <button
                        onClick={() => handleDelete(driver._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:ring focus:ring-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {driverData.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No drivers found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayAllDriver;
