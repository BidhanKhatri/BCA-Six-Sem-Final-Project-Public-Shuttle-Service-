import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import WhiteLogo from "../assets/images/ps-w-logo.png";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate(); // Corrected naming from `navigation` to `navigate`
  const riveRef = useRef(null);

  // Managing states for driver or passenger signup form
  const [passengerSignupForm, setPassengerSignupForm] = useState(false);

  // State for storing the signup data for driver
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for form validations
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Toggle to driver or passenger signup form
  const handlePassengerSignupForm = () => setPassengerSignupForm(true);
  const handleDriverSignupForm = () => setPassengerSignupForm(false);

  const validateForm = () => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  // Handling login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/proxy/driver/authenticate",
        { email, password },
        config
      );

      console.log("Login data:", data); // Debugging log

      localStorage.setItem("DriverCredentials", JSON.stringify(data));

      toast({
        title: "Login Successfully",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (data && data.role === "driver" && data._id) {
        navigate(`/dashboard/${data._id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: errorMessage,
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handling login for passenger
  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/proxy/user/authenticate",
        { email, password },
        config
      );

      console.log("User login data:", data); // Debugging log

      localStorage.setItem("UserCredentials", JSON.stringify(data));

      toast({
        title: "Login Successfully",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (data && data.role === "user" && data._id) {
        navigate(`/dashboard/${data._id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: errorMessage,
        position: "top-right",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        passengerSignupForm ? handleSubmitUser(e) : handleSubmit(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [passengerSignupForm, email, password]);

  return (
    <div className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('assets/images/login-signup-bg.jpg')]">
      <Navbar />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <form className="relative bg-white/70 max-w-md mx-auto w-full py-4 px-6 rounded-md space-y-4 border border-gray-400/40 shadow-md">
      <img src={WhiteLogo} alt="logo" className="absolute top-0 left-[50%]  -translate-y-1/2 -translate-x-1/2 h-44 w-auto " />
        <h1 className="text-3xl font-bold text-center pt-4">Login</h1>

        <div className="flex justify-center items-center">
          <div className="bg-gray-400/60 border border-gray-400/20 flex justify-center items-center space-x-2 py-2 px-4 rounded-lg w-fit">
            <span
              onClick={handleDriverSignupForm}
              className={`${
                passengerSignupForm ? "bg-transparent" : "bg-blue-500"
              } p-2 rounded-lg text-white font-bold min-w-24 text-center cursor-pointer hover:bg-blue-500 transition-all delay-100 ease-in-out`}
            >
              Driver
            </span>
            <span
              onClick={handlePassengerSignupForm}
              className={`${
                passengerSignupForm ? "bg-blue-500" : "bg-transparent"
              } p-2 rounded-lg text-white font-bold min-w-24 text-center cursor-pointer hover:bg-blue-500 transition-all delay-100 ease-in-out`}
            >
              Passenger
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="font-normal">
            Email:
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="font-normal">
            Password:
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-1 py-2 rounded-md outline-none border border-gray-400/60 focus:border-cyan-500"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div className="w-full flex items-center justify-center">
          <input
            type="button"
            value="Login"
            onClick={passengerSignupForm ? handleSubmitUser : handleSubmit}
            className="bg-blue-500 px-2 py-2 rounded-md text-white w-full font-bold cursor-pointer hover:bg-blue-600"
          />
        </div>

        <div>
          <p className="text-center">
            Don't have an Account?{" "}
            <span className="font-bold text-blue-600 cursor-pointer hover:underline">
              <Link to="/signup">Signup Now</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
