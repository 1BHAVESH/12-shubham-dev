// import React, { useEffect, useState } from "react";
// import shubhVilaVideo from "../assets/Shubh Villa.mp4";
// import OverviewImg from "../assets/SHUBH VILLA.jpeg";
// import Animities from "@/components/Animities";
// import masterImg from "../assets/master-plan-shubh-villa.png";
// import floorImg from "../assets/Shubh-villa-floor-plan.png";
// import buildingImg from "../assets/image 27.png";
// import arrowImg from "../assets/Frame 48.png";
// import subhamLogo from "../assets/Subham Paradise 2.png";
// import img1 from "../assets/SHUBH VILLA.jpeg";
// import img2 from "../assets/shubham-villa-2.jpeg";
// import img3 from "../assets/shubh-villa-3.jpeg";
// import img4 from "../assets/shubh-villa-4.jpeg";
// import img5 from "../assets/shubh-villa-4.jpeg";
// import img6 from "../assets/shubh-villa-4.jpeg";

// import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules"; // Import modules

// import "swiper/css";
// import "swiper/css/navigation"; // Add navigation styles
// import "swiper/css/pagination"; // Add pagination styles
// import { X } from "lucide-react";
// import EnquiryDialog from "@/components/EnquiryDialog";

// const ShubhVilla = () => {
//   const tabs = [
//     "Overview",
//     "Amenities",
//     "Layout Plans",
//     "Location",
//     "Image Gallery",
//   ];

//   const nearbyLocations = [
//     "AIIMS",
//     "National Highway",
//     "Medipluse Hospital",
//     "Indiabulls Mega Mall",
//     "Jodhpur Railway Station",
//     "Jodhpur Airport",
//     "DPS School",
//     "Lucky International School",
//     "The New High Court",
//   ];

//   const plan = ["Master Plan", "Floor Plan"];

//   const galleryImages = [img1, img2, img3, img4, img5, img6];

//   const [activeTab, setActiveTab] = useState("Master Plan");
//    const [swiperOpen, setSwiperOpen] = useState(false);
//   const [startIndex, setStartIndex] = useState(0);

//   // Open image in fullscreen swiper
//   const openSwiper = (index) => {
//     setStartIndex(index);
//     setSwiperOpen(true);
//   };

//   // ESC key to close
//   useEffect(() => {
//     const handleEsc = (e) => e.key === "Escape" && setSwiperOpen(false);
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []); // Add dialog state

//   const handleScroll = (sectionId) => {
//     console.log(sectionId);
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <>
//       {/* VIDEO SECTION */}
//       <section className="relative w-full h-[280px] md:h-[620px] overflow-visible">
//         <video
//           autoPlay
//           loop
          
//           playsInline
//           className="w-full h-full object-cover"
//         >
//           <source src={shubhVilaVideo} type="video/mp4" />
//         </video>

//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="absolute inset-0 flex justify-center items-center">
//           <h1 className="text-white text-3xl md:text-[40px] font-extrabold">
//             Shubh Villa
//           </h1>
//         </div>

//       <div className="hidden md:absolute md:bottom-0 md:translate-y-1/2 md:w-full md:flex md:justify-center md:z-20">
//   <div className="bg-[#D1A84F] max-w-[1140px] w-[90%] h-[72px] text-white flex items-center justify-between px-6 rounded-2xl shadow-lg text-sm md:text-base">
//     {tabs.map((tab, index) => (
//       <div key={index} className="flex flex-row gap-6">
//         <button
//           key={index}
//           onClick={() => handleScroll(tab)}
//           className="hover:opacity-80 cursor-pointer text-[20px] font-medium transition-all duration-300"
//         >
//           {tab}
//         </button>
//         <div
//           className={`h-8 w-[1px] bg-white ${
//             index < 4 ? "block" : "hidden"
//           }`}
//         ></div>
//       </div>
//     ))}
//   </div>
// </div>

//       </section>

