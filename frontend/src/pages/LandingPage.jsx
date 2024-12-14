import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesDescription from "../components/FeaturesDescription";
import Location from "../assets/images/location.jpg";
import Booking from "../assets/images/booking.jpg";
import Chat from "../assets/images/live-chat.jpg";
import Footer from "../components/Footer";
import BgImage from "../assets/images/bg-img-pshuttle.jpg"
import BgImage2 from "../assets/images/bg-2.jpg"

function LandingPage() {
  return (
    <div>
      {/* navigation bar for drivers */}
      <Navbar />
      <HeroSection />
      <FeaturesDescription
        Title={"Live Tracking"}
        Image={Location}
        SubTitle={"How Live Tracking Works?"}
        Price={"Free"}
        Description={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae temporibus perferendis porro harum ipsum, nam incidunt? Corrupti dolores nam placeat."
        }
        BgImage={BgImage2}
      />
      <FeaturesDescription
        Title={"Bus Booking"}
        Image={Booking}
        SubTitle={"How Bus Booking Works?"}
        Price={"Rs 30"}
        Description={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae temporibus perferendis porro harum ipsum, nam incidunt? Corrupti dolores nam placeat."
        }
        // BgImage={BgImage2}
      />

      <FeaturesDescription
        Title={"Live Chatting"}
        Image={Chat}
        SubTitle={"How Live Chatting Works?"}
        Price={"Free"}
        Description={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae temporibus perferendis porro harum ipsum, nam incidunt? Corrupti dolores nam placeat."
        }
        BgImage={BgImage2}
      />
      <Footer />
    </div>
  );
}

export default LandingPage;
