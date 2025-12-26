import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProjectsQuery } from "@/redux/features/adminApi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EnquiryDialog from "@/components/EnquiryDialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import buildingImg from "../assets/image 27.png";
import arrowImg from "../assets/Frame 48.png";
import subhamLogo from "../assets/Subham Paradise 2.png";
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
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";
import { useGetProjectByIdQuery } from "@/redux/features/shubamdevApi";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";

const ProjectDetail = () => {
  const { id } = useParams();
  const {data: projectxData, isLoading: isLoadingx} = useGetProjectByIdQuery(id)

  // ALL STATE HOOKS
  const [activeTab, setActiveTab] = useState("Master Plan");
  const [swiperOpen, setSwiperOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("Overview");

  const tabs = [
    "Overview",
    "Amenities",
    "Layout Plans",
    "Location",
    "Image Gallery",
  ];

  const nearbyLocations = [
    "AIIMS",
    "National Highway",
    "Medipluse Hospital",
    "Indiabulls Mega Mall",
    "Jodhpur Railway Station",
    "Jodhpur Airport",
    "DPS School",
    "Lucky International School",
    "The New High Court",
  ];

  const plan = ["Master Plan", "Floor Plan"];

  const openSwiper = (index) => {
    setStartIndex(index);
    setSwiperOpen(true);
  };

  const handleScroll = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const getFileUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  // ============================================
  // ALL EFFECTS - BEFORE ANY CONDITIONAL RETURNS
  // ============================================
  
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSwiperOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = tabs.map((tab) => document.getElementById(tab));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tabs[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // ✅ MOVED THIS EFFECT BEFORE CONDITIONAL RETURNS - THIS FIXES THE BUG
  useEffect(() => {
    const project = projectxData?.data;
    
    if (!project?._id) return;

    console.log(project._id);

    fetch(`${API_URL}/api/view/project/${project._id}`, {
      method: "POST",
    }).catch((err) => console.error("Failed to track view:", err));
  }, [projectxData?.data?._id]);

  // ============================================
  // NOW SAFE TO DO CONDITIONAL RETURNS
  // ============================================

  if (isLoadingx) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 w-2/3 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const project = projectxData?.data;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Project not found
          </h1>
          <p className="text-gray-600">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Derived data after conditional returns
  const amenitiess =
    project?.amenities?.length > 0
      ? project.amenities.map((item) => ({
          icon: item.icon,
          name: item.name,
        }))
      : [];

  const galleryImages = (project.galleryImages || []).map(
    (img) => `${API_URL}${img}`
  );

  const nearLocations = project?.nearbyLocations
    ? project?.nearbyLocations.map((item) => ({
        name: item.name,
        distance: item.distance,
      }))
    : nearbyLocations;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION WITH VIDEO/IMAGE */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {project.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={`${API_URL}${project.videoUrl}`} type="video/mp4" />
          </video>
        ) : (
          <img
            src={`${API_URL}${project.imageUrl}`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* HERO CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light">
              {project.tagline}
            </p>
          )}
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="text-white rotate-90" size={32} />
        </div>
      </section>

      {/* STICKY NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-8">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleScroll(tab)}
                  className={`whitespace-nowrap cursor-pointer pb-4 pt-4 px-2 text-sm font-medium transition-all duration-300 border-b-2 ${
                    activeSection === tab
                      ? "text-[#D2AB48] border-[#D2AB48]"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="ml-4 cursor-pointer bg-[#D2AB48] hover:bg-[#b89434] text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap">
                  Book Site Visit
                </button>
              </DialogTrigger>
              <DialogContent className="[&>button]:cursor-pointer">
                <EnquiryDialog selectedProject={project.title} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* OVERVIEW SECTION */}
      <section
        id="Overview"
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Overview
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
              <div className="w-24 h-0.5 bg-[#D2AB48]"></div>
              <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: TEXT CONTENT */}
            <div className="space-y-6">
              {project.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {project.description}
                </p>
              )}

              <div className="bg-[#FFF9EA] border-l-4 border-[#D2AB48] p-6 rounded-r-lg">
                <p className="text-gray-800 flex items-start gap-2">
                  <Phone
                    className="text-[#D2AB48] mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span>
                    To know more about this project, contact us at{" "}
                    <Link
                      href="tel:9119119249"
                      className="text-[#D2AB48] font-semibold hover:underline"
                    >
                      911911 9249
                    </Link>{" "}
                    to schedule your site visit.
                  </span>
                </p>
              </div>

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

              {/* HIGHLIGHTS CARDS */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                  {project.highlights.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                    >
                      <p className="font-semibold text-gray-900 text-sm mb-1 capitalize">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {item.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: IMAGE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D2AB48]/20 to-transparent rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <img
                src={`${API_URL}${project.overviewImageUrl}`}
                alt={project.title}
                className="relative w-full h-[400px] lg:h-[500px] rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      {amenitiess.length > 0 && (
        <section id="Amenities" className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* SECTION HEADER */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Amenities
              </h2>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
                <div className="w-24 h-0.5 bg-[#D2AB48]"></div>
                <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
              </div>
              <p className="text-gray-300 text-lg">
                The beauty lies in little details
              </p>
            </div>

            {/* AMENITIES GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {amenitiess.map((amenity, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center text-center"
                > 
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <img
                      src={`${API_URL}${amenity.icon}`}
                      alt={amenity.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="text-white text-sm font-medium leading-snug">
                    {amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LAYOUT PLANS SECTION */}
      <section id="Layout Plans" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Layout Plans
            </h2>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
              <div className="w-24 h-0.5 bg-[#D2AB48]"></div>
              <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
            </div>

            {/* TAB BUTTONS */}
            <div className="flex items-center justify-center gap-6">
              {plan.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item)}
                  className={`px-8 py-3 rounded-lg cursor-pointer font-semibold text-lg transition-all duration-300 ${
                    activeTab === item
                      ? "bg-[#D2AB48] text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* PLAN IMAGE */}
          <div className="bg-gradient-to-br from-[#FFF9EA] to-white p-8 rounded-2xl cursor-pointer shadow-lg">
            {(activeTab === "Master Plan" && project.masterPlanImageUrl) ||
            (activeTab === "Floor Plan" && project.floorPlanImageUrl) ? (
              <img
                src={
                  activeTab === "Master Plan"
                    ? `${API_URL}${project.masterPlanImageUrl}`
                    : `${API_URL}${project.floorPlanImageUrl}`
                }
                alt={`${activeTab}`}
                className="w-full rounded-xl shadow-lg object-contain max-h-[600px] mx-auto"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                  {activeTab} not available
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={buildingImg}
          alt="Shubham Developers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        <div className="relative text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-6">
            Shubham Developers – Crafting Spaces, Creating Trust
          </h3>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            With a strong vision of quality construction and customer
            satisfaction, Shubham Developers delivers modern residential &
            commercial projects that bring comfort, luxury, and a premium
            lifestyle together.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-[#D2AB48] cursor-pointer hover:bg-[#b89434] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                Schedule a Visit
              </button>
            </DialogTrigger>
            <DialogContent className="[&>button]:cursor-pointer">
              <EnquiryDialog selectedProject={project.title} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* LOCATION SECTION */}
      <section
        id="Location"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Location
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
              <div className="w-24 h-0.5 bg-[#D2AB48]"></div>
              <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
            </div>
            <p className="text-gray-600 text-lg uppercase tracking-wide">
              Location Benefits & Top Reasons to Invest
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: LOCATION INFO */}
            <div className="bg-gradient-to-br from-[#FFF7E6] to-[#FFF9EA] rounded-2xl p-8 shadow-lg">
              <img
                src={subhamLogo}
                alt="Subham Developers"
                className="w-32 h-auto mb-6"
              />

              {project.location && (
                <div className="flex items-start gap-3 mb-8 p-4 bg-white/50 rounded-lg">
                  <MapPin
                    className="text-[#D2AB48] flex-shrink-0 mt-1"
                    size={20}
                  />
                  <p className="text-gray-800 leading-relaxed">
                    {project.location}
                  </p>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Nearby Locations
              </h3>

              <div className="space-y-3">
                {nearLocations.map((place, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <img src={arrowImg} alt="arrow" className="w-4 h-4" />
                      <span className="text-gray-700 font-medium">
                        {place.name}
                      </span>
                    </div>
                    <span className="text-[#D2AB48] font-semibold text-sm">
                      {place.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: MAP */}
            <div className="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <iframe
                src={
                  project.mapEmbedUrl ||
                  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2303.7374330207706!2d72.9814874!3d26.270844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000"
                }
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE GALLERY SECTION */}
      {galleryImages.length > 0 && (
        <section id="Image Gallery" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* SECTION HEADER */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Image Gallery
              </h2>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
                <div className="w-24 h-0.5 bg-[#D2AB48]"></div>
                <div className="w-3 h-3 bg-[#D2AB48] rotate-45"></div>
              </div>
              <p className="text-gray-600 text-lg">
                The address of royal living
              </p>
            </div>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => openSwiper(index)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={image}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    alt={`Gallery ${index + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-semibold">
                      View Image
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FULLSCREEN LIGHTBOX */}
          {swiperOpen && (
            <div
              className="fixed inset-0 bg-black/95 z-50 flex justify-center items-center"
              onClick={() => setSwiperOpen(false)}
            >
              <div
                className="relative w-[90vw] h-[90vh] md:w-[80vw] md:h-[80vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSwiperOpen(false);
                  }}
                  className="absolute cursor-pointer top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white w-12 h-12 rounded-full z-50 flex items-center justify-center transition-all duration-200"
                >
                  ✕
                </button>

                <div className="w-full h-full [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white [&_.swiper-pagination-bullet]:bg-white">
                  <Swiper
                    initialSlide={startIndex}
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full h-full"
                  >
                    {galleryImages.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="flex justify-center items-center w-full h-full p-8">
                          <img
                            src={img}
                            className="max-w-full max-h-full object-contain rounded-lg"
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
    </div>
  );
};

export default ProjectDetail;