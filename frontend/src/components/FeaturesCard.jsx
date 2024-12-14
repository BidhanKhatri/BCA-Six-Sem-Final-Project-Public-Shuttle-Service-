import React from "react";
import { Link } from "react-router-dom";

function FeaturesCard({ Image, BtnText, navigateTo }) {
  return (
    <div className="w-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out my-4 bg-white  border border-gray-400/60 -mt-60 z-30 mx-2">
      <div className="p-6 h-72">
        <img className="w-full h-full" src={Image} />
      </div>

      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2 text-gray-800">
          <Link to={navigateTo}>
            <button className="bg-blue-500 w-full p-2 rounded-md text-white">
              {BtnText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturesCard;
