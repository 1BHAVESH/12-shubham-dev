import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
} from "@/redux/features/homePageApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const HomePage = () => {
  const [openSection, setOpenSection] = useState(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);

  const { data, isLoading, refetch } = useGetHomePageQuery();
  const [updateHomePage, { isLoading: updateLoading }] =
    useUpdateHomePageMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [statsData, setStatsData] = useState({
    awards: 0,
    projects: 0,
    clients: 0,
    team: 0,
  });

  const [testimonials, setTestimonials] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const watchImage = watch("image");
  const watchPhoto = watch("photo");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (data) {
      setAboutData(data.about || {});
      setStatsData(data.stats || {});
      setTestimonials(data.testimonials || []);
    }
  }, [data]);

  /* ---------------- IMAGE PREVIEW ---------------- */
  useEffect(() => {
    if (watchImage?.[0] instanceof File) {
      const url = URL.createObjectURL(watchImage[0]);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [watchImage]);

  useEffect(() => {
    if (watchPhoto?.[0] instanceof File) {
      const url = URL.createObjectURL(watchPhoto[0]);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreview(null);
    }
  }, [watchPhoto]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* ---------------- MODAL OPEN ---------------- */
  const handleOpenModal = (section, testimonial = null) => {
    setOpenSection(section);
    setImagePreview(null);
    setPhotoPreview(null);

    if (section === "about") {
      reset(aboutData);
    }

    if (section === "stats") {
      reset(statsData);
    }

    if (section === "testimonials") {
      if (testimonial) {
        reset(testimonial);
        setEditingTestimonialId(testimonial.id);
        setPhotoPreview(testimonial.photo);
      } else {
        reset({ name: "", position: "", message: "" });
        setEditingTestimonialId(null);
      }
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (formData) => {
    let updatedAbout = aboutData;
    let updatedStats = statsData;
    let updatedTestimonials = testimonials;

    if (openSection === "about") {
      updatedAbout = {
        ...aboutData,
        title: formData.title,
        description: formData.description,
      };

      if (formData.image?.[0]) {
        updatedAbout.image = await fileToBase64(formData.image[0]);
      }

      setAboutData(updatedAbout);
    }

    if (openSection === "stats") {
      updatedStats = {
        awards: +formData.awards,
        projects: +formData.projects,
        clients: +formData.clients,
        team: +formData.team,
      };
      setStatsData(updatedStats);
    }

    if (openSection === "testimonials") {
      const photo =
        formData.photo?.[0] && (await fileToBase64(formData.photo[0]));

      if (editingTestimonialId) {
        updatedTestimonials = testimonials.map((t) =>
          t.id === editingTestimonialId
            ? { ...t, ...formData, photo: photo || t.photo }
            : t
        );
      } else {
        updatedTestimonials = [
          ...testimonials,
          { id: Date.now(), ...formData, photo },
        ];
      }

      setTestimonials(updatedTestimonials);
    }

    await updateHomePage({
      about: updatedAbout,
      stats: updatedStats,
      testimonials: updatedTestimonials,
    }).unwrap();

    refetch();
    setOpenSection(null);
    reset();
  };

  const handleDeleteTestimonial = async (id) => {
    const updatedTestimonials = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedTestimonials);
    
    await updateHomePage({
      about: aboutData,
      stats: statsData,
      testimonials: updatedTestimonials,
    }).unwrap();
    
    refetch();
  };

  if (isLoading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 space-y-6 md:space-y-10">

      {/* ---------------- ABOUT ---------------- */}
      <SectionHeader title="About Section" onClick={() => handleOpenModal("about")} />

      {/* Mobile Card */}
      <MobileCard>
        <p className="font-bold text-base mb-2">{aboutData.title}</p>
        <p className="text-sm text-gray-300 break-words">{aboutData.description}</p>
        {aboutData.image && (
          <img
            src={`${API_URL}${aboutData.image}`}
            className="mt-3 w-full h-40 object-cover rounded"
            alt="About"
          />
        )}
      </MobileCard>

      {/* Desktop Table */}
      <DesktopTable headers={["Title", "Description", "Image"]}>
        <tr className="border-b border-gray-700">
          <td className="p-3 max-w-xs break-words">{aboutData.title}</td>
          <td className="p-3 max-w-md break-words">{aboutData.description}</td>
          <td className="p-3">
            {aboutData.image && (
              <img
                src={`${API_URL}${aboutData.image}`}
                className="w-24 h-14 object-cover rounded"
                alt="About"
              />
            )}
          </td>
        </tr>
      </DesktopTable>

      {/* ---------------- STATS ---------------- */}
      <SectionHeader title="Stats Section" onClick={() => handleOpenModal("stats")} />

      <div className="grid grid-cols-2 gap-3 md:hidden">
        {Object.entries(statsData).map(([k, v]) => (
          <div key={k} className="bg-gray-800 p-4 rounded text-center text-white">
            <p className="text-xs uppercase text-gray-400 mb-1">{k}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <DesktopTable headers={["Awards", "Projects", "Clients", "Team"]}>
        <tr className="border-b border-gray-700">
          {Object.values(statsData).map((v, i) => (
            <td key={i} className="text-center p-3 text-lg font-semibold">{v}</td>
          ))}
        </tr>
      </DesktopTable>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <SectionHeader
        title="Testimonials"
        onClick={() => handleOpenModal("testimonials")}
        btnText="Add New"
      />

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {testimonials.map((t) => (
          <MobileCard key={t.id}>
            <div className="flex gap-3 items-start mb-3">
              <img src={t.photo} className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt={t.name} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base truncate">{t.name}</p>
                <p className="text-xs text-gray-400 truncate">{t.position}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 break-words mb-3">{t.message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal("testimonials", t)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTestimonial(t.id)}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Desktop Table */}
      <DesktopTable
        headers={["Photo", "Name", "Position", "Message", "Actions"]}
      >
        {testimonials.map((t) => (
          <tr key={t.id} className="border-b border-gray-700">
            <td className="p-3">
              <img src={t.photo} className="w-12 h-12 rounded-full object-cover" alt={t.name} />
            </td>
            <td className="p-3 max-w-xs truncate">{t.name}</td>
            <td className="p-3 max-w-xs truncate">{t.position}</td>
            <td className="p-3 max-w-md break-words">{t.message}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal("testimonials", t)}
                  className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(t.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DesktopTable>

      {/* ---------------- MODAL ---------------- */}
      {openSection && (
        <Modal onClose={() => setOpenSection(null)}>
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {openSection === "about" && "Edit About Section"}
            {openSection === "stats" && "Edit Stats"}
            {openSection === "testimonials" && (editingTestimonialId ? "Edit Testimonial" : "Add Testimonial")}
          </h3>
          
          <div className="space-y-4">
            
            {/* ABOUT FORM */}
            {openSection === "about" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    className="w-full border border-gray-300 p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  {imagePreview && (
                    <img src={imagePreview} className="mt-2 w-full h-32 object-cover rounded" alt="Preview" />
                  )}
                  {!imagePreview && aboutData.image && (
                    <img src={`${API_URL}${aboutData.image}`} className="mt-2 w-full h-32 object-cover rounded" alt="Current" />
                  )}
                </div>
              </>
            )}

            {/* STATS FORM */}
            {openSection === "stats" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Awards</label>
                  <input
                    type="number"
                    {...register("awards", { required: true })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
                  <input
                    type="number"
                    {...register("projects", { required: true })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clients</label>
                  <input
                    type="number"
                    {...register("clients", { required: true })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <input
                    type="number"
                    {...register("team", { required: true })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* TESTIMONIALS FORM */}
            {openSection === "testimonials" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    {...register("position", { required: "Position is required" })}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    className="w-full border border-gray-300 p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("photo")}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  {photoPreview && (
                    <img src={photoPreview} className="mt-2 w-20 h-20 rounded-full object-cover" alt="Preview" />
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updateLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded font-medium cursor-pointer disabled:cursor-not-allowed"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
            
            <button
              onClick={() => setOpenSection(null)}
              disabled={updateLoading}
              className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 rounded font-medium cursor-pointer disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ---------------- REUSABLE UI ---------------- */

const SectionHeader = ({ title, onClick, btnText = "Update" }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium w-full sm:w-auto cursor-pointer"
    >
      {btnText}
    </button>
  </div>
);

const MobileCard = ({ children }) => (
  <div className="bg-gray-800 p-4 rounded-lg text-white md:hidden shadow-lg">
    {children}
  </div>
);

const DesktopTable = ({ headers, children }) => (
  <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
    <table className="w-full border-collapse bg-gray-800 text-white">
      <thead className="bg-gray-700">
        <tr>
          {headers.map((h) => (
            <th key={h} className="border border-gray-600 p-3 text-left font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl my-8 max-h-[90vh] overflow-y-auto">
      {children}
    </div>
  </div>
);

export default HomePage;