import CommomImg from "@/components/CommonBackgroundImg";
import HeroImage from "@/components/HeroImage";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import about1 from "../assets/image 17.png";
import Contact from "@/components/Contact";
import buildingImg from "../assets/gpt-the-fort-img.png";
import buildingImg2 from "../assets/SHUBH VILLA.jpeg";
import buildingImg3 from "../assets/Screenshot_2.png";
import OtherHeroImage from "@/components/OtherHeroImage";
import MissionImg from "../assets/mission.png";
import VisionImg from "../assets/vission.png";


const AboutShubhamDeveloper = () => {
  const values = [
    {
      letter: "I",
      title: "Integrity",
      description: "Upholding the highest standards of honesty, ethics, and accountability in every action and decision we make."
    },
    {
      letter: "E",
      title: "Empathy",
      description: "Fostering genuine understanding and compassion in our relationships with colleagues, partners, and clients."
    },
    {
      letter: "Q",
      title: "Quality Centric",
      description: "Maintaining unwavering commitment to excellence in planning, execution, and delivery of every project."
    },
    {
      letter: "I",
      title: "Innovation",
      description: "Cultivating a forward-thinking culture that embraces creativity and continuous improvement."
    },
    {
      letter: "T",
      title: "Trust",
      description: "Building lasting relationships through transparency, open communication, and mutual respect."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <OtherHeroImage />
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-wide text-white drop-shadow-2xl mb-4">
            About Us
          </h1>
          <div className="flex items-center justify-center mt-4 mx-auto max-w-[300px]">
            <div
              className="w-3 h-3 bg-white/90"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            <div className="h-[2px] bg-white/90 flex-grow mx-2" />
            <div
              className="w-3 h-3 bg-white/90"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                About Subham Developers
              </h2>
              <div className="w-20 h-1 bg-[#D2AB48]" />
            </div>

            <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
              <p>
                Established in 2019, Subham Developers has earned recognition as one of Rajasthan's most respected and trusted real estate developers. With unwavering commitment to excellence, we have contributed significantly to transforming Jodhpur's skyline.
              </p>

              <p>
                Our distinguished reputation stems from our dedication to quality, innovation, and exceptional customer satisfaction. This commitment has established us as the preferred choice for discerning homebuyers and investors throughout the region.
              </p>

              <p>
                Each project represents a harmonious blend of innovative design, superior construction quality, and sustainable development practices. We ensure long-term value and satisfaction for every client who places their trust in us.
              </p>

              <p className="font-medium text-gray-900">
                With a legacy built on excellence, we continue creating properties that endure through time and foster vibrant communities for generations to come.
              </p>
            </div>
          </div>

          {/* Image Slider */}
          <div className="order-first lg:order-last">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ 
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#D2AB48]'
              }}
              autoplay={{ 
                delay: 3500,
                disableOnInteraction: false
              }}
              loop={true}
              className="w-full h-[350px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <SwiperSlide>
                <img
                  src={buildingImg}
                  className="w-full h-full object-cover"
                  alt="Subham Developers Project Showcase"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={buildingImg2}
                  className="w-full h-full object-cover"
                  alt="Luxury Real Estate Development"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={buildingImg3}
                  className="w-full h-full object-cover"
                  alt="Modern Architecture Excellence"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section with Images */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-24">
            {/* Mission */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-end gap-3 mb-6 pb-2 border-b-2 border-[#D2AB48] w-fit">
                  <span className="text-7xl lg:text-8xl font-light text-[#D2AB48] leading-none">
                    01
                  </span>
                  <span className="text-2xl lg:text-3xl font-light text-[#D2AB48] leading-none mb-2">
                    Mission
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 leading-relaxed">
                  To deliver high-quality, sustainable, and innovative real estate developments that enhance communities and enrich lives.
                </h3>
              </div>
              <div className="order-first lg:order-last">
                <div className="w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={MissionImg}
                    className="w-full h-full object-cover"
                    alt="Our Mission"
                  />
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-last lg:order-first">
                <div className="w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={VisionImg}
                    className="w-full h-full object-cover"
                    alt="Our Vision"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-end gap-3 mb-6 pb-2 border-b-2 border-[#D2AB48] w-fit">
                  <span className="text-7xl lg:text-8xl font-light text-[#D2AB48] leading-none">
                    02
                  </span>
                  <span className="text-2xl lg:text-3xl font-light text-[#D2AB48] leading-none mb-2">
                    Vision
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 leading-relaxed">
                  To transform the city landscape by crafting innovative real estate developments that elevate lifestyles and redefine the spaces where people live, work, and thrive.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <div className="flex items-center justify-center mt-4 mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#D2AB48] to-transparent" />
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The guiding principles that define our commitment to excellence and integrity in every endeavor
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D2AB48]/5 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 transition-all duration-500 group-hover:from-[#D2AB48]/10" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D2AB48] to-[#B8953D] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-md">
                    <span className="text-2xl font-bold text-white">
                      {value.letter}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#D2AB48] transition-colors duration-300">
                    {value.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <div className="flex items-center justify-center mt-4 mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#D2AB48] to-transparent" />
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Let's discuss how we can help you find your perfect property.
            </p>
          </div>
          <Contact />
        </div>
      </section>
    </div>
  );
};

export default AboutShubhamDeveloper;