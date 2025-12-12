import React from "react";
import Abtimg1 from "../assets/figma_about_img.png"; // big img
import CommomImg from "@/components/CommonBackgroundImg";

const About = () => {
  return (
  <>
  {/* TOP BG IMAGE SECTION */}
  <CommomImg page="Mission & Vision" arrowSize={80} />

  {/* 01 MISSION SECTION */}
  <section className="max-w-[1370px] mx-auto py-16 px-4 lg:px-6 flex flex-col lg:flex-row gap-10 items-center">

    {/* IMAGE */}
    <div className="w-full lg:w-1/2 flex justify-center">
      <img
        src={Abtimg1}
        alt="Mission Image"
        className="rounded-xl shadow-lg w-full max-w-[595px] h-[240px] sm:h-[300px] lg:h-[400px] object-cover"
      />
    </div>

    {/* CONTENT */}
    <div className="w-full lg:mb-55 lg:w-1/2">
      <h3 className="flex items-end gap-2 mb-4 border-b-2 border-[#D2AB48] w-fit pb-1">
        <span className="text-[60px] sm:text-[80px] lg:text-[96px] font-normal text-[#D2AB48] leading-none">
          01
        </span>
        <span className="text-[18px] sm:text-[20px] lg:text-[24px] font-normal text-[#D2AB48] leading-none mb-2">
          Mission
        </span>
      </h3>

      <h4 className="text-lg lg:text-xl font-medium mb-4">
       To Deliver High Quality, Sustainable And Innovative Real Estate Developments That Enhance Communities And Enrich Lives.
      </h4>

      {/* <ul className="space-y-2 max-w-[470px] text-sm lg:text-base">
        <li>• To create high-quality and durable properties.</li>
        <li>• To develop sustainable and value-driven projects that uplift lifestyles.</li>
        <li>• To ensure reliable and timely construction in every project.</li>
        <li>• To maintain transparent and honest dealings with all clients.</li>
        <li>• To deliver exceptional service through every stage of buying and ownership.</li>
        <li>• To help every customer find the perfect space to live, invest, or grow.</li>
      </ul> */}
    </div>
  </section>

  {/* 02 VISION SECTION */}
  <section className="max-w-[1370px] mx-auto py-16 px-4 lg:px-6 flex flex-col lg:flex-row-reverse gap-10 items-center">

    {/* IMAGE */}
    <div className="w-full lg:w-1/2 flex justify-center">
      <img
        src={Abtimg1}
        alt="Vision Image"
        className="rounded-xl shadow-lg w-full max-w-[595px] h-[240px] sm:h-[300px] lg:h-[400px] object-cover"
      />
    </div>

    {/* CONTENT */}
    <div className="w-full lg:mb-50 lg:w-1/2">
      <h3 className="flex items-end gap-2 mb-4 border-b-2 border-[#D2AB48] w-fit pb-1">
        <span className="text-[60px] sm:text-[80px] lg:text-[96px] font-normal text-[#D2AB48] leading-none">
          02
        </span>
        <span className="text-[18px] sm:text-[20px] lg:text-[24px] font-normal text-[#D2AB48] leading-none mb-2">
          Vision
        </span>
      </h3>

      <h4 className="text-lg lg:text-xl font-medium mb-4">
       To Transform City Landscape By Crafting Innovative Real Estate Developments That Elevate Life Styles, Where People Live, Work, And Play.
      </h4>
{/* 
      <ul className="space-y-2 max-w-[470px] text-sm lg:text-base">
        <li>• To become a trusted leader in the real estate industry.</li>
        <li>• To shape modern, well-planned, and future-ready communities.</li>
        <li>• To deliver properties that stand the test of time.</li>
        <li>• To set new benchmarks in innovation and construction standards.</li>
        <li>• To achieve the highest level of customer satisfaction.</li>
        <li>• To uphold ethical and responsible business practices.</li>
        <li>• To build long-lasting relationships with our customers.</li>
      </ul> */}
    </div>
  </section>
</>

  );
};

export default About;
