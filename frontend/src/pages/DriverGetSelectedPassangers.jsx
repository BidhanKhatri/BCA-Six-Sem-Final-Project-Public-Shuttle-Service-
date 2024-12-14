import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarLeftSide from "../components/NavbarLeftSide";
import axios from "axios";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import {
  useToast,
  Spinner,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FaExclamationTriangle } from "react-icons/fa";

const DriverGetSelectedPassengers = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { id } = useParams();

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchVehicleNumber = async () => {
    try {
      const result = await axios.get(`/proxy/driver/${id}`);
      if (result && result.data) {
        setVehicleNumber(result.data.vehicleNumber);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSelectedPassenger = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `/proxy/driver/display-selectedPassenger/${vehicleNumber}`,
        config
      );
      if (result && result.data) {
        setSelectedPassengers(result.data.data);
        setTotalPassengers(result.data.count);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (phone) => {
    try {
      const result = await axios.delete(
        `/proxy/driver/delete-single-selectedPassenger/${phone}`
      );
      if (result && result.data) {
        toast({
          title: result.data.msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        fetchSelectedPassenger();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: error.response?.data?.msg || "Error deleting passenger",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const rideCompleted = async () => {
    try {
      const result = await axios.delete(
        `/proxy/driver/delete-all-selectedPassengers/${vehicleNumber}`,
        config
      );
      if (result && result.data) {
        toast({
          title: result.data.msg,
          status: "success",
          position: "top-right",
          isClosable: true,
          duration: 3000,
        });
        fetchSelectedPassenger();
      }
    } catch (error) {
      toast({
        title: error.response?.data?.msg || "An error occurred!",
        status: "error",
        position: "top-right",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (id) fetchVehicleNumber();
  }, [id]);

  useEffect(() => {
    if (vehicleNumber) fetchSelectedPassenger();
  }, [vehicleNumber]);

  return (
    <div className="flex">
      <NavbarLeftSide />
      <Box flex="1" bg="gray.50" p={4} minH="100vh">
        {loading ? (
          <Flex justifyContent="center" alignItems="center" minH="80vh">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : totalPassengers > 0 ? (
          <Box bg="white" shadow="md" borderRadius="md" p={3}>
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Box fontSize="xl" fontWeight="bold" color="gray.700">
                  Fix Shuttle Selected Passengers
                </Box>
                <Box fontSize="md" color="gray.500">
                  Vehicle No:{" "}
                  <Badge colorScheme="blue" fontSize="lg">
                    {vehicleNumber}
                  </Badge>
                </Box>
              </Box>
              <Box>
                Total Passengers:{" "}
                <Badge colorScheme="green" fontSize="lg">
                  {totalPassengers}
                </Badge>
              </Box>
            </Flex>

            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th>Selected ID</Th>
                  <Th>Passenger Name</Th>
                  <Th>Urgency</Th>
                  <Th>Phone</Th>
                  <Th>Seat Requirement</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedPassengers.map((selPassenger) => (
                  <Tr key={selPassenger._id}>
                    <Td>{selPassenger.selectedId}</Td>
                    <Td>{selPassenger.passengerName}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          selPassenger.urgency >= 8
                            ? "green"
                            : selPassenger.urgency >= 5
                            ? "yellow"
                            : "red"
                        }
                      >
                        {selPassenger.urgency}
                      </Badge>
                    </Td>
                    <Td>{selPassenger.phone}</Td>
                    <Td>{selPassenger.seatRequirement}</Td>
                    <Td>
                      <Button
                        leftIcon={<FiTrash2 />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(selPassenger.phone)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Flex justify="space-between" align="center" mt={4}>
              <Box fontSize="sm" color="gray.500">
                Click this button only after finishing your ride.{" "}
                <Badge colorScheme="red">Important</Badge>
              </Box>
              <Button
                leftIcon={<FiCheckCircle />}
                colorScheme="green"
                onClick={rideCompleted}
              >
                Ride Completed
              </Button>
            </Flex>
          </Box>
        ) : (
          <Flex flexDir="column" align="center" justify="center" minH="80vh">
            <div className="flex flex-col justify-center items-center h-screen">
              <img
                src="https://cdn-icons-png.flaticon.com/128/14040/14040336.png"
                alt=""
                className=" mb-4 h-80 w-80 animate-pulse duration-300 ease-in-out"
              />
              <span className="text-xl flex items-center text-red-500 bg-gray-200 p-4 rounded-lg">
                <FaExclamationTriangle className="mr-2" /> No passengers
                selected yet!{" "}
              </span>
            </div>
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default DriverGetSelectedPassengers;
