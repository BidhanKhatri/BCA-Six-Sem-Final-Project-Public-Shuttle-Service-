import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarLeftSide from "./NavbarLeftSide";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

// Custom Marker Icons
const vehicleMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/3774/3774278.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const startMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/727/727606.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const midMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/727/727604.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const destinationMarkerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Fly to Location Component
const FlyToLocation = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 15, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

const MapView = () => {
  const initialCoords = [22.5726, 88.3639]; // Default location
  const [searchText, setSearchText] = useState("");
  const [latitude, setLatitude] = useState(initialCoords[0]);
  const [longitude, setLongitude] = useState(initialCoords[1]);
  const [time, setTime] = useState("");
  const [vehicleNumberSearch, setVehicleNumber] = useState("");
  const [fromLocLatLng, setFromLocLatLng] = useState([]);
  const [midLocLatLng, setMidLocLatLng] = useState([]);
  const [toLocLatLng, setToLocLatLng] = useState([]);
  const [speed, setSpeed] = useState(null);
  const [driverName, setDriverName] = useState("");
  const [routeName, setRouteName] = useState("");
  const toast = useToast();
  const location = useLocation();

  const { vehicleNumber } = location.state || {};

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Fetch Vehicle Route
  const getRoutePath = async () => {
    try {
      const result = await axios.get(`/proxy/user/get-latLng/${vehicleNumber}`);
      if (result.data) {
        setFromLocLatLng(result.data.fromLoc);
        setMidLocLatLng(result.data.midPointLoc);
        setToLocLatLng(result.data.toLoc);
      }
    } catch (error) {
      console.error("Error fetching route path:", error);
    }
  };

  // Fetch Vehicle Live Data
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(
        `/proxy/user/live-track-vehicle/${searchText}`
      );
      if (result.data) {
        setLatitude(result.data.latitude);
        setLongitude(result.data.longitude);
        setTime(result.data.time);
        setVehicleNumber(result.data.vehicleNumber);
        setSpeed(result.data.speed);
        setDriverName(result.data.driverName);
        toast({
          title: result.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error fetching live location.",
        description: error.response?.data?.msg || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Live Update Simulation (Replace with WebSocket for real use)
  useEffect(() => {
    const interval = setInterval(() => {
      if (vehicleNumber) {
        axios
          .get(
            `/proxy/user/live-track-vehicle/${
              vehicleNumber || vehicleNumberSearch
            }`
          )
          .then((res) => {
            setLatitude(res.data.latitude);
            setLongitude(res.data.longitude);
            setTime(res.data.time);
            setSpeed(res.data.speed);
          })
          .catch((err) => console.error("Error updating live location:", err));
      }
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [vehicleNumber]);

  // Load route data when vehicle number changes
  useEffect(() => {
    if (vehicleNumber) {
      getRoutePath();
    }
  }, [vehicleNumber]);

  return (
    <div className="flex">
      <NavbarLeftSide />
      <div
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
          flex: 1,
        }}
      >
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "white",
            borderRadius: "8px",
            padding: "10px 16px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Vehicle Number"
            value={searchText}
            onChange={handleSearchChange}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              flex: 1,
            }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Track
          </button>
        </form>
        {vehicleNumber && (
          <div
            style={{
              border: "1px solid #ccc",
              flex: 1,
              position: "absolute",
              top: "10px",
              left: "89%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              padding: "10px 16px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "200px",

              color: "black",
            }}
          >
            <span>Vehicle Number: {vehicleNumber || "N/A"}</span>
            <span>Speed: {speed || "N/A"}</span>
            <span>Driver: {driverName || "N/A"}</span>
            <span>Last Update: {time || "N/A"}</span>
            <span>Route: {routeName || "N/A"}</span>
          </div>
        )}

        {/* Map Container */}
        <MapContainer
          center={initialCoords}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <FlyToLocation
            coords={latitude && longitude ? [latitude, longitude] : null}
          />

          {/* Vehicle Marker */}
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={vehicleMarkerIcon}>
              <Popup>
                <strong>Vehicle: {vehicleNumber || "N/A"}</strong>
                <br />
                Speed: {speed || "N/A"} km/h
                <br />
                Driver: {driverName || "N/A"}
                <br />
                Last Updated: {time || "N/A"}
              </Popup>
            </Marker>
          )}

          {/* Route Markers */}
          {fromLocLatLng.length > 0 && (
            <Marker
              position={[fromLocLatLng[1], fromLocLatLng[0]]}
              icon={startMarkerIcon}
            >
              <Popup>Start Point</Popup>
            </Marker>
          )}
          {midLocLatLng.length > 0 && (
            <Marker
              position={[midLocLatLng[1], midLocLatLng[0]]}
              icon={midMarkerIcon}
            >
              <Popup>Midpoint</Popup>
            </Marker>
          )}
          {toLocLatLng.length > 0 && (
            <Marker
              position={[toLocLatLng[1], toLocLatLng[0]]}
              icon={destinationMarkerIcon}
            >
              <Popup>Destination</Popup>
            </Marker>
          )}

          {/* Route Path */}
          {fromLocLatLng.length > 0 &&
            midLocLatLng.length > 0 &&
            toLocLatLng.length > 0 && (
              <Polyline
                positions={[
                  [fromLocLatLng[1], fromLocLatLng[0]],
                  [midLocLatLng[1], midLocLatLng[0]],
                  [toLocLatLng[1], toLocLatLng[0]],
                ]}
                color="blue"
                weight={5}
              />
            )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
