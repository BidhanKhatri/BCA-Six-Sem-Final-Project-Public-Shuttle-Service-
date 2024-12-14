import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const result = await axios.post(
        "/proxy/admin/login",
        { email, password },
        config
      );
      if (result && result.data && result.data.data.role === "admin") {
        toast({
          title: "Login Successful!",
          // description: result.data.msg,
          position: "top-right",
          isClosable: true,
          duration: 3000,
          status: "success",
        });
        navigate(`/dashboard/${result.data.data.adminId}`);
      } else {
        toast({
          title: "Login Failed",
          // description: result.data.msg,
          position: "top-right",
          isClosable: true,
          duration: 3000,
          status: "error",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "An Error Occurred",
        description: error.response?.data?.msg || "Please try again later.",
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/abstract-watercolor-design-texture-background_1055-7882.jpg?ga=GA1.1.171552830.1720661916&semt=ais_hybrid')",
      }}
    >
      <div className="inset-0 bg-black opacity-20 absolute"></div>
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90">
        <h1 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your admin email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-gray-500 text-sm text-center mt-4">
          Forgot your password?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            Reset it
          </span>
        </p>
        <p className="text-center mt-4 text-gray-600 text-xs">
          © {new Date().getFullYear()} Public Shuttle Service. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginpage;