//       {/* OVERVIEW SECTION */}
//       <section
//         id="overview"
//         className="max-w-[1140px] mx-auto px-4 md:px-6 mt-[50px]"
//       >
//         <div className="text-center mb-10">
//           <h2 className="text-[32px] text-[#D2AB48] font-semibold">Overview</h2>
//           <div className="flex items-center justify-center">
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//             <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//           </div>
//           <p className=" text-[20px] mt-[10px] font-medium">
//             The address of royal living
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <p className="text-[16px] font-normal leading-6 text-justify">
//               Introducing a resort-style living experience in the heart of
//               Jodhpur’s iconic Blue City. Embrace a life of luxury and lush
//               greenery, designed for those seeking a thriving lifestyle.
//               Situated in a prime location with excellent connectivity, our
//               community ensures easy access to key destinations and fosters a
//               vibrant, like-minded neighborhood. With thoughtfully planned
//               amenities and serene surroundings, every day here feels like a
//               retreat. Experience the perfect blend of comfort, elegance, and
//               modern living—where your dream lifestyle becomes your everyday
//               reality.Experience the perfect blend of comfort, elegance, and
//               modern living—where your dream lifestyle becomes your everyday
//               reality.
//             </p>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center md:text-left">
//               <div className="leading-tight">
//                 <p className="font-semibold text-[16px]">83</p>
//                 <p className="text-[13px] text-gray-600">
//                   LUXURIOUS <br /> VILLAS
//                 </p>
//               </div>

//               <div className="leading-tight">
//                 <p className="font-semibold text-[16px]">09</p>
//                 <p className="text-[13px] text-gray-600">
//                   BIGHA TOTAL <br /> LAND AREA
//                 </p>
//               </div>

//               <div className="leading-tight">
//                 <p className="font-semibold text-[16px]">03</p>
//                 <p className="text-[13px] text-gray-600">
//                   BIGHA LUSH <br /> GREEN GARDEN
//                 </p>
//               </div>

//               <div className="leading-tight">
//                 <p className="font-semibold text-[16px]">60%</p>
//                 <p className="text-[13px] text-gray-600">
//                   OPEN <br /> AREA
//                 </p>
//               </div>
//             </div>
//           </div>

//           <img
//             src={OverviewImg}
//             alt="Overview Project"
//             className="w-full h-[350px] rounded-xl object-cover"
//           />
//         </div>
//       </section>

//       <section id="Amenities" className="w-full  mt-[30px]">
//         <div className="text-center mb-10">
//           <h2 className="text-[32px] text-[#D2AB48] font-semibold">
//             Amenities
//           </h2>
//           <div className="flex items-center justify-center">
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//             <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//           </div>
//           <p className=" text-[20px] mt-[10px] font-medium">
//             The beauty lies in little detail
//           </p>
//         </div>
//         <Animities />
//       </section>

//       <section id="Layout Plans" className="w-full  mt-[30px]">
//         <div className="text-center mb-10">
//           <h2 className="text-[32px] text-[#D2AB48] font-semibold">
//             Layout Plans
//           </h2>
//           <div className="flex items-center justify-center">
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//             <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//           </div>
//           <div className="flex items-center  justify-center mt-1 gap-6">
//             {plan.map((item, index) => (
//               <p
//                 key={index}
//                 onClick={() => setActiveTab(item)}
//                 className={`font-bold text-[20.06px] cursor-pointer  
//         ${
//           activeTab === item
//             ? "text-[#D2AB48] underline underline-offset-4"
//             : "text-black"
//         }
//         hover:text-[#D2AB48]`}
//               >
//                 {item}
//               </p>
//             ))}
//           </div>
//         </div>

//         <div className="w-full py-12 bg-[#FFF9EA]">
//           <div className="max-w-[1140px] mx-auto px-4">
//             <img
//               src={activeTab === "Master Plan" ? masterImg : floorImg}
//               alt="Layout Plan"
//               className="w-full rounded-xl shadow-lg object-cover"
//             />
//           </div>
//         </div>
//       </section>

//      <section className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center overflow-hidden">
//              {/* BACKGROUND IMAGE */}
//              <img
//                src={buildingImg}
//                alt="Shubham Developers"
//                className="absolute inset-0 w-full h-full object-cover"
//              />
     
//              {/* DARK OVERLAY */}
//              <div className="absolute inset-0 "></div>
     
//              {/* TEXT + BUTTON */}
//              <div className="relative text-center max-w-[700px] mx-auto px-4">
//                <h3 className="text-white text-[26px] md:text-[32px] font-bold leading-tight">
//                  Shubham Developers – Crafting Spaces, Creating Trust
//                </h3>
     
//                <p className="text-white mt-4 text-[16px] md:text-[18px] leading-relaxed">
//                  With a strong vision of quality construction and customer
//                  satisfaction, Shubham Developers delivers modern residential &
//                  commercial projects that bring comfort, luxury, and a premium
//                  lifestyle together.
//                </p>
     
