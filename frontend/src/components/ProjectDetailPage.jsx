import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EnquiryDialog from "@/components/EnquiryDialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  Waves,
  Baby,
  Flower2,
  Dumbbell,
  PartyPopper,
  Coffee,
  Route,
  PlayCircle,
  Tent,
  Armchair,
  Wind,
  Trees,
  Car,
  Shield,
  Wifi,
  Zap,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:3001";

const iconMap = {
  Waves,
  Baby,
  Flower2,
  Dumbbell,
  PartyPopper,
  Coffee,
  Route,
  PlayCircle,
  Tent,
  Armchair,
  Wind,
  Trees,
  Car,
  Shield,
  Wifi,
  Zap,
  Home,
};

const getIconComponent = (iconName) => {
  return iconMap[iconName] || Home;
};

const getFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

export default function ProjectDetailPage({ project, isLoading, error }) {
  const [activeTab, setActiveTab] = useState("Master Plan");
  const [swiperOpen, setSwiperOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const tabs = [
    "Overview",
    "Amenities",
    "Layout Plans",
    "Location",
    "Image Gallery",
  ];
  const plan = ["Master Plan", "Floor Plan"];

  const openSwiper = (index) => {
    setStartIndex(index);
    setSwiperOpen(true);
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSwiperOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2AB48]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load project details.</p>
      </div>
    );
  }

  const galleryImages = project.galleryImages?.map(getFileUrl) || [];
  const amenities = project.amenities || [];
  const highlights = project.highlights || [];
  const nearbyLocations = project.nearbyLocations || [];

  return (
    <>
      {/* VIDEO/IMAGE SECTION */}
      <section className="relative w-full h-[450px] md:h-[520px] overflow-visible">
        {project.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getFileUrl(project.videoUrl)} type="video/mp4" />
          </video>
        ) : (
          <img
            src={getFileUrl(project.imageUrl)}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-white text-3xl md:text-[40px] font-extrabold">
            {project.title}
          </h1>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <section
        id="overview"
        className="max-w-[1140px] mx-auto px-4 md:px-6 mt-[50px]"
      >
        <div className="text-center mb-10">
          <h2 className="text-[32px] text-[#D2AB48] font-semibold">Overview</h2>
          <div className="flex items-center justify-center">
            <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
            <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
            <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
          </div>
          <p className="text-[20px] mt-[10px] font-medium">
            {project.tagline || "The address of royal living"}
          </p>
        </div>

        <div className="max-w-[1370px] grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-[16px] font-normal leading-6 text-justify">
              {project.description}
            </p>

            {project.contactNumber && (
              <p className="text-[16px] font-normal leading-6 text-justify mt-4">
                To know more about this project, please contact
                <Link
                  href={`tel:${project.contactNumber}`}
                  className="text-[#D2AB48] font-semibold underline mx-1"
                >
                  {project.contactNumber}
                </Link>
                and plan your site visit to experience the project.
              </p>
            )}
            

            {project.priceSheetUrl && (
              <>
                <div className="mt-6">
                  <button
                    className="bg-[#D2AB48] cursor-pointer hover:bg-[#b6903d] text-white font-semibold px-6 py-2 rounded-md transition-colors duration-300"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = getFileUrl(project.priceSheetUrl);
                      link.download = "price-sheet.pdf";
                      link.click();
                    }}
                  >
                    Download Price Sheet
                  </button>
                </div>
              </>
            )}

            

            {highlights.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 sm:gap-12 mt-12">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start leading-tight"
                  >
                    <p className="font-semibold text-[14px]">
                      {highlight.title}
                    </p>
                    <p className="text-[13px] text-gray-600">
                      {highlight.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {project.overviewImageUrl && (
            <img
              src={getFileUrl(project.overviewImageUrl)}
              alt="Overview Project"
              className="w-full h-[350px] rounded-xl object-cover"
            />
          )}
        </div>
      </section>

      {/* AMENITIES SECTION */}
      {amenities.length > 0 && (
        <section className="mt-10">
          <div className="text-center mb-10 bg-white">
            <h2 className="text-[32px] text-[#D2AB48] font-semibold">
              Amenities
            </h2>
            <div className="flex items-center justify-center">
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
              <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
            </div>
            <p className="text-[20px] mt-[10px] font-medium">
              The beauty lies in little detail
            </p>
          </div>
          <div className="bg-black p-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {amenities.map((amenity, index) => {
                  const Icon = getIconComponent(amenity.icon);
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center gap-4"
                    >
                      <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                        <Icon
                          size={32}
                          strokeWidth={2}
                          className="text-black"
                        />
                      </div>
                      <span className="text-white text-sm font-medium leading-snug">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LAYOUT PLANS SECTION */}
      {(project.masterPlanImageUrl || project.floorPlanImageUrl) && (
        <section id="Layout Plans" className="w-full mt-[30px]">
          <div className="text-center mb-10">
            <h2 className="text-[32px] text-[#D2AB48] font-semibold">
              Layout Plans
            </h2>
            <div className="flex items-center justify-center">
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
              <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
            </div>
            <div className="flex items-center justify-center mt-1 gap-6">
              {plan.map((item, index) => {
                const hasImage =
                  (item === "Master Plan" && project.masterPlanImageUrl) ||
                  (item === "Floor Plan" && project.floorPlanImageUrl);
                if (!hasImage) return null;
                return (
                  <p
                    key={index}
                    onClick={() => setActiveTab(item)}
                    className={`font-bold text-[20.06px] cursor-pointer  
                      ${
                        activeTab === item
                          ? "text-[#D2AB48] underline underline-offset-4"
                          : "text-black"
                      }
                      hover:text-[#D2AB48]`}
                  >
                    {item}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="w-full py-12 bg-[#FFF9EA]">
            <div className="max-w-[1140px] mx-auto px-4">
              <img
                src={getFileUrl(
                  activeTab === "Master Plan"
                    ? project.masterPlanImageUrl
                    : project.floorPlanImageUrl
                )}
                alt="Layout Plan"
                className="w-full rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      {project.buildingImageUrl && (
        <section className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center overflow-hidden">
          <img
            src={getFileUrl(project.buildingImageUrl)}
            alt="Building"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0"></div>
          <div className="relative text-center max-w-[700px] mx-auto px-4">
            <h3 className="text-white text-[26px] md:text-[32px] font-bold leading-tight">
              Shubham Developers – Crafting Spaces, Creating Trust
            </h3>
            <p className="text-white mt-4 text-[16px] md:text-[18px] leading-relaxed">
              With a strong vision of quality construction and customer
              satisfaction, Shubham Developers delivers modern residential &
              commercial projects that bring comfort, luxury, and a premium
              lifestyle together.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-6 cursor-pointer bg-[#D2AB48] px-4 py-2 text-black w-[140px] rounded-md font-semibold hover:bg-[#b89434] transition">
                  Enquiry
                </button>
              </DialogTrigger>
              <DialogContent className="[&>button]:cursor-pointer">
                <EnquiryDialog />
              </DialogContent>
            </Dialog>
          </div>
        </section>
      )}

      {/* LOCATION SECTION */}
      {(project.address ||
        project.mapEmbedUrl ||
        nearbyLocations.length > 0) && (
        <section id="Location" className="w-full mt-10">
          <div className="text-center mb-10">
            <h2 className="text-[32px] text-[#D2AB48] font-semibold">
              Location
            </h2>
            <div className="flex items-center justify-center">
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
              <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
            </div>
            <p className="text-[20px] mt-[10px] font-medium">
              LOCATION BENEFITS & TOP REASONS TO INVEST
            </p>
          </div>
          <section className="w-full bg-white py-16">
            <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-[#FFF7E6] rounded-2xl p-8 shadow-md">
                <div className="max-w-[400px] mx-10">
                  {project.logoUrl && (
                    <img
                      src={getFileUrl(project.logoUrl)}
                      alt={project.title}
                      className="w-[132px] h-[56px] mb-4 object-contain"
                    />
                  )}
                  {project.address && (
                    <p className="text-gray-700 leading-6">
                      "{project.address}"
                    </p>
                  )}
                  {nearbyLocations.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">
                        Near By Locations
                      </h3>
                      <ul className="space-y-2">
                        {nearbyLocations.map((place, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center text-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <span>→</span> {place.name}
                            </div>
                            <p>{place.distance}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              {project.mapEmbedUrl && (
                <div className="w-auto h-[200px] sm:w-[554px] sm:h-[536px] rounded-2xl overflow-hidden shadow-md">
                  <iframe
                    src={project.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen=""
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </div>
          </section>
        </section>
      )}

      {/* IMAGE GALLERY SECTION */}
      {galleryImages.length > 0 && (
        <section id="Image Gallery">
          <div className="text-center mb-10">
            <h2 className="text-[32px] text-[#D2AB48] font-semibold">
              Image Gallery
            </h2>
            <div className="flex items-center justify-center">
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
              <div className="w-[208px] h-[3px] bg-[#D2AB48]"></div>
              <div className="w-3 h-[10px] bg-[#D2AB48] rotate-45"></div>
            </div>
            <p className="text-[20px] mt-[10px] font-medium">
              {project.tagline || "The address of royal living"}
            </p>
          </div>
          <section className="max-w-[1140px] mx-auto px-4 md:px-6 my-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  onClick={() => openSwiper(index)}
                  className="rounded-xl shadow-md w-full h-[220px] object-cover cursor-pointer hover:scale-105 transition duration-300"
                />
              ))}
            </div>
          </section>

          {swiperOpen && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-0"
              onClick={() => setSwiperOpen(false)}
            >
              <div
                className="relative bg-black rounded-xl shadow-xl w-[50vw] h-[50vh] flex items-center justify-center p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSwiperOpen(false);
                  }}
                  className="cursor-pointer hover:border-2 hover:border-yellow-300 absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full z-[100] text-lg"
                >
                  ✕
                </button>
                <div className="w-full h-full pointer-events-auto [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden md:[&_.swiper-button-next]:block md:[&_.swiper-button-prev]:block [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white">
                  <Swiper
                    initialSlide={startIndex}
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full h-full"
                  >
                    {galleryImages.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="flex justify-center items-center w-full h-full pointer-events-auto p-4 sm:p-12">
                          <img
                            src={img}
                            className="max-w-full max-h-full object-contain"
                            alt={`Gallery image ${i + 1}`}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
