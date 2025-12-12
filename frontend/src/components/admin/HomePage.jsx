import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
} from "@/redux/features/homePageApi";

const API_URL=import.meta.env.VITE_API_URL ||" http://localhost:3001/"


const HomePage = () => {
  const [openSection, setOpenSection] = useState(null);

  const [updateHomePage, { isLoading: updateLoading }] =
    useUpdateHomePageMutation();
  const { data, isLoading, refetch } = useGetHomePageQuery();

  // React Hook Form
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  // State for About Section
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    image: "",
  });

  // State for Stats Section
  const [statsData, setStatsData] = useState({
    awards: 0,
    projects: 0,
    clients: 0,
    team: 0,
  });

  // State for Testimonials
  const [testimonials, setTestimonials] = useState([]);

  // Image Preview States
  const [imagePreview, setImagePreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Edit mode for testimonials
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);

  // Watch file inputs
  const watchImage = watch("image");
  const watchPhoto = watch("photo");

  // -------------------------------
  // LOAD DATA FROM API ON MOUNT & UPDATE
  // -------------------------------
  useEffect(() => {
    if (data) {
      if (data.about) {
        setAboutData(data.about);
      }
      if (data.stats) {
        setStatsData(data.stats);
      }
      if (data.testimonials) {
        setTestimonials(data.testimonials);
      }
    }
  }, [data]);

  // -------------------------------
  // HANDLE IMAGE PREVIEW
  // -------------------------------
  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [watchImage]);

  useEffect(() => {
    if (watchPhoto && watchPhoto[0]) {
      const file = watchPhoto[0];
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [watchPhoto]);

  // -------------------------------
  // CONVERT FILE TO BASE64
  // -------------------------------
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // -------------------------------
  // OPEN MODAL & LOAD FORM DATA
  // -------------------------------
  const handleOpenModal = (section, testimonialToEdit = null) => {
    setOpenSection(section);
    setImagePreview(null);
    setPhotoPreview(null);

    if (section === "about") {
      reset({
        title: aboutData.title,
        description: aboutData.description,
      });
      setEditingTestimonialId(null);
    } else if (section === "stats") {
      reset({
        awards: statsData.awards,
        projects: statsData.projects,
        clients: statsData.clients,
        team: statsData.team,
      });
      setEditingTestimonialId(null);
    } else if (section === "testimonials") {
      if (testimonialToEdit) {
        // Edit mode
        reset({
          name: testimonialToEdit.name,
          position: testimonialToEdit.position,
          message: testimonialToEdit.message,
        });
        setEditingTestimonialId(testimonialToEdit.id);
        setPhotoPreview(testimonialToEdit.photo);
      } else {
        // Add mode
        reset({
          name: "",
          position: "",
          message: "",
        });
        setEditingTestimonialId(null);
      }
    }
  };

  // -------------------------------
  // DELETE TESTIMONIAL
  // -------------------------------
  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    const updatedTestimonials = testimonials.filter((t) => t.id !== id);

    try {
      await updateHomePage({
        about: aboutData,
        stats: statsData,
        testimonials: updatedTestimonials,
      }).unwrap();

      refetch();
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      alert("Failed to delete testimonial. Please try again.");
    }
  };

  // -------------------------------
  // HANDLE SUBMIT (UPDATE BACKEND)
  // -------------------------------
  const onSubmit = async (formData) => {
    let updatedAbout = aboutData;
    let updatedStats = statsData;
    let updatedTestimonials = testimonials;

    try {
      if (openSection === "about") {
        updatedAbout = {
          title: formData.title,
          description: formData.description,
          image: aboutData.image, // Keep existing image
        };

        // If new image uploaded, convert to base64
        if (formData.image && formData.image[0]) {
          updatedAbout.image = await fileToBase64(formData.image[0]);
        }

        setAboutData(updatedAbout);
      } else if (openSection === "stats") {
        updatedStats = {
          awards: parseInt(formData.awards),
          projects: parseInt(formData.projects),
          clients: parseInt(formData.clients),
          team: parseInt(formData.team),
        };

        setStatsData(updatedStats);
      } else if (openSection === "testimonials") {
        let photoUrl = photoPreview; // Use existing preview

        // If new photo uploaded, convert to base64
        if (formData.photo && formData.photo[0]) {
          photoUrl = await fileToBase64(formData.photo[0]);
        }

        if (editingTestimonialId) {
          // Update existing testimonial
          updatedTestimonials = testimonials.map((t) =>
            t.id === editingTestimonialId
              ? {
                  id: editingTestimonialId,
                  name: formData.name,
                  position: formData.position,
                  message: formData.message,
                  photo: photoUrl,
                }
              : t
          );
        } else {
          // Add new testimonial
          const newTestimonial = {
            id: Date.now(),
            name: formData.name,
            position: formData.position,
            message: formData.message,
            photo: photoUrl,
          };
          updatedTestimonials = [...testimonials, newTestimonial];
        }

        setTestimonials(updatedTestimonials);
      }

      // API CALL
      await updateHomePage({
        about: updatedAbout,
        stats: updatedStats,
        testimonials: updatedTestimonials,
      }).unwrap();

      // Refetch and close modal
      refetch();
      setOpenSection(null);
      setImagePreview(null);
      setPhotoPreview(null);
      reset();
    } catch (error) {
      console.error("Failed to update homepage:", error);
      alert("Failed to update. Please try again.");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  console.log(data)

  return (
    <div className="p-6 space-y-10">
      {/* ---------------------- ABOUT SECTION ---------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl text-white font-bold">About Section</h2>
          <button
            onClick={() => handleOpenModal("about")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>

        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Image</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-white">
                {aboutData.title || "N/A"}
              </td>
              <td className="border p-2 text-white">
                {aboutData.description || "N/A"}
              </td>
              <td className="border p-2">
                {aboutData.image ? (
                  <img
                    
                    src={`${API_URL}${aboutData.image}`}
                    alt="img"
                    className="w-20 h-10 rounded"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------------------- STATS SECTION ---------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Stats Section</h2>
          <button
            onClick={() => handleOpenModal("stats")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>

        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-2">Awards</th>
              <th className="border p-2">Projects</th>
              <th className="border p-2">Clients</th>
              <th className="border p-2">Team</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-white">{statsData.awards || 0}</td>
              <td className="border p-2 text-white">
                {statsData.projects || 0}
              </td>
              <td className="border p-2 text-white">
                {statsData.clients || 0}
              </td>
              <td className="border p-2 text-white">{statsData.team || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------------------- TESTIMONIALS SECTION ---------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl text-white font-bold">Testimonials</h2>
          <button
            onClick={() => handleOpenModal("testimonials")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Add New
          </button>
        </div>

        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="border p-4 text-center text-gray-400"
                >
                  No testimonials found. Click "Add New" to create one.
                </td>
              </tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t.id}>
                  <td className="border p-2">
                    <img
                      src={t.photo}
                      className="w-14 h-14 rounded-full object-cover"
                      alt={t.name}
                    />
                  </td>
                  <td className="border p-2 text-white">{t.name}</td>
                  <td className="border p-2 text-white">{t.position}</td>
                  <td className="border p-2 text-white">{t.message}</td>
                  <td className="border p-2 text-white">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal("testimonials", t)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------------- MODAL ---------------------- */}
      {openSection && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded shadow-lg">
      <h3 className="text-lg font-bold mb-4">
        {openSection === "testimonials"
          ? editingTestimonialId
            ? "Edit Testimonial"
            : "Add New Testimonial"
          : `Update ${
              openSection.charAt(0).toUpperCase() + openSection.slice(1)
            }`}
      </h3>

      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        {/* ABOUT FORM */}
        {openSection === "about" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                {...register("title", { 
                  required: "Title is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Title cannot be empty or just spaces",
                  },
                })}
                placeholder="Title"
                className="w-full border p-2 rounded"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Description cannot be empty or just spaces",
                    wordCount: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 125 || "Maximum 125 words allowed"
                      );
                    },
                  },
                })}
                className="w-full border p-2 rounded"
                rows="4"
              ></textarea>

              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Image
              </label>

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full border p-2 rounded"
              />

              {/* NEW IMAGE PREVIEW */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded border"
                />
              )}

              {/* EXISTING IMAGE + REMOVE BUTTON */}
              {!imagePreview && aboutData.image && (
                <>
                  <img
                    src={`${API_URL}${aboutData.image}`}
                    alt="Current"
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setAboutData({ ...aboutData, image: "" });
                      setValue("image", null);
                      setImagePreview(null);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Remove Image
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* STATS FORM */}
        {openSection === "stats" && (
          <>
            {["awards", "projects", "clients", "team"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {field}
                </label>
                <input
                  type="number"
                  {...register(field, {
                    required: `${field} is required`,
                    min: { value: 0, message: "Value must be positive" },
                  })}
                  placeholder={field}
                  className="w-full border p-2 rounded"
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}
          </>
        )}

        {/* TESTIMONIAL FORM */}
        {openSection === "testimonials" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("photo", {
                  required: !editingTestimonialId && "Photo is required",
                })}
                className="w-full border p-2 rounded"
              />
              {errors.photo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.photo.message}
                </p>
              )}
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-full border"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                {...register("name", { 
                  required: "Name is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Name cannot be empty or just spaces",
                  },
                })}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Position
              </label>
              <input
                type="text"
                {...register("position", {
                  required: "Position is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Position cannot be empty or just spaces",
                  },
                })}
                placeholder="Position"
                className="w-full border p-2 rounded"
              />
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                {...register("message", {
                  required: "Message is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Message cannot be empty or just spaces",
                  },
                })}
                placeholder="Message"
                className="w-full border p-2 rounded"
                rows="3"
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={updateLoading}
          className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700 disabled:bg-gray-400"
        >
          {updateLoading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => {
            setOpenSection(null);
            setImagePreview(null);
            setPhotoPreview(null);
            reset();
          }}
          className="w-full bg-gray-500 text-white py-2 rounded mt-2 hover:bg-gray-600"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default HomePage;
