import React from "react";
import SlideOne from "../assets/images/slide-1.jpg";
import SlideTwo from "../assets/images/slide-2.jpg";
import SlideThree from "../assets/images/slide-3.jpg";
import SlideFour from "../assets/images/slide-4.jpg";
import Location from "../assets/images/location.jpg";
import Booking from "../assets/images/booking.jpg";
import Chat from "../assets/images/live-chat.jpg";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import swiper auto play
import "swiper/css/autoplay";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import FeaturesCard from "./FeaturesCard";
import { Link, useParams } from "react-router-dom";

function HeroSection() {
  const { id } = useParams();
  
  return (
    <>
      <div className="relative h-[100vh] mt-0 overflow-hidden">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="h-full"
        >
          <SwiperSlide>
            <img src={SlideOne} className="h-full w-full object-cover" alt="Slide 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SlideTwo} className="h-full w-full object-cover" alt="Slide 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SlideThree} className="h-full w-full object-cover" alt="Slide 3" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SlideFour} className="h-full w-full object-cover" alt="Slide 4" />
          </SwiperSlide>

          {/* Overlay with subtle opacity */}
          <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

          {/* Hero Text */}
          <p className="absolute top-40 md:top-56 z-20 left-16 text-5xl md:text-5xl font-bold text-white leading-tight">
            Public Shuttle Service
          </p>
          <p className="absolute top-56 md:top-72 z-20 left-16 text-lg md:text-md font-normal text-white max-w-lg">
            Welcome to public shuttle service app, Book Your Journey Today and Enjoy Your Ride with Comfort and Safety
          </p>

          {/* Login/Signup Button */}
          {id ? null : (
            <Link to="/login">
              <button className="bg-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300 ease-in-out w-44 h-12 z-20 absolute top-96 left-16 transform hover:scale-105">
                Login / Signup
              </button>
            </Link>
          )}
        </Swiper>
      </div>

      {/* Feature Cards */}
      <div className="flex justify-center items-center space-x-6 pt-16">
        <FeaturesCard
          Image={Location}
          BtnText={"Live Tracking"}
          navigateTo={"/live-tracking"}
        />
        <FeaturesCard
          Image={Booking}
          BtnText={"Bus Booking"}
          navigateTo={`/display-all-route/${id}`}
        />
        <FeaturesCard Image={Chat} BtnText={"Live Chat"} />
      </div>

      {/* Custom Styles for Navigation Arrows */}
      <style jsx>{`
        .swiper-button-next, 
        .swiper-button-prev {
          
          color: white;
          border-radius: 50%;
          padding: 10px;
          z-index: 30;
        }
        .swiper-button-next:hover, 
        .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.6); /* Darker on hover */
        }
      `}</style>
    </>
  );
}

export default HeroSection;
