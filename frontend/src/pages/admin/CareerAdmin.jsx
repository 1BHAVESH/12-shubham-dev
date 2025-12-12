import {
  useCreateJobMutation,
  useDeleteCareerMutation,
  useGetJobQuery,
  useUpdateJobMutation,
} from "@/redux/features/adminApi";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { toast } from "sonner";

const CareerAdmin = () => {
  const [deleteCareer] = useDeleteCareerMutation();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const { data: jobData, isLoading: isLoadingJobs, error } = useGetJobQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      jobTitle: "",
      places: "",
      positions: 1,
    },
  });

  useEffect(() => {
    if (!showModal) {
      setEditingJob(null);
      reset();
    }
  }, [showModal, reset]);

  useEffect(() => {
    if (editingJob) {
      setValue("jobTitle", editingJob.jobTitle);
      setValue("places", editingJob.places);
      setValue("positions", editingJob.positions);
    }
  }, [editingJob, setValue]);

  const jobs = jobData?.data || [];

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(query) ||
        job.places.toLowerCase().includes(query)
    );
  }, [jobs, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const onSubmit = async (formData) => {
    try {
      if (editingJob) {
        const response = await updateJob({
          id: editingJob._id,
          ...formData,
        }).unwrap();
        
        if (response.status) {
          toast.success("Position updated successfully");
        }
      } else {
        const response = await createJob(formData).unwrap();
        
        if (response.status) {
          toast.success("Position created successfully");
        }
      }

      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save position");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await deleteCareer(deleteId).unwrap();

      if (response.status) {
        toast.success("Job deleted successfully");
      }

      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete position");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  if (isLoadingJobs) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading careers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading careers</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Career Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Add New Position
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {jobs.length > 0 && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or location..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* JOB LIST */}
      <div className="max-w-6xl mx-auto">
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-gray-400 text-lg">
              No career positions added yet
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Add First Position
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-gray-400 text-lg">
              No positions match your search
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-gray-400 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)}{" "}
              of {filteredJobs.length} position
              {filteredJobs.length !== 1 ? "s" : ""}
            </div>

            <div className="grid gap-4">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-900 p-6 rounded-lg flex justify-between items-center hover:bg-gray-800 transition"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{job.jobTitle}</h3>
                    <div className="flex gap-6 text-gray-400">
                      <span>{job.places}</span>
                      <span>
                        {job.positions} Position{job.positions !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(job)}
                      className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(job._id)}
                      className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded transition ${
                          currentPage === page
                            ? "bg-blue-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center p-4 bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-300 border-2 cursor-pointer border-amber-300 hover:text-white transition p-1 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingJob ? "Edit Position" : "Add New Position"}
            </h2>

            <div className="space-y-5">
              {/* JOB TITLE */}
              <div>
                <label className="block mb-2 font-medium">Job Title *</label>
                <input
                  {...register("jobTitle", {
                    required: "Job title is required",
                    minLength: {
                      value: 3,
                      message: "Job title must be at least 3 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Job title must not exceed 100 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Job title can only contain letters and spaces",
                    },
                  })}
                  className={`w-full p-3 bg-gray-800 rounded border ${
                    errors.jobTitle ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:border-blue-500`}
                  placeholder="e.g., Frontend Developer"
                />
                {errors.jobTitle && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>

              {/* LOCATION */}
              <div>
                <label className="block mb-2 font-medium">Location *</label>
                <input
                  {...register("places", {
                    required: "Location is required",
                    minLength: {
                      value: 2,
                      message: "Location must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Location must not exceed 50 characters",
                    },
                  })}
                  className={`w-full p-3 bg-gray-800 rounded border ${
                    errors.places ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:border-blue-500`}
                  placeholder="e.g., Udaipur"
                />
                {errors.places && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.places.message}
                  </p>
                )}
              </div>

              {/* POSITIONS */}
              <div>
                <label className="block mb-2 font-medium">
                  Number of Positions *
                </label>
                <input
                  type="number"
                  {...register("positions", {
                    required: "Number of positions is required",
                    min: {
                      value: 1,
                      message: "Must be at least 1 position",
                    },
                    max: {
                      value: 100,
                      message: "Cannot exceed 100 positions",
                    },
                    valueAsNumber: true,
                  })}
                  className={`w-full p-3 bg-gray-800 rounded border ${
                    errors.positions ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:border-blue-500`}
                  placeholder="e.g., 5"
                />
                {errors.positions && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.positions.message}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  type="button"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingJob ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    <>{editingJob ? "Update Position" : "Add Position"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex justify-center items-center p-4 bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 p-8 rounded-lg text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Delete Position?</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this position? This action cannot
              be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAdmin;