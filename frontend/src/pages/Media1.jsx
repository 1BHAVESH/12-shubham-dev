import React, { useState } from "react";
import OtherHeroImage from "@/components/OtherHeroImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import shubhVillaHero from "../assets/subh_villa_media_post.jpeg";
import { useGetAllPostsQuery } from "@/redux/features/adminApi";

const API_URL=import.meta.env.VITE_API_URL ||" http://localhost:3001/"


const mediaData = [
  {
    id: 1,
    date: "08 Nov 2025",
    paper: "Subh Villa",
    year: "2025",
    month: "November",
    imag: shubhVillaHero,
  },
];

const Media = () => {
  const { data, isLoading } = useGetAllPostsQuery();

  const [visible, setVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("All");

  const filteredData = mediaData.filter(
    (item) => item.year === year && (month === "All" || item.month === month)
  );
  if (isLoading) return <h1>wait...</h1>;

    const filteredDattaa = data.data.filter(
    (item) => item.year === year && (month === "All" || item.month === month)
  );

  const reciveData = data?.data || [];

  console.log("#######",reciveData)
  console.log("filteredDattaa",filteredDattaa);

  console.log("filteredData",filteredData);

  const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <div>
      {/* HERO */}
      <div className="">
        <OtherHeroImage visible={visible} setVisible={setVisible} />
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg">
            Media
          </h2>
          <div className="flex items-center justify-center mt-3 mx-auto max-w-[200px] sm:max-w-[300px]">
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            ></div>
            <div className="h-[1px] sm:h-[2px] bg-white flex-grow mx-2"></div>
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      {/* <div className="max-w-7xl mx-auto px-4 mt-10 flex flex-wrap gap-4 justify-end">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          <option>2025</option>
          <option>2024</option>
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          <option>All</option>
          <option>October</option>
          <option>November</option>
        </select>
      </div> */}

      {/* MEDIA GRID */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {reciveData.map((item) => (
          <div key={item._id} className="space-y-3">
            <p className="text-sm text-gray-500">{formatDate(item.publishDate)}</p>
            <h3 className="text-lg font-semibold">{item.title}</h3>

            <div
              className="cursor-pointer overflow-hidden border"
              onClick={() => setSelectedImage(`${API_URL}/uploads/${item.image}`)}
            >
              <img
                src={`${API_URL}/uploads/${item.image}`}
                alt={item.paper}
                className="w-full h-[400px] hover:scale-105 transition"
              />
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          {/* ❌ CLOSE BUTTON */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
          >
            ✕
          </button>

          {/* IMAGE */}
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[90%] max-h-[85vh] object-contain rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Media;
