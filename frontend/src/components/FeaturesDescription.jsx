import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

function FeaturesDescription({ Title, Image, SubTitle, Description, Price, BgImage }) {
  return (
    <div className={`px-10 py-10 flex flex-col space-y-10 bg-cover bg-center bg-no-repeat relative `} style={{backgroundImage: `url(${BgImage})`}} >
      <div className="absolute inset-0 bg-black opacity-20  z-0"></div>
      <p className="font-bold text-3xl text-blue-600 relative">
        {Title}{" "}
        <span>
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      </p>

      <div className="flex justify-center items-center relative">
        <div className="bg-gray-400  flex-1 rounded-lg overflow-hidden border border-gray-400/40 shadow-lg">
          <img src={Image} alt="location" className="" />
        </div>

        <div className="flex-1 ">
          <div className="pl-20 flex flex-col space-y-2 ">
            <p className="text-2xl font-semibold">{SubTitle}</p>
            <p className="text-gray-600">
              <span>logo </span>Location
            </p>

            <p>{Description}</p>
            <p>
              From{" "}
              <span>
                <b>{Price}</b>
              </span>
            </p>
            <div className="flex justify-between items-center">
              <button className="bg-blue-500 px-4 py-2 rounded-lg text-white shadow-lg">
                See More
              </button>
              <div className="flex space-x-4">
                <button className="bg-blue-500 px-5 py-4 rounded-full text-white shadow-lg flex justify-center items-center">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="bg-blue-500 px-5 py-4 rounded-full text-white shadow-lg flex justify-center items-center">
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesDescription;
