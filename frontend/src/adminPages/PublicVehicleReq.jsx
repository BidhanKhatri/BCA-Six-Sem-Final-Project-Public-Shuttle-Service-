import React, { useEffect, useState } from "react";
import NavbarLeftSide from "../components/NavbarLeftSide";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const PublicVehicleReq = () => {
  const [data, setData] = useState([]);
  const toast = useToast();

  //function to fetch driver detailss
  const fetchDriver = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get("/proxy/driver", config);

      if (result && Array.isArray(result.data)) {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to handle handleAcceptReq to change the status of public req verification
  const handleAcceptReq = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await axios.patch(
        `/proxy/admin/verify-accept/public-shuttle-request/${id}`,
        { status: true },
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

  useEffect(() => {
    fetchDriver();
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 flex  py-2">
      <NavbarLeftSide />

      <div className="flex-1">
        <div className=" w-full   p-6">
          <h1 className="text-2xl font-bold w-fit bg-gradient-to-r from-cyan-700 to-fuchsia-400 text-transparent bg-clip-text  mb-6">
            Public Vehicle Verification Details
          </h1>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300  overflow-hidden">
              <thead className="bg-blue-500 text-white ">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    #
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Role
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Email
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Phone
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Vehicle Number
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Route
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Distance (KM)
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Actions
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left text-xs">
                    Verified
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200 transition duration-200`}
                  >
                    <td className="px-4 py-2 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 capitalize">
                      {user.role}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.phone}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.vehicleNumber}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.route}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.distance.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border-t flex items-center justify-center">
                      <button
                        disabled={user.isVerified}
                        className="bg-green-500 px-2 py-1.5 text-white rounded-md"
                        onClick={() => handleAcceptReq(user._id)}
                      >
                        {user.isVerified ? "Verified" : "Verify"}
                      </button>

                      {user.isVerified === false && (
                        <button className="bg-red-500 px-2 py-1.5 text-white rounded-md ml-2">
                          Reject
                        </button>
                      )}
                    </td>

                    <td
                      className={`px-4 py-2 border border-gray-300 font-semibold ${
                        user.isVerified ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.isVerified ? "True" : "False"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVehicleReq;
