import React, { useEffect, useState } from "react";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiTruck } from "react-icons/fi";

export default function ProfilePage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const fetchData = async () => {
    const result = await axios.get(`/proxy/driver/${id}`);
    if (result) {
      setName(result.data.name);
      setEmail(result.data.email);
      setPhone(result.data.phone);
      setVehicleNumber(result.data.vehicleNumber);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-200/80">
      <NavbarLeftSide id={id} />

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-extrabold text-blue-500 mb-8 tracking-wider transform transition hover:scale-105 hover:text-blue-600">
          User Profile
        </h2>

        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl transform transition hover:shadow-blue-500/50">
          <div className="space-y-8">
            <ProfileDetail label="User ID" value={id} icon={<FiUser />} />
            <ProfileDetail label="Name" value={name} icon={<FiUser />} />
            <ProfileDetail label="Email" value={email} icon={<FiMail />} />
            <ProfileDetail label="Phone" value={phone} icon={<FiPhone />} />
            <ProfileDetail
              label="Vehicle Number"
              value={vehicleNumber}
              icon={<FiTruck />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileDetail = ({ label, value, icon }) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-4 group">
    <div className="flex items-center space-x-3">
      <div className="text-blue-500 group-hover:text-indigo-600 transition duration-300 text-xl">
        {icon}
      </div>
      <span className="text-gray-600 font-semibold group-hover:text-blue-600 transition duration-300">
        {label}:
      </span>
    </div>
    <span className="text-gray-900 font-medium group-hover:text-indigo-700 transition duration-300">
      {value}
    </span>
  </div>
);
