import InsertRouteInformationPage from "./adminPages/InsertRouteInformationPage";
import MapView from "./components/MapView";
import BusBookedDetailsPage from "./pages/BusBookedDetailsPage";
// import BusBookingPage from "./pages/BusBookingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SearchRoutePage from "./pages/SearchRoutePage";
import SignupPage from "./pages/SignupPage";
import { Routes, Route } from "react-router-dom";
import DisplayRoute from "./userPages/DisplayRoute";
import DriverNotifications from "./pages/DriverNotifications";
import ShortRoute from "./userPages/ShortRoute";
import ShuttlePassengerManager from "./userPages/ShuttlePassengerManager";
import DisplayFixRoute from "./userPages/DisplayFixRoute";
import DriverSelectPassengers from "./pages/DriverSelectPassengers";
import DashboardPage from "./pages/DashboardPage";
import FixShuttleBookedDetailsPage from "./pages/FixShuttleBookedDetailsPage";
import DriverGetSelectedPassangers from "./pages/DriverGetSelectedPassangers";
import AdminLoginpage from "./adminPages/AdminLoginpage";
import CreateFixShuttle from "./adminPages/CreateFixShuttle";
import DisplayFixRouteAdmin from "./adminPages/DisplayFixRouteAdmin";
import DisplayAllDriver from "./adminPages/DisplayAllDriver";
import DisplayAllUsers from "./adminPages/DisplayAllUsers";
import PublicVehicleReq from "./adminPages/PublicVehicleReq";

//user components
const userComponets = () => {
  return <></>;
};

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:id" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/live-tracking/:id" element={<MapView />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/display-routes/:id" element={<SearchRoutePage />} />
          <Route
            path="/route/booking-details/:id"
            element={<BusBookedDetailsPage />}
          />
          <Route
            path="/insert/route"
            element={<InsertRouteInformationPage />}
          />
          <Route path="/display-all-route/:id" element={<DisplayRoute />} />
          <Route
            path="/display-driver-notifications/"
            element={<DriverNotifications />}
          />
          <Route
            path="/display-driver-notifications/:id"
            element={<DriverNotifications />}
          />
          <Route path="/diplay/short-route/:id" element={<ShortRoute />} />
          <Route
            path="/shuttle-request/"
            element={<ShuttlePassengerManager />}
          />
          <Route path="/display/fix-route/:id" element={<DisplayFixRoute />} />
          <Route
            path="/display/fix-route/passengers/:id"
            element={<DriverSelectPassengers />}
          />
          <Route path="/dashboard/:id" element={<DashboardPage />} />
          <Route
            path="/fix-shuttle/booking/:id"
            element={<FixShuttleBookedDetailsPage />}
          />
          <Route
            path="/display/selected/passengers/:id"
            element={<DriverGetSelectedPassangers />}
          />
          <Route path="/login/admin" element={<AdminLoginpage />} />
          <Route
            path="/admin/create/fix-route/:id"
            element={<CreateFixShuttle />}
          />
          <Route
            path="/admin/display-all-fix-route/:id"
            element={<DisplayFixRouteAdmin />}
          />
          <Route
            path="/admin/display-all-drivers/:id"
            element={<DisplayAllDriver />}
          />
          <Route
            path="/admin/display-all-users/:id"
            element={<DisplayAllUsers />}
          />
          <Route
            path="/admin/public-vehicle-req/:id"
            element={<PublicVehicleReq />}
          />
          <Route path="*" element={<LandingPage />} />
        </Routes>

        {/* <NavbarTopOne /> */}
        {/* <Navbar /> */}

        {/* <MapView /> */}
      </div>
    </>
  );
}

export default App;
