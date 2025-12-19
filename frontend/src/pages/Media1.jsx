import React, { useState } from "react";
import OtherHeroImage from "@/components/OtherHeroImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import shubhVillaHero from "../assets/subh_villa_media_post.jpeg";

const mediaData = [
  {
    id: 1,
    date: "08 Nov 2025",
    paper: "Subh Villa",
    year: "2025",
    month: "November",
    imag:  shubhVillaHero ,
  },
  
];

const Media = () => {
  const [visible, setVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("All");

  const filteredData = mediaData.filter(
    (item) => item.year === year && (month === "All" || item.month === month)
  );

  return (
    <div>
      {/* HERO */}
      <div className="">
        <OtherHeroImage visible={visible} setVisible={setVisible} />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
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
        {filteredData.map((item) => (
          <div key={item.id} className="space-y-3">
            <p className="text-sm text-gray-500">{item.date}</p>
            <h3 className="text-lg font-semibold">{item.paper}</h3>

            <div
              className="cursor-pointer overflow-hidden border"
              onClick={() => setSelectedImage(item.imag)}
            >
              <img
                src={item.imag}
                alt={item.paper}
                className="w-full h-[400px] hover:scale-105 transition"
              />
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl bg-black [&>button]:text-red-600 [&>button]:cursor-pointer">
          <img
            src={selectedImage}
            alt="Media Preview"
            className="w-full max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Media;
