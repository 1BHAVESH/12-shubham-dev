import React from "react";
import chairman from "../assets/chairman.png";

const OurTeam = () => {
  return (
    <>
      <section className="max-w-[1370px] mx-auto py-12 px-4 md:px-6">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-[2px] bg-[#d4af37]"></div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">Our Team</p>
        </div>

        {/* Team Members */}
        <div className="space-y-10">
          
          {/* Member 1 */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Mr. Sheshmal Sanklecha</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              CMD (Chairman & Managing Director)
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-justify text-gray-700 mt-3">
              Mr. Sheshmal Sanklecha, Chairman and Managing Director of Subham Developers, is
              the visionary behind the brand’s deep-rooted understanding of the real estate
              industry. With 25 years of experience in the property business and 30 years in
              Finance, he is the driving force behind “The Fort” — his dream project to elevate
              the lifestyle of Jodhpur residents. His commitment to delivering this landmark
              project within 30 months is what truly sets him apart.
            </p>
          </div>

          {/* Member 2 */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Mr. Dhansukh Sanklecha</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium">Managing Director</p>
            <p className="text-sm sm:text-base leading-relaxed text-justify text-gray-700 mt-3">
              With 15 years in the real estate business and 10 years in finance, Mr. Dhansukh
              Sanklecha deeply understands the needs of modern customers. His dedication to
              quality and timely delivery has helped create trust among clients and set a strong
              foundation for the company.
            </p>
          </div>

          {/* Member 3 & 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Finance Head */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Mahendra Rakhecha</h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Finance Head</p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 mt-2">
                Having 20+ years of experience in the Finance field.
              </p>
            </div>

            {/* Sales Manager */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Anirudh Kakkar</h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                General Manager – Sales
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 mt-2">
                Bringing 13+ years of real estate sales experience and having worked with
                reputed builders across Rajasthan.
              </p>
            </div>

          </div>
        </div>

        {/* 👇 Team Photos Section */}
       <div className="mt-14">
  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
    Our Core Team Members
  </h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
    {[chairman, chairman, chairman, chairman, chairman].map((img, index) => (
      <div
        key={index}
        className="bg-white sm:h-[350px] rounded-xl shadow-md p-3 flex flex-col items-center text-center"
      >
        {/* Photo */}
        <img
          src={img}
          alt={`team-${index}`}
          className="w-full h-[250px] object-cover rounded-lg"
        />

        {/* Name */}
        <p className="mt-3 text-[15px] sm:text-base font-semibold text-gray-800">
          Sheshmal Sanklecha
        </p>

        {/* Role */}
        <p className="text-sm font-medium text-gray-600">Chairman</p>
      </div>
    ))}
  </div>
</div>

      </section>
    </>
  );
};

export default OurTeam;
