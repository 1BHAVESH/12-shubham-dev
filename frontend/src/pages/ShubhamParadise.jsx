// import React, { useEffect, useState } from "react";
// import fortVideo from "../assets/LUXURY REAL ESTATE VIDEO.mp4";
// import OverviewImg from "../assets/image 2.png"; // your image here
// import Animities from "@/components/Animities";
// import masterImg from "../assets/Screenshot_6.png"; // change filename
// import floorImg from "../assets/shubham-para-floor-plan.png"; // optional future
// import buildingImg from "../assets/image 27.png";
// import arrowImg from "../assets/Frame 48.png"
// import subhamLogo from "../assets/Subham Paradise 2.png"
// import img1 from "../assets/shubham-img-1.jpeg";
// import img2 from "../assets/shubham-img-2.jpeg";
// import img3 from "../assets/shubham-img-3.jpeg";
// import img4 from "../assets/shubham-img-4.jpeg";
// import img5 from "../assets/shubham-img-5.jpeg";
// import img6 from "../assets/shubham-img-6.jpeg";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import EnquiryDialog from "@/components/EnquiryDialog";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import { X } from "lucide-react";
// import { Waves, Baby, Flower2, Dumbbell, PartyPopper, Coffee, Route, PlayCircle, Tent, Armchair, Wind } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import pdf from "../assets/Shubham Paradise Price Sheet new-2.pdf";
// import { Link } from "react-router-dom";


// const ShubhamParadise = () => {
//    const amenities = [
//     { icon: Waves, name: "Rooftop Swimming Pool" },
//     { icon: Baby, name: "Kids Pool" },
//     { icon: Flower2, name: "Yoga Lawn" },
//     { icon: Dumbbell, name: "Open Gym" },
//     { icon: PartyPopper, name: "Party Lawn" },
//     { icon: Coffee, name: "Open Lounge with Kitchen counter" },
//     { icon: Route, name: "Rooftop Walking Track" },
//     { icon: PlayCircle, name: "Children's Play Area with Sandpit" },
//     { icon: Tent, name: "Cabanas" },
//     { icon: Armchair, name: "Senior Citizen Area" },

//   ];
//   const tabs = [
//     "Overview",
//     "Amenities",
//     "Layout Plans",
//     "Location",
//     "Image Gallery",
//   ];

//    const nearbyLocations = [
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

//   const galleryImages = [
//   img1,
//   img2,
//   img3,
//   img4,
//   img5,
//   img6,
// ]; // Add more images easily!


//   const [activeTab, setActiveTab] = useState("Master Plan");
//     const [swiperOpen, setSwiperOpen] = useState(false);
//        const [startIndex, setStartIndex] = useState(0);
     
//        // Open image in fullscreen swiper
//        const openSwiper = (index) => {
//          setStartIndex(index);
//          setSwiperOpen(true);
//        };
     
//        // ESC key to close
//        useEffect(() => {
//          const handleEsc = (e) => e.key === "Escape" && setSwiperOpen(false);
//          window.addEventListener("keydown", handleEsc);
//          return () => window.removeEventListener("keydown", handleEsc);
//        }, []); // Add dialog state
     
//        const handleScroll = (sectionId) => {
//          console.log(sectionId);
//          const element = document.getElementById(sectionId);
//          if (element) {
//            element.scrollIntoView({ behavior: "smooth" });
//          }
//        };

//   return (
//     <>
//       {/* VIDEO SECTION */}
//       <section className="relative w-full h-[450px] md:h-[520px] overflow-visible">
//         {/* BACKGROUND VIDEO */}
//         <video
//           autoPlay
//           loop
          
//           playsInline
//           className="w-full h-full object-cover"
//         >
//           <source src={fortVideo} type="video/mp4" />
//         </video>

//         {/* DARK OVERLAY */}
//         <div className="absolute inset-0 bg-black/40"></div>

//         {/* HEADING */}
//         <div className="absolute inset-0 flex justify-center items-center">
//           <h1 className="text-white text-3xl md:text-[40px] font-extrabold">
//             Shubham Paradise
//           </h1>
//         </div>

