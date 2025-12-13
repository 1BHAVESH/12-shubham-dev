import bgImg from "../assets/ChatGPt_Bg_IMG.png";
import { useState } from "react";
import { useGetHomePageQuery } from "@/redux/features/homePageApi";

import client1 from "../assets/Screenshot.png";
import client2 from "../assets/Screenshot.png";
import client3 from "../assets/Screenshot.png";
import client4 from "../assets/Screenshot.png";
import client5 from "../assets/Screenshot.png";

const people = [
  {
    img: client1,
    name: "Ali Tufan",
    role: "Product Manager",
    quote:
      "What a great experience! I attended a masterclass and it was super useful!",
  },
  {
    img: client2,
    name: "Sarah Williams",
    role: "UI/UX Designer",
    quote: "Amazing workshop! Learned a lot and improved my design skills.",
  },
  {
    img: client3,
    name: "Michael Brown",
    role: "Software Engineer",
    quote: "Very professional and well structured sessions. Highly recommend!",
  },
  {
    img: client4,
    name: "Emily Johnson",
    role: "Marketing Specialist",
    quote: "Loved the learning environment and team support!",
  },
  {
    img: client5,
    name: "David Lee",
    role: "Freelancer",
    quote: "Hands-on experience helped me a lot in real-world work.",
  },
];

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";


export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading } = useGetHomePageQuery();

  if (isLoading) return <h1 className="text-white">wait...</h1>;

  // 🔥 SAFE Dynamic Data
  const apiTestimonials = data?.testimonials || [];

  // 🔥 FINAL DATA TO USE (dynamic if available, else static fallback)
  const finalTestimonials =
    apiTestimonials.length > 0
      ? apiTestimonials.map((t) => ({
          img: t.photo,
          name: t.name,
          role: t.position,
          quote: t.message,
        }))
      : people; // static fallback

      //console.log(finalTestimonials)

      //console.log("llllllllll",apiTestimonials)

  return (
   <>
   {
    apiTestimonials.length > 0 ? ( <section
      className="relative py-8 md:py-12 text-white bg-black overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(100, 149, 237, 0.3) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">

        {/* Title */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-7 h-[4px] bg-[#d4af37]"></div>

            <p className="text-white font-semibold uppercase tracking-wider text-sm">
              Testimonials
            </p>

            <div className="w-7 h-[4px] bg-[#d4af37]"></div>
          </div>

          <h2 className="font-playfair text-[30px] md:text-[26px] font-light tracking-wide text-white">
            What Our Clients Say
          </h2>
        </div>

        {/* Quote Icon */}
        <div className="text-6xl md:text-7xl text-gray-700 leading-none mb-4">
          ❝
        </div>

        {/* Quote */}
        <p className="text-lg md:text-xl font-normal leading-relaxed mb-6 max-w-3xl mx-auto">
          {finalTestimonials[activeIndex].quote}
        </p>

        {/* Name & Role */}
        <div className="mb-6">
          <h3 className="text-xl font-bold">{finalTestimonials[activeIndex].name}</h3>
          <p className="text-sm text-gray-400">{finalTestimonials[activeIndex].role}</p>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-4 flex-wrap">
          {finalTestimonials.map((person, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
                activeIndex === index
                  ? "ring-2 ring-white scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img 
                src={`${API_URL}${person.img}`}
                alt="client"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

      </div>
    </section>) : (<>""</>)
   }
   </>
  );
}
