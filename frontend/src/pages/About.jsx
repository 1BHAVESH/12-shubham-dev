import React from "react"; 
import CommomImg from "@/components/CommonBackgroundImg";
import StatsSection from "@/components/StartSection";
import AboutCard from "@/components/AboutCard";
import OurTeam from "@/components/OurTeam";
import hero1 from "../assets/Screenshot.png";
import Abtimg2 from "../assets/Gemini-the-fort.png";
import Abtimg1 from "../assets/SHUBH VILLA.jpeg";

const About = () => {
  return (
    <>
      {/* TOP BG IMAGE SECTION */}
      <CommomImg />

      {/* MAIN CONTENT SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* LEFT TEXT SECTION */}
            <div className="w-full order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-4 sm:mb-6">
                The creative force
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                  At Subham Developers, we are committed to offer the best full-service Real Estate 
                  and Infrastructure Development. We aim at fulfilling one's dream into reality with 
                  our professional approach, timely delivery and commitment to excellent service.
                  Since its inception, we have focused on creating unmatched luxury spaces with 
                  top-notch quality for our clients that surpasses our customer's aspirations. 
                  The house of Subham Developers is a blend of experience and a dedicated team 
                  to create spaces that offer natural light, air and aesthetically pleasing designs.
                  Our work doesn't end with building a home, quality check-points are installed 
                  at every level to ensure the best results. The company is setting new standards 
                  in the real estate industry by creating quality-driven projects through our 
                  client's trusts.
                </p>
                
                <p className="text-sm sm:text-base leading-relaxed text-gray-700 text-justify">
                  At Subham Developers, we are committed to offer the best full-service Real Estate 
                  and Infrastructure Development. We aim at fulfilling one's dream into reality with 
                  our professional approach, timely delivery and commitment to excellent service.
                  Since its inception, we have focused on creating unmatched luxury spaces with 
                  top-notch quality for our clients that surpasses our customer's aspirations. 
                  The house of Subham Developers is a blend of experience and a dedicated team 
                  to create spaces that offer natural light, air and aesthetically pleasing designs.
                  Our work doesn't end with building a home, quality check-points are installed 
                  at every level to ensure the best results. The company is setting new standards 
                  in the real estate industry by creating quality-driven projects through our 
                  client's trusts.
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="w-full order-1 lg:order-2 flex flex-col gap-4 sm:gap-6">
              
              {/* BIG IMAGE */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={Abtimg1}
                  className="w-full h-full object-cover"
                  alt="Subham Developers project"
                />
              </div>

              {/* SMALL IMAGES IN GRID */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={Abtimg2}
                    className="w-full h-full object-cover"
                    alt="Subham Developers project detail"
                  />
                </div>
                <div className="w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={hero1}
                    className="w-full h-full object-cover"
                    alt="Subham Developers project detail"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />
      <AboutCard />
      <OurTeam />
    </>
  );
};

export default About;