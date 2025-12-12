import HeroImage from "@/components/HeroImage";
import React from "react";
import chairman from "../assets/chairman.png";
import anirudh from "../assets/anirudh.jpg"
import mahendra from "../assets/mahender-shubham-dev.jfif"
import Contact from "@/components/Contact";

const OurFounder = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <HeroImage />

      {/* Heading Overlay */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <h2 className="text-[32px] sm:text-[42px] md:text-[56px] lg:text-[64px] font-serif italic font-bold tracking-wide text-white drop-shadow-2xl">
          Our Founder
        </h2>

        <div className="flex items-center justify-center mt-4 mx-auto max-w-[320px]">
          <div
            className="w-3 h-3 bg-white/90"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
          <div className="h-[2px] bg-white/90 flex-grow mx-2"></div>
          <div
            className="w-3 h-3 bg-white/90"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
        </div>
      </div>

      {/* ================= LEADERSHIP SECTION ================= */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Leadership
          </h2>
          <div className="w-24 h-1 bg-[#D2AB48] mx-auto"></div>
        </div>

        {/* CHAIRMAN SECTION */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 hover:shadow-2xl transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* LEFT IMAGE */}
            <div className="lg:col-span-2 relative overflow-hidden bg-gray-100">
              <img
                src={chairman}
                alt="Mr. Sheshmal Sanklecha"
                className="w-full h-full object-cover min-h-[400px] lg:min-h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* RIGHT TEXT */}
            <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
              <div className="inline-block mb-3">
                <span className="text-sm font-semibold tracking-widest text-[#D2AB48] uppercase">
                  Chairman & Managing Director
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Mr. Sheshmal Sanklecha
              </h3>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                <p>
                  Mr. Sheshmal Sanklecha is the visionary Chairman and Managing Director of Subham Developers, bringing unparalleled expertise to the real estate industry. With 25 years of experience in property development and 30 years in finance, he embodies the perfect blend of strategic vision and operational excellence.
                </p>

                <p>
                  As the driving force behind The Fort—his flagship dream project for Jodhpur—Mr. Sanklecha's commitment to delivering this landmark within 30 months demonstrates his unwavering dedication, exceptional leadership, and passion for creating iconic spaces.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-[#D2AB48]">25+</p>
                  <p className="text-sm text-gray-600 mt-1">Years in Real Estate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D2AB48]">30+</p>
                  <p className="text-sm text-gray-600 mt-1">Years in Finance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MANAGING DIRECTOR SECTION */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* LEFT IMAGE */}
            <div className="lg:col-span-2 relative overflow-hidden bg-gray-100 lg:order-2">
              <img
                src={chairman}
                alt="Mr. Rahuul Sanklecha"
                className="w-full h-full object-cover min-h-[400px] lg:min-h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* RIGHT TEXT */}
            <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center lg:order-1">
              <div className="inline-block mb-3">
                <span className="text-sm font-semibold tracking-widest text-[#D2AB48] uppercase">
                  Managing Director
                </span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Mr. Rahuul Sanklecha
              </h3>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                <p>
                  Mr. Rahuul Sanklecha brings 15 years of specialized experience in real estate development and 10 years in finance to his role as Managing Director. His deep understanding of modern customer needs, combined with comprehensive industry knowledge, has enabled him to deliver exceptional high-quality projects.
                </p>

                <p>
                  His unwavering commitment to timely project delivery has become a cornerstone of customer trust and satisfaction—a principle that guides every decision and defines the company's reputation for reliability and excellence.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-[#D2AB48]">15+</p>
                  <p className="text-sm text-gray-600 mt-1">Years in Real Estate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D2AB48]">10+</p>
                  <p className="text-sm text-gray-600 mt-1">Years in Finance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= OUR TEAM SECTION ================= */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our Expert Team
            </h2>
            <div className="w-24 h-1 bg-[#D2AB48] mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals driving our success and commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {/* TEAM CARD 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={mahendra}
                  alt="Mahendra Rakhecha"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="px-6 mt-[100px]">
                <div className="mb-2">
                  <span className="text-xs font-semibold tracking-wider text-[#D2AB48] uppercase">
                    Finance Department
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Mahendra Rakhecha
                </h3>

                <p className="text-base font-semibold text-gray-600 mb-4">
                  Finance Head
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Brings over 20 years of comprehensive expertise in financial management, strategic planning, and fiscal operations.
                </p>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-[#D2AB48]">20+</span> years of experience
                  </p>
                </div>
              </div>
            </div>

            {/* TEAM CARD 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={anirudh}
                  alt="Anirudh Kakkar"
                  className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs font-semibold tracking-wider text-[#D2AB48] uppercase">
                    Sales Department
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Anirudh Kakkar
                </h3>

                <p className="text-base font-semibold text-gray-600 mb-4">
                  General Manager Sales
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Leverages 13+ years of real estate sales expertise, having collaborated with Rajasthan's most reputed builders.
                </p>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-[#D2AB48]">13+</span> years of experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Contact />
    </div>
  );
};

export default OurFounder;