//         {/* YELLOW NAVBAR (OVERLAP) */}
//         <div className="hidden absolute bottom-0 translate-y-1/2 w-full justify-center z-20">
//           <div
//             className="bg-[#D1A84F] max-w-[1140px] w-[90%] h-[72px] 
//      text-white flex items-center justify-between px-[67px]
//      rounded-2xl shadow-lg text-sm md:text-base"
//           >
//             {tabs.map((tab, index) => (
//               <div key={index} className="flex flex-row gap-6">
//                 <button
//                   key={index}
//                   onClick={() => handleScroll(tab)}
//                   className="hover:opacity-80 cursor-pointer text-[20px] font-medium transition-all duration-300"
//                 >
//                   {tab}
//                 </button>
//                 <div
//                   className={`h-8 w-[1px] bg-white ${
//                     index < 4 ? "block" : "hidden"
//                   }`}
//                 ></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* -------------------------
//           OVERVIEW SECTION
//       ------------------------- */}
//       <section
//         id="overview"
//         className="max-w-[1140px] mx-auto px-4 md:px-6 mt-[50px]"
//       >
//         {/* TITLE */}
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

//         {/* TEXT + IMAGE GRID */}
//         <div className="max-w-[1370px] grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* LEFT TEXT */}
//           <div>
//             <p className="text-[16px] font-normal leading-6 text-justify">
//               At Shubham Paradise, our constant dedication to provide unmatched
//               experiences has led us to revolutionise the art of living. Our
//               magnificent apartments are more than just rooms. They are a
//               representation of luxury, created to enhance your way of life.
//               Everything about your home is carefully chosen to give it a
//               unique, beautiful appeal from well designed interiors to
//               spectacular views that take in the entire scenery. Shubham
//               Paradise is the pinnacle of opulent existence.
//             </p>

//             <p className="text-[16px] font-normal leading-6 text-justify mt-4">
//               To know more about this project, please contact
//               <Link
//                 href="tel:9119119249"
//                 className="text-[#D2AB48] font-semibold underline mx-1"
//               >
//                 911911 9249
//               </Link>
//               and plan your site visit to experience the project.
//             </p>

//             {/* 👉 PRICE SHEET BUTTON */}
//             <div className="mt-6">
//               <button
//                 className="bg-[#D2AB48] cursor-pointer hover:bg-[#b6903d] text-white font-semibold px-6 py-2 rounded-md transition-colors duration-300"
//                 onClick={() => {
//                   const link = document.createElement("a");
//                   link.href = pdf;
//                   link.download = pdf.split("/").pop();
//                   link.click();
//                 }}
//               >
//                 Download Price Sheet
//               </button>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-12 md:gap-20 mt-12">
//               <div className="flex flex-col items-start leading-tight">
//                 <p className="font-semibold text-[14px]">2 & 3 BHK</p>
//                 <p className="text-[13px] text-gray-600">Apartments</p>
//               </div>

//               <div className="flex flex-col items-start w-[60px] leading-tight">
//                 <p className="font-semibold text-[14px]">Well Equipped</p>
//                 <p className="text-[13px] text-gray-600">Modern Gym</p>
//               </div>

//               <div className="flex flex-col items-start leading-tight">
//                 <p className="font-semibold text-[14px]">Exelusive</p>
//                 <p className="text-[13px] text-gray-600">Terrace Garden</p>
//               </div>

//               <div className="flex flex-col items-start leading-tight">
//                 <p className="font-semibold text-[14px]">Refreshing</p>
//                 <p className="text-[13px] text-gray-600">Terrace Pool</p>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT IMAGE */}
//           <img
//             src={OverviewImg}
//             alt="Overview Project"
//             className="w-full h-[350px] rounded-xl object-cover"
//           />
//         </div>

//         {/* STATS GRID */}
//       </section>
//       {/* <section id="Amenities" className="w-full  mt-[30px]">
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

        
//       </section> */}
//       {/* roof animinties */}
//       <section className="mt-10">
//       <div className="text-center mb-10 bg-white">
//               <h2 className="text-[32px] text-[#D2AB48] font-semibold">
//                 Amenities
//               </h2>
//               <div className="flex items-center justify-center">
//                 <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//                 <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
//                 <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
//               </div>
//               <p className=" text-[20px] mt-[10px] font-medium">
//                 The beauty lies in little detail
//               </p>
//             </div>
//         <div className="bg-black p-8">
//           <div className="max-w-6xl mx-auto">
           
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
//               {amenities.map((amenity, index) => {
//                 const Icon = amenity.icon;
//                 return (
//                   <div
//                     key={index}
//                     className="flex flex-col items-center text-center gap-4"
//                   >
//                     <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
//                       <Icon size={32} strokeWidth={2} className="text-black" />
//                     </div>
//                     <span className="text-white text-sm font-medium leading-snug">
//                       {amenity.name}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
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
//                 onClick={() => setActiveTab(item)} // set active tab
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
//         {/* MAIN IMAGE SECTION  */}
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

//       <section className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center overflow-hidden">
//         {/* BACKGROUND IMAGE */}
//         <img
//           src={buildingImg}
//           alt="Shubham Developers"
//           className="absolute inset-0 w-full h-full object-cover"
//         />

//         {/* DARK OVERLAY */}
//         <div className="absolute inset-0 "></div>

//         {/* TEXT + BUTTON */}
//         <div className="relative text-center max-w-[700px] mx-auto px-4">
//           <h3 className="text-white text-[26px] md:text-[32px] font-bold leading-tight">
//             Shubham Developers – Crafting Spaces, Creating Trust
//           </h3>

//           <p className="text-white mt-4 text-[16px] md:text-[18px] leading-relaxed">
//             With a strong vision of quality construction and customer
//             satisfaction, Shubham Developers delivers modern residential &
//             commercial projects that bring comfort, luxury, and a premium
//             lifestyle together.
//           </p>

//           <Dialog>
//             <DialogTrigger asChild>
//               <button className="mt-6 cursor-pointer  bg-[#D2AB48] px-4 py-2 text-black w-[140px] rounded-md font-semibold hover:bg-[#b89434] transition">
//                 Enquiry
//               </button>
//             </DialogTrigger>
//             <DialogContent className="[&>button]:cursor-pointer">
//               <EnquiryDialog />
//             </DialogContent>
//           </Dialog>
//         </div>
//       </section>

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
//             {/* LEFT BOX */}
//             <div className="bg-[#FFF7E6]  rounded-2xl p-8 shadow-md">
//               <div className="max-w-[400px] mx-10">
//                 <img
//                   src={subhamLogo} // apna logo yahan daalo
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

//                 {/* NEARBY LIST */}
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

//             {/* RIGHT SIDE GOOGLE MAP */}
//             <div className="w-auto h-[200px] sm:w-[554px] sm:h-[536px] rounded-2xl overflow-hidden shadow-md">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2303.7374330207706!2d72.9814874!3d26.270844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000"
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
//           <div className="text-center mb-6">
//             <h2 className="text-[32px] text-[#D2AB48] font-semibold">
//               Image Gallery
//             </h2>
//           </div>

//           {/* gallery grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {galleryImages.map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 onClick={() => openSwiper(index)}
//                 className="rounded-xl shadow-md w-full h-[220px] object-cover cursor-pointer hover:scale-105 transition duration-300"
//               />
//             ))}
//           </div>
//         </section>
//         {/* FULLSCREEN SWIPER (LIGHTBOX MODE) */}
//         {swiperOpen && (
//           <div
//             className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-0"
//             onClick={() => setSwiperOpen(false)}
//           >
//             <div
//               className="relative bg-black rounded-xl shadow-xl 
//              w-[50vw] h-[50vh] flex items-center justify-center p-2"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* CLOSE BUTTON */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSwiperOpen(false);
//                 }}
//                 className="cursor-pointer hover:border-2 hover:border-yellow-300 absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full z-[100] text-lg"
//               >
//                 ✕
//               </button>

//               {/* SWIPER */}
//               <div
//                 className="w-full h-full pointer-events-auto
//                [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden
//                md:[&_.swiper-button-next]:block md:[&_.swiper-button-prev]:block
//                [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white"
//               >
//                 <Swiper
//                   initialSlide={startIndex}
//                   modules={[Navigation, Pagination]}
//                   navigation
//                   pagination={{ clickable: true }}
//                   className="w-full h-full"
//                 >
//                   {galleryImages.map((img, i) => (
//                     <SwiperSlide key={i}>
//                       <div className="flex justify-center items-center w-full h-full pointer-events-auto p-4 sm:p-12">
//                         <img
//                           src={img}
//                           className="max-w-full max-h-full object-contain"
//                           alt={`Gallery image ${i + 1}`}
//                         />
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>
//     </>
//   );
// };

// export default ShubhamParadise;
