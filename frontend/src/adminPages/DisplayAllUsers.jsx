import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NavbarLeftSide from "../components/NavbarLeftSide";
import axios from "axios";
import UpdateUsersModal from "../components/UpdateUsersModal";

const DisplayAllUsers = () => {
  const [userData, setUserData] = useState([]);
  const toast = useToast();
  const [isModal, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState();

  const config = {
    headers: { "Content-Type": "application/json" },
  };

  //handle toggle modal
  const handleToggle = (userData = null) => {
    setIsOpen(!isModal);
    setSelectedData(userData);
  };

  //function to fetch all drivers details
  const fetchAllUser = async () => {
    try {
      const result = await axios.get("/proxy/admin/display-all-user", config);
      if (result && Array.isArray(result.data)) {
        setUserData(result.data);
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

  //function to delete the user
  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(
        `/proxy/admin/delete/user/${id}`,
        config
      );
      if (result && result.data) {
        toast({
          title: result.data.msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        setUserData(userData.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data?.msg || "An error occurred!",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  //function to update the user

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <NavbarLeftSide />
      <div className="flex-1 p-6">
        {/* Page Title */}
        <p className="text-3xl font-bold mb-6 text-gray-700">
          All Users Details
        </p>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-blue-600 text-white text-left text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-700">{user.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring focus:ring-blue-300"
                      >
                        Update
                      </button>
                      {isModal && (
                        <UpdateUsersModal
                          onClose={() => setIsOpen(false)}
                          id={selectedData._id}
                          email={selectedData.email}
                          phone={selectedData.phone}
                          role={selectedData.role}
                        />
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
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
          {userData.length === 0 && (
            <div className="text-center py-6 text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayAllUsers;
