import HeroImage from '@/components/HeroImage'
import OtherHeroImage from '@/components/OtherHeroImage'
import React, { useState } from 'react'

const JoinVenture = () => {
    const [visible, setVisible] = useState(true)
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <OtherHeroImage visible={visible} setVisible={setVisible}/>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className={`${visible ? "absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] text-center w-full px-4 pointer-events-none" : "hidden"}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg">
            Joint Venture
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

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Title Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Joint Venture Opportunities for Landowners
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className="w-8 sm:w-10 md:w-12 h-[2px] sm:h-[3px] bg-black"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rotate-45"></div>
            <div className="w-8 sm:w-10 md:w-12 h-[2px] sm:h-[3px] bg-black"></div>
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-700 mb-4 sm:mb-6 px-4">
            Transform Your Property into a Thriving Development
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Explore the immense potential of your land through a strategic Joint Venture. Partnering with an experienced developer can unlock substantial benefits for you.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-4">
            Benefit of The JV to The Land Owner
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Benefit 1 - Value Unlocking */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 10 L30 25 L30 45 L50 60 L70 45 L70 25 Z" fill="none" stroke="black" strokeWidth="2"/>
                  <circle cx="50" cy="35" r="8" fill="none" stroke="black" strokeWidth="2"/>
                  <path d="M20 70 Q30 65 40 70 T60 70" fill="none" stroke="black" strokeWidth="2"/>
                  <path d="M25 75 L35 85" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Value Unlocking of Your Property</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Transform land into a valuable asset, enhancing worth.
              </p>
            </div>

            {/* Benefit 2 - Liquidation */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="35" r="15" fill="none" stroke="black" strokeWidth="2"/>
                  <text x="50" y="42" fontSize="16" textAnchor="middle" fill="black">$</text>
                  <path d="M35 55 L25 65 M50 55 L50 65 M65 55 L75 65" stroke="black" strokeWidth="2"/>
                  <path d="M20 70 Q30 65 40 70" fill="none" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Liquidation of the Asset</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Convert land to liquid assets, without selling independently.
              </p>
            </div>

            {/* Benefit 3 - Leverage Developer Expertise */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="40" cy="40" r="12" fill="none" stroke="black" strokeWidth="2"/>
                  <circle cx="70" cy="45" r="8" fill="none" stroke="black" strokeWidth="2"/>
                  <text x="70" y="50" fontSize="12" textAnchor="middle" fill="black">$</text>
                  <rect x="25" y="60" width="50" height="8" fill="none" stroke="black" strokeWidth="2"/>
                  <line x1="50" y1="68" x2="50" y2="80" stroke="black" strokeWidth="2"/>
                  <line x1="40" y1="80" x2="60" y2="80" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Leverage Developer Expertise</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Gain from planning, development, marketing, and sales experience.
              </p>
            </div>

            {/* Benefit 4 - Share in Market Upsides */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="35" cy="50" r="10" fill="none" stroke="black" strokeWidth="2"/>
                  <rect x="55" y="35" width="30" height="35" fill="none" stroke="black" strokeWidth="2"/>
                  <polyline points="65,55 70,50 75,55" fill="none" stroke="black" strokeWidth="2"/>
                  <line x1="55" y1="45" x2="85" y2="45" stroke="black" strokeWidth="1"/>
                  <line x1="55" y1="55" x2="85" y2="55" stroke="black" strokeWidth="1"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Share in Market Upsides</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Capitalise on market trends and maximise returns.
              </p>
            </div>

            {/* Benefit 5 - Navigate Regulations */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="30" y="25" width="40" height="50" fill="none" stroke="black" strokeWidth="2"/>
                  <line x1="35" y1="35" x2="45" y2="35" stroke="black" strokeWidth="2"/>
                  <line x1="35" y1="45" x2="45" y2="45" stroke="black" strokeWidth="2"/>
                  <line x1="35" y1="55" x2="45" y2="55" stroke="black" strokeWidth="2"/>
                  <circle cx="60" cy="50" r="8" fill="none" stroke="black" strokeWidth="2"/>
                  <polyline points="57,50 59,52 63,48" fill="none" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Navigate Regulations with Ease</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Ensure compliance with regulatory and legal requirements.
              </p>
            </div>

            {/* Benefit 6 - Mitigate Development Risks */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 30 Q35 40 35 55 Q35 70 50 75 Q65 70 65 55 Q65 40 50 30 Z" fill="none" stroke="black" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="8" fill="none" stroke="black" strokeWidth="2"/>
                  <circle cx="50" cy="65" r="3" fill="black"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Mitigate Development Risks</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Developer handles development and sales responsibilities effectively.
              </p>
            </div>

            {/* Benefit 7 - Be Part of Creating Landmarks */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="35" y="45" width="30" height="30" fill="none" stroke="black" strokeWidth="2"/>
                  <polyline points="35,45 50,30 65,45" fill="none" stroke="black" strokeWidth="2"/>
                  <rect x="45" y="55" width="10" height="20" fill="none" stroke="black" strokeWidth="2"/>
                  <line x1="40" y1="55" x2="40" y2="60" stroke="black" strokeWidth="2"/>
                  <line x1="60" y1="55" x2="60" y2="60" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Be Part of Creating Landmarks</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Contribute to iconic developments that define skylines.
              </p>
            </div>

            {/* Benefit 8 - Enhance Lifestyles and Communities */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="25" y="50" width="20" height="25" fill="none" stroke="black" strokeWidth="2"/>
                  <polyline points="25,50 35,40 45,50" fill="none" stroke="black" strokeWidth="2"/>
                  <rect x="55" y="50" width="20" height="25" fill="none" stroke="black" strokeWidth="2"/>
                  <polyline points="55,50 65,40 75,50" fill="none" stroke="black" strokeWidth="2"/>
                  <circle cx="35" cy="30" r="5" fill="none" stroke="black" strokeWidth="2"/>
                  <circle cx="65" cy="30" r="5" fill="none" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Enhance Lifestyles and Communities</h3>
              <div className="w-10 sm:w-12 h-1 bg-black mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Create quality living spaces that improve community life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinVenture