import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faCamera,
  faWater,
  faVideo,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

const Amenities = () => {
  const amenities = [
    { text: "Ample Parking Space", icon: faCar },
    { text: "Beautiful Landscaping", icon: faCamera },
    { text: "Rain Water Harvesting System", icon: faWater },
    { text: "Adequate Water Supply", icon: faWater },
    { text: "CCTV Surveillance", icon: faVideo },
    { text: "3 Tier Security", icon: faShieldHalved },
    { text: "Entry through Security Application", icon: faShieldHalved },
    { text: "Security Guards at Entry & Exit Point", icon: faShieldHalved },
  ];

  return (
    <section className="w-full py-16 bg-[#0e0e0e] bg-cover bg-center">
      <div className="max-w-[1140px] mx-auto px-4 md:px-6">

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 text-center justify-items-center">
          {amenities.map((item, index) => (
            <div key={index} className="flex flex-col items-center max-w-[145px]">
              <div className="w-[70px] h-[70px] flex items-center justify-center bg-white rounded-full cursor-pointer hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={item.icon} className="text-black text-[28px]" />
              </div>
              <p className="text-white mt-4 text-sm font-medium leading-snug">{item.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Amenities;