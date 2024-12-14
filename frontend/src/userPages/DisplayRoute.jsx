import React, { useEffect, useState } from "react";
import axios from "axios";
import ModelPopup from "../components/ModelPopup";
import { useParams } from "react-router-dom";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { FaTaxi } from "react-icons/fa";
import { MdGroup } from "react-icons/md";

const DisplayRoute = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const { id } = useParams();

  const fetchAllRoutes = async () => {
    try {
      const result = await axios.get("/proxy/display/routes/");
      if (Array.isArray(result.data)) {
        setData(result.data);
        console.log(result.data);
      }
    } catch (err) {
      alert("Error occurred while fetching routes. Please try again.");
    }
  };

  useEffect(() => {
    fetchAllRoutes();
  }, []);

  function toggleModal(route = null) {
    setIsOpen(!isOpen);
    setSelectedRoute(route);
  }

  //fetching the user email and phone number
  const fetchUserProfile = async () => {
    try {
      const result = await axios.get(`/proxy/user/profile/${id}`);
      setPhone(result.data.phone);
      setEmail(result.data.email);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    return () => {};
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-200/40">
        <NavbarLeftSide />{" "}
        <div className=" flex-1 flex flex-col items-center justify-start ">
          <div className=" mt-8 rounded-lg w-full px-6 ">
            <div className="flex  items-center mb-6 space-x-2">
              <span className="flex">
                <FaTaxi size={32} className="text-amber-500" />{" "}
                <MdGroup size={32} className="text-blue-500" />
              </span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-fuchsia-400 w-fit text-transparent bg-clip-text ">
                Public Routes For Passengers
              </h2>
            </div>
            <div className="overflow-x-auto ">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-blue-600 text-white border border-gray-300">
                    <th className="px-4 py-2 font-semibold text-center border border-gray-300">
                      Route Name
                    </th>
                    <th className="px-4 py-2 font-semibold text-center border border-gray-300">
                      Driver Email
                    </th>
                    <th className="px-4 py-2 font-semibold text-center border border-gray-300">
                      Vehicle Number
                    </th>
                    <th className="px-4 py-2 font-semibold text-center border border-gray-300 ">
                      Driver Phone
                    </th>
                    {/* <th className="px-4 py-2 font-semibold text-center border border-gray-300">
                      Distance (km)
                    </th> */}
                    <th className="px-4 py-2 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .filter((item) => item.isVerified)
                    .map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-200 hover:bg-gray-100 transition duration-200"
                      >
                        <td className="px-4 py-2 text-center border border-gray-300">
                          {item.routeName}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-300">
                          {item.email}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-300">
                          {item.vehicleNumber}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-300">
                          {item.phone}
                        </td>
                        {/* <td className="px-4 py-2 text-center border border-gray-300">
                          {item.distance.toFixed(2) + " KM"}
                        </td> */}
                        <td className="px-4 py-2 text-center border border-gray-300">
                          <button
                            onClick={() => toggleModal(item)}
                            className="bg-blue-500 text-white font-semibold px-4 py-1 rounded hover:bg-blue-600 transition duration-150"
                          >
                            Book
                          </button>
                          {isOpen && (
                            <ModelPopup
                              toggleModal={toggleModal}
                              vehicleNum={selectedRoute.vehicleNumber}
                              routeName={selectedRoute.routeName}
                              phone={phone}
                              email={email}
                              user_id={id}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayRoute;
