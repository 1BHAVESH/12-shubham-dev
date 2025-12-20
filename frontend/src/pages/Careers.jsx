import React, { useState } from "react";
import { Briefcase, MapPin, Users, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import OtherHeroImage from "@/components/OtherHeroImage";
import { useApplyForJobMutation, useGetJobQuery } from "@/redux/features/shubamdevApi";
import { toast } from "sonner";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  resume: yup
    .mixed()
    .required("Resume is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && value[0] && value[0].size <= 5242880;
    })
    .test("fileType", "Only PDF, DOC, and DOCX files are allowed", (value) => {
      return (
        value &&
        value[0] &&
        ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
          value[0].type
        )
      );
    }),
});

const jobList = [
  {
    jobTitle: "Telecaller",
    places: "Jodhpur, Pali, Pune",
    positions: 2,
  },
  {
    jobTitle: "Sale Executive",
    places: "Jodhpur, Pali, Pune, Banglore, Chennai, Pune",
    positions: 5,
  },
  {
    jobTitle: "Customer Relation Manager",
    places: "Jodhpur",
    positions: 2,
  },
  {
    jobTitle: "H.R MANAGER",
    places: "Jodhpur",
    positions: 1,
  },
];

const Careers = () => {
  const [applyForJob, {data: applyJobData, isLoading: applyJobLoading}] = useApplyForJobMutation()
  const { data, isLoading } = useGetJobQuery();
  const [visible, setVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobData = data?.data ? data.data.map((job) => ({ ...job })) : jobList;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    reset();
  };

  const onSubmit = async (data) => {
  try {
    const formData = new FormData();

    formData.append("jobTitle", selectedJob?.jobTitle);
    formData.append("fullName", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("resume", data.resume[0]);

    const response = await applyForJob(formData).unwrap();

    if(response.success){
      toast.success("Application submitted successfully ✅");
    }

   
    closeModal();
  } catch (error) {
    console.error(error);
    alert(error?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="min-h-screen bg-white">
      {/* PAGE HERO SECTION */}
      <div className="">
        <OtherHeroImage visible={visible} setVisible={setVisible} />
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg">
            Careers
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

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:py-16">
        {/* CURRENT OPENINGS */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 sm:mb-8 text-center sm:text-left">
          Current Openings
        </h3>

        {/* GRID OF JOBS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {jobData.map((job, index) => (
            <div
              key={index}
              className="bg-[#FFFBF2] p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-amber-100 flex flex-col"
            >
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#D2AB48] p-2 rounded-lg flex-shrink-0">
                  <Briefcase className="text-white" size={20} />
                </div>
                <h4 className="font-semibold text-base sm:text-lg text-gray-800 leading-tight">
                  {job.jobTitle}
                </h4>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="text-[#D2AB48] mt-1 flex-shrink-0" size={16} />
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {job.places}
                </p>
              </div>

              {/* POSITIONS */}
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-[#D2AB48] flex-shrink-0" size={16} />
                <p className="text-xs sm:text-sm text-gray-600">
                  {job.positions}{" "}
                  {job.positions === 1 ? "Position" : "Positions"} Available
                </p>
              </div>

              {/* BUTTONS */}
              <div className="mt-auto space-y-2">
                <a
                  href="tel:+917597074381"
                  className="block w-full bg-[#D2AB48] hover:bg-[#C19A3A] text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
                >
                  Call Now
                </a>
                <button
                  onClick={() => openModal(job)}
                  className="block w-full cursor-pointer bg-white hover:bg-gray-50 text-[#D2AB48] border-2 border-[#D2AB48] font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-[#D2AB48] text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Apply for Position</h3>
                <p className="text-sm text-amber-100 mt-1">{selectedJob?.jobTitle}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white cursor-pointer hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2AB48] focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2AB48] focus:border-transparent outline-none transition"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2AB48] focus:border-transparent outline-none transition"
                  placeholder="10-digit mobile number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* RESUME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  {...register("resume")}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2AB48] focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-[#D2AB48] hover:file:bg-amber-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, or DOCX (Max 5MB)
                </p>
                {errors.resume && (
                  <p className="text-red-500 text-xs mt-1">{errors.resume.message}</p>
                )}
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1 cursor-pointer bg-[#D2AB48] hover:bg-[#C19A3A] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;