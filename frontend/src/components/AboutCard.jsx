import React from "react";
import Abtimg2 from "../assets/Vector (3).png"; // small img

const AboutCard = () => {
  // 👉 Cards ka data (yahin se card banenge)
  const cards = [
    {
      id: "01",
      title: "Wide range of properties",
      desc: "At Subham Developers, we are committed to offer the best full-service Real Estate and Infrastructure Development.",
      icon: Abtimg2,
    },
    {
      id: "02",
      title: "Wide range of properties",
      desc: "At Subham Developers, we are committed to offer the best full-service Real Estate and Infrastructure Development.",
      icon: Abtimg2,
    },
    {
      id: "03",
      title: "Wide range of properties",
      desc: "At Subham Developers, we are committed to offer the best full-service Real Estate and Infrastructure Development.",
      icon: Abtimg2,
    },
  ];

  return (
    <>
     {/* FEATURE CARDS SECTION */}
<section className="max-w-[1370px] mx-auto py-8 sm:py-12 md:py-16 px-4 md:px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">

    {cards.map((item, index) => (
      <div
        key={index}
        className="
          p-4 sm:p-5 md:p-6 
          w-full 
          max-w-[280px] sm:max-w-[320px] md:max-w-[360px]
          h-auto min-h-[220px] sm:min-h-[250px] md:h-[278px]
          mx-auto
          border rounded-xl md:rounded-2xl 
          shadow-sm hover:shadow-md 
          transition-all duration-300
        "
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="
            w-[60px] h-[60px] 
            sm:w-[70px] sm:h-[70px] 
            md:w-[80px] md:h-[80px] 
            bg-black rounded-md 
            flex items-center justify-center
          ">
            <img 
              src={item.icon} 
              alt="icon" 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" 
            />
          </div>
          <p className="font-semibold text-gray-700 text-sm sm:text-base">
            {item.id}
          </p>
        </div>

        <h3 className="
          text-base sm:text-lg 
          font-semibold 
          mb-2 sm:mb-3 md:mb-4
        ">
          {item.title}
        </h3>
        
        <p className="
          text-gray-600 
          text-xs sm:text-sm 
          leading-5 sm:leading-6
        ">
          {item.desc}
        </p>
      </div>
    ))}

  </div>
</section>
    </>
  );
};

export default AboutCard;
