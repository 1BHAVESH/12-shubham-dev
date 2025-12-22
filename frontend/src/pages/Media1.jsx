import React, { useState, useMemo } from "react";
import OtherHeroImage from "@/components/OtherHeroImage";
import { useGetAllPostsQuery } from "@/redux/features/adminApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Media = () => {
  const { data, isLoading } = useGetAllPostsQuery({
    isActive: true, // 🔥 sirf active media
  });

  const [visible, setVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const mediaPosts = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <h1 className="text-center py-20">Please wait...</h1>;
  }

  return (
    <div>
      
     {/* Hero Section */}
           <div className="relative">
             <OtherHeroImage />
             <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-wide text-white drop-shadow-2xl mb-4">
                 Media
               </h1>
               <div className="flex items-center justify-center mt-4 mx-auto max-w-[300px]">
                 <div
                   className="w-3 h-3 bg-white/90"
                   style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                 />
                 <div className="h-[2px] bg-white/90 flex-grow mx-2" />
                 <div
                   className="w-3 h-3 bg-white/90"
                   style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                 />
               </div>
             </div>
           </div>

      {/* MEDIA GRID */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {mediaPosts.map((item) => (
          <div key={item._id} className="space-y-3">
            <p className="text-sm text-gray-500">
              {formatDate(item.publishDate)}
            </p>

            <h3 className="text-lg font-semibold">{item.title}</h3>

            <div
              className="cursor-pointer overflow-hidden border"
              onClick={() =>
                setSelectedImage(`${API_URL}/uploads/${item.image}`)
              }
            >
              <img
                src={`${API_URL}/uploads/${item.image}`}
                alt={item.title}
                className="w-full h-[400px] object-contain hover:scale-105 transition"
              />
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute cursor-pointer top-5 right-5 text-white text-3xl font-bold"
          >
            ✕
          </button>

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
