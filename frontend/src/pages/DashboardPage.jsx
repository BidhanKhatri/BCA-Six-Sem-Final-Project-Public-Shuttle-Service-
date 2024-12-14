import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";
import NavbarLeftSide from "../components/NavbarLeftSide";
import { FaBus, FaUser } from "react-icons/fa";
import AniImg from "../assets/images/driving.png";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  Title,
  CategoryScale,
  LinearScale
);

const DashboardPage = () => {
  const [totalDriver, setTotalDriver] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalShuttle, setTotalShuttle] = useState([]);

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchTotalDriver = async () => {
    try {
      const result = await axios.get("/proxy/driver", config);
      if (Array.isArray(result.data)) {
        setTotalDriver(result.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalUser = async () => {
    try {
      const result = await axios.get("/proxy/user/display-all", config);
      if (result.data && Array.isArray(result.data.data)) {
        setTotalUser(result.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalShuttle = async () => {
    try {
      const result = await axios.get("/proxy/user/shuttle/display-all", config);
      if (result && Array.isArray(result.data)) {
        setTotalShuttle(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTotalDriver();
    fetchTotalUser();
    fetchTotalShuttle();
  }, []); // Only call fetch functions once on mount

  // Chart data for total drivers and users
  const chartData = {
    labels: ["Total Drivers", "Total Users"],
    datasets: [
      {
        label: "User and Driver Counts",
        data: [totalDriver, totalUser],
        backgroundColor: ["#36A2EB", "#4BC0C0"],
        borderColor: ["#36A2EB", "#4BC0C0"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Data for shuttle chart
  const data = {
    labels: totalShuttle.map(
      (shuttle) => `veh no ${shuttle.vehicleNumber}` || `Shuttle ${shuttle.id}`
    ),
    datasets: [
      {
        label: "Number of seats",
        data: totalShuttle.map((shuttle) => shuttle.shuttleCapacity),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Total Shuttle Data",
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavbarLeftSide />
      <div className="flex-1 px-10 py-4 ">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-semibold text-gray-800 mb-0 bg-gradient-to-r from-cyan-700 to-fuchsia-400 w-fit text-transparent bg-clip-text">
            Dashboard Overview
          </h1>
          <img src={AniImg} alt="ani-img" className="h-16 animate-spin " />
        </div>
        <div className="grid grid-cols-3 mb-8 gap-4">
          <div className="flex justify-between items-center py-8 px-4 bg-white rounded-md border-2 border-t-blue-500">
            <div className="flex items-center">
              <FaUser className="mr-3" />{" "}
              <p className="font-normal text-xl">Total Drivers</p>
            </div>{" "}
            <span className="font-bold text-3xl">{totalDriver}</span>
          </div>
          <div className="flex justify-between items-center py-8 px-4 bg-white rounded-md border-2 border-t-green-500">
            <div className="flex items-center">
              <FaUser className="mr-3" />{" "}
              <p className="font-normal text-xl">Total Users</p>
            </div>{" "}
            <span className="font-bold text-3xl">{totalUser}</span>
          </div>
          <div className="flex justify-between items-center py-8 px-4 bg-white rounded-md border-2 border-t-red-500">
            <div className="flex items-center">
              <FaBus className="mr-3" />{" "}
              <p className="font-normal text-xl">Fix Shuttles</p>
            </div>{" "}
            <span className="font-bold text-3xl">{totalShuttle.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 place-items-center gap-4">
          <div className="flex flex-col items-center justify-center shadow-lg rounded-lg p-12 max-w-xl w-full h-96 bg-white ">
            <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">
              Driver and User Counts
            </h2>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="flex flex-col items-center justify-center shadow-lg rounded-lg p-8 max-w-xl w-full h-96 bg-white ">
            <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">
              Shuttle Data
            </h2>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