//                <Dialog>
//                  <DialogTrigger asChild>
//                    <button className="mt-6 cursor-pointer bg-[#D2AB48] px-4 py-2 text-black w-[140px] rounded-md font-semibold hover:bg-[#b89434] transition">
//                      Enquiry
//                    </button>
//                  </DialogTrigger>
//                  <DialogContent>
//                    <EnquiryDialog />
//                  </DialogContent>
//                </Dialog>
//              </div>
//            </section>
     

//       <section id="Location" className="w-full mt-10">
//         <div className="text-center mb-10">
//           <h2 className="text-[32px] text-[#D2AB48] font-semibold">Location</h2>
//           <div className="flex items-center justify-center">
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//             <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//           </div>
//           <p className=" text-[20px] mt-[10px] font-medium">
//             LOCATION BENEFITS & TOP REASONS TO INVEST
//           </p>
//         </div>
//         <section className="w-full bg-white py-16">
//           <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div className="bg-[#FFF7E6]  rounded-2xl p-8 shadow-md">
//               <div className="max-w-[400px] mx-10">
//                 <img
//                   src={subhamLogo}
//                   alt="Subham Developers"
//                   className="w-[132px] h-[56px] mb-4"
//                 />

//                 <p className="text-gray-700 leading-6">
//                   "The Fort, Basni, Opp. HDFC Bank, Near AIIMS Hospital,
//                   Jodhpur(Raj.) - 342013"
//                 </p>

//                 <h3 className="text-lg font-semibold mt-6 mb-3">
//                   Near By Locations
//                 </h3>

//                 <ul className="space-y-2">
//                   {nearbyLocations.map((place, index) => (
//                     <li
//                       key={index}
//                       className="flex justify-between items-center text-gray-700"
//                     >
//                       <div className="flex items-center gap-2">
//                         <img src={arrowImg} size={18} /> {place}
//                       </div>
//                       <p>3.5 KM</p>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="w-auto h-[200px] sm:w-[554px] sm:h-[536px] rounded-2xl overflow-hidden shadow-md">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.894429436179!2d73.000374!3d26.279652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzQ2LjgiTiA3M8KwMDAnMDIuMSJF!5e0!3m2!1sen!2sin!4v1733039844000!5m2!1sen!2sin"
//                 width="100%"
//                 height="100%"
//                 loading="lazy"
//                 allowFullScreen=""
//                 referrerPolicy="no-referrer-when-downgrade"
//               ></iframe>
//             </div>
//           </div>
//         </section>
//       </section>

//       <section id="Image Gallery">
//         <div className="text-center mb-10">
//           <h2 className="text-[32px] text-[#D2AB48] font-semibold">
//             Image Gallery
//           </h2>
//           <div className="flex items-center justify-center">
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//             <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
//             <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//           </div>
//           <p className=" text-[20px] mt-[10px] font-medium">
//             The address of royal living
//           </p>
//         </div>

//         <section className="max-w-[1140px] mx-auto px-4 md:px-6 my-16">
//         <div className="text-center mb-6">
//           <h2 className="text-[32px] text-[#D2AB48] font-semibold">Image Gallery</h2>
//         </div>

//         {/* gallery grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {galleryImages.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               onClick={() => openSwiper(index)}
//               className="rounded-xl shadow-md w-full h-[220px] object-cover cursor-pointer hover:scale-105 transition duration-300"
//             />
//           ))}
//         </div>
//       </section>
//        {/* FULLSCREEN SWIPER (LIGHTBOX MODE) */}
//   {swiperOpen && (
//   <div
//     className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-0"
//     onClick={() => setSwiperOpen(false)}
//   >
//     <div
//       className="relative bg-black rounded-xl shadow-xl 
//       w-[50vw] h-[50vh] flex items-center justify-center p-2"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* CLOSE BUTTON */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           setSwiperOpen(false);
//         }}
//         className="cursor-pointer hover:border-2 hover:border-yellow-300 absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full z-[100] text-lg"
//       >
//         ✕
//       </button>

//       {/* SWIPER */}
//       <div
//         className="w-full h-full pointer-events-auto
//         [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden
//         md:[&_.swiper-button-next]:block md:[&_.swiper-button-prev]:block
//         [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white"
//       >
//         <Swiper
//           initialSlide={startIndex}
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           className="w-full h-full"
//         >
//           {galleryImages.map((img, i) => (
//             <SwiperSlide key={i}>
//               <div className="flex justify-center items-center w-full h-full pointer-events-auto p-4 sm:p-12">
//                 <img
//                   src={img}
//                   className="max-w-full max-h-full object-contain"
//                   alt={`Gallery image ${i + 1}`}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   </div>
// )}


//       </section>
//     </>
//   );
// };

// export default ShubhVilla;