import React, { useState } from "react";
import { Briefcase, MapPin, Users } from "lucide-react";
import HeroImage from "@/components/HeroImage";
import { Link } from "react-router-dom";
import { useGetJobQuery } from "@/redux/features/shubamdevApi";

const jobList = [
  {
    jobTitle: "Telecaller",
    places: "Jodhpur, Pali, Pune",
    positions: 2
  },
  {
    jobTitle: "Sale Executive",
    places: "Jodhpur, Pali, Pune, Banglore, Chennai, Pune",
    positions: 5
  },
  {
    jobTitle: "Customer Relation Manager",
    places: "Jodhpur",
    positions: 2
  },
  {
    jobTitle: "H.R MANAGER",
    places: "Jodhpur",
    positions: 1
  },
];

const Careers = () => {
  const {data, isLoading} = useGetJobQuery()
  const [visible, setVisible] = useState(true)

  const jobData = data?.data ? data.data.map((job) => ({...job})) : jobList
  
  // console.log(jobData)
  return (
    <div className="min-h-screen bg-white">
      {/* PAGE HERO SECTION */}
      <div className="relative min-h-[270px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[501px]">
        <HeroImage visible={visible} setVisible={setVisible} />

        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        
        <div className={`${visible ? "absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] text-center w-full px-4 pointer-events-none" : "hidden"}`}>
          <h2 className={`${visible ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg" : "hidden"}`}>
            Careers
          </h2>
          
          <div className="flex items-center justify-center mt-3 sm:mt-4 mx-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>
            
            <div className="h-[1.5px] sm:h-[2px] bg-white flex-grow mx-2"></div>
            
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            ></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:py-16">
        {/* CURRENT OPENINGS */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 sm:mb-8 text-center sm:text-left">
          Current Openings
        </h3>

        {/* GRID OF JOBS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {jobData.map((job, index) => (
            <div
              key={index}
              className="bg-[#FFFBF2] p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-amber-100 flex flex-col"
            >
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#D2AB48] p-2 rounded-lg flex-shrink-0">
                  <Briefcase className="text-white" size={20} />
                </div>
                <h4 className="font-semibold text-base sm:text-lg text-gray-800 leading-tight">
                  {job.jobTitle}
                </h4>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="text-[#D2AB48] mt-1 flex-shrink-0" size={16} />
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {job.places}
                </p>
              </div>

              {/* POSITIONS */}
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-[#D2AB48] flex-shrink-0" size={16} />
                <p className="text-xs sm:text-sm text-gray-600">
                  {job.positions} {job.positions === 1 ? 'Position' : 'Positions'} Available
                </p>
              </div>

              {/* APPLY BUTTON */}
              <Link 
                to="tel:+917597074381"
                className="block w-full bg-[#D2AB48] hover:bg-[#C19A3A] text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base mt-auto"
              >
                Call Now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Careers;