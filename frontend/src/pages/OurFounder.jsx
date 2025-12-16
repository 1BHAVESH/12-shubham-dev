import React from "react";
import HeroImage from "@/components/HeroImage";

// Import your images
import chairman from "../assets/chairman.png";
import anirudh from "../assets/anirudh.jpg"
import mahendra from "../assets/mahender-shubham-dev.jfif"
import OtherHeroImage from "@/components/OtherHeroImage";

const CompactFounderPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="relative">
        <OtherHeroImage />
        
        {/* Heading Overlay on Banner */}
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-wide text-white drop-shadow-2xl mb-4">
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
      </div>

      {/* Compact Leadership Grid */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {/* Two Column Leadership Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Chairman Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col">
              <div className="relative overflow-hidden bg-gray-100 h-[400px]">
                <img
                  src={chairman}
                  alt="Mr. Sheshmal Sanklecha"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold tracking-wider text-[#D2AB48] uppercase">
                  Chairman & MD
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
                  Mr. Sheshmal Sanklecha
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Visionary leader with 25 years in real estate and 30 years in finance. Driving force behind The Fort—Jodhpur's flagship project with unwavering commitment to excellence.
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold text-[#D2AB48]">25+</p>
                    <p className="text-xs text-gray-600">Years Real Estate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#D2AB48]">30+</p>
                    <p className="text-xs text-gray-600">Years Finance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Director Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex flex-col">
              <div className="relative overflow-hidden bg-gray-100 h-[400px]">
                <img
                  src={chairman}
                  alt="Mr. Rahuul Sanklecha"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold tracking-wider text-[#D2AB48] uppercase">
                  Managing Director
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
                  Mr. Rahuul Sanklecha
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  15 years in real estate and 10 years in finance expertise. Deep understanding of customer needs with unwavering commitment to timely delivery and excellence.
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold text-[#D2AB48]">15+</p>
                    <p className="text-xs text-gray-600">Years Real Estate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#D2AB48]">10+</p>
                    <p className="text-xs text-gray-600">Years Finance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Team Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-inner">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Expert Team</h2>
            <div className="w-16 h-1 bg-[#D2AB48] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
            {/* Team Member 1 - Mahendra */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 flex-shrink-0 relative overflow-hidden bg-gray-200">
                  <img
                    src={mahendra}
                    alt="Mahendra Rakhecha"
                    className="w-full h-full object-cover aspect-[3/4] sm:aspect-auto sm:h-full"
                  />
                </div>
                <div className="p-4 flex-1">
                  <span className="text-xs font-semibold text-[#D2AB48] uppercase">Finance Head</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">Mahendra Rakhecha</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    20+ years expertise in financial management and strategic planning
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs font-semibold text-[#D2AB48]">20+ years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 2 - Anirudh */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 flex-shrink-0 relative overflow-hidden bg-gray-200">
                  <img
                    src={anirudh}
                    alt="Anirudh Kakkar"
                    className="w-full h-full object-cover aspect-[3/4] sm:aspect-auto sm:h-full"
                  />
                </div>
                <div className="p-4 flex-1">
                  <span className="text-xs font-semibold text-[#D2AB48] uppercase">GM Sales</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">Anirudh Kakkar</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    13 + years of experience in Real estate sales and worked with reputed builders of rajasthan
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs font-semibold text-[#D2AB48]">13+ years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Contact CTA */}
      {/* <div className="bg-gradient-to-r from-[#D2AB48] to-[#C49B38] py-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Connect?</h3>
          <p className="text-white/90 mb-4">Get in touch with our team today</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Contact Us
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default CompactFounderPage;