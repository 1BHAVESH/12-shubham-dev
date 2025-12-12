// components/About.jsx

import { useGetHomePageQuery } from "@/redux/features/homePageApi";
import hero from "../assets/Screenshot.png";
import chairman from "../assets/chairman.png";
import { da } from "zod/v4/locales";

const API_URL=import.meta.env.VITE_API_URL ||" http://localhost:3001/"

export default function About() {
  const {data, isLoading} = useGetHomePageQuery()

  if(isLoading) return <h1>wait...</h1>

  const homePageAbout = data?.about

   //console.log(homePageAbout)

  //  console.log(`${API_URL}${data.about.image}`)

  return (
 <section className="max-w-[1370px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    {/* 🟢 TEXT FIRST FOR MOBILE, SECOND FOR DESKTOP */}
    <div className="flex flex-col justify-center order-1 lg:order-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-[2px] bg-[#d4af37]"></div>
        <p className="font-serif text-[18px] font-bold tracking-wide">
          About us
        </p>
      </div>

      <h2 className="text-[28px] sm:text-[32px] font-semibold text-gray-800 mb-6">
       {homePageAbout.title ? homePageAbout.title : "hi"}
      </h2>

      <p className="text-[15px] leading-relaxed font-sans text-justify text-gray-700">
        {homePageAbout.description ? homePageAbout.description : "hi"}
      </p>
    </div>

    {/* 🟢 IMAGE SECOND FOR MOBILE, FIRST FOR DESKTOP */}
    <div className="w-full order-2 lg:order-1">
      <img
        src={`${API_URL}${data.about.image}`}
        alt="Subham Developers"
        className="rounded-xl shadow-md w-full h-[250px] sm:h-[366px] object-cover"
      />
    </div>
  </div>

</section>
  );
}
