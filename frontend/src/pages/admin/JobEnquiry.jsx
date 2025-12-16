import { useDeleteAllApplicationsMutation, useDeleteJobBYIdMutation, useGetApplicationsQuery } from "@/redux/features/adminApi";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const JobEnquiry = () => {
  // 🔹 Hooks (ALWAYS on top – no conditional return)
  const { data, isLoading } = useGetApplicationsQuery();
  const [deleteAllApplications, {data: deltedAllData, isLoading: deletedAllDataLoading}] = useDeleteAllApplicationsMutation()
  const [deleteJobBYId, {data: deleteData, isLoading: isDeleteLoading}] = useDeleteJobBYIdMutation()

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const itemsPerPage = 10;

  const applications = data?.data || [];

  // 🔹 Filter + search
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(
    startIndex,
    endIndex
  );

  // 🔹 Reset page on filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🔹 Resume view
  const handleViewResume = (resume, applicantName) => {
    const fullUrl = `${API_URL}/${resume}`;
    setSelectedResume({ url: fullUrl, name: applicantName });
    setShowResumeModal(true);
  };

  const closeModal = () => {
    setShowResumeModal(false);
    setSelectedResume(null);
  };

  // 🔹 Delete handlers
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        console.log(deleteId)
        const response = await deleteJobBYId(deleteId).unwrap();

        // console.log(response)

        if(response.success){
      toast.success("All applications deleted successfully");
     }
        setShowDeleteModal(false);
        setDeleteId(null);
        // Optional: Show success message
      } catch (error) {
        console.error("Failed to delete application:", error);
        // Optional: Show error message
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // 🔹 Delete All handlers
  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = async () => {
    try {
     const respone =  await deleteAllApplications().unwrap();

     if(respone.success){
      toast.success("All applications deleted successfully");
     }
      setShowDeleteAllModal(false);
      // Optional: Show success message
    } catch (error) {
      console.error("Failed to delete all applications:", error);
      // Optional: Show error message
    }
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllModal(false);
  };

  const isPdf = selectedResume?.url?.endsWith(".pdf");

  // ===============================
  // 🔥 RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {isLoading ? (
        // 🔹 Loader (NO EARLY RETURN)
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading applications...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Job Applications
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage and review job applications
                </p>
              </div>
              {applications.length > 0 && (
                <button
                  onClick={handleDeleteAllClick}
                  disabled={deletedAllDataLoading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deletedAllDataLoading ? "Deleting..." : "Delete All Applications"}
                </button>
              )}
            </div>

            {/* Search */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <input
                type="text"
                placeholder="Search by name, email, job title, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-400">
                Showing {currentApplications.length} of{" "}
                {filteredApplications.length} applications
              </p>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    currentApplications.map((app) => (
                      <tr
                        key={app._id}
                        className="border-t border-gray-700 hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 text-white">
                          {app.fullName}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {app.jobTitle}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          <div>{app.email}</div>
                          <div className="text-gray-500">
                            {app.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                handleViewResume(
                                  app.resume,
                                  app.fullName
                                )
                              }
                              className="text-yellow-400 hover:underline cursor-pointer"
                            >
                              View Resume
                            </button>
                            <button
                              onClick={() => handleDeleteClick(app._id)}
                              disabled={isDeleteLoading}
                              className="text-red-400 hover:underline cursor-pointer disabled:opacity-50"
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
          </div>

          {/* Resume Modal */}
          {showResumeModal && selectedResume && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-gray-800 w-full max-w-5xl h-[90vh] rounded-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="text-white text-lg font-semibold">
                    Resume – {selectedResume.name}
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={selectedResume.url}
                      download
                      className="px-4 py-2 bg-yellow-500 text-black rounded"
                    >
                      Download
                    </a>
                    <button
                      onClick={closeModal}
                      className="text-white text-xl cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  {isPdf ? (
                    <iframe
                      src={selectedResume.url}
                      className="w-full h-full rounded"
                      title="Resume"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      Preview not available. Please download the resume.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this application? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleteLoading}
                    className="px-4 py-2 cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleteLoading}
                    className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete All Confirmation Modal */}
          {showDeleteAllModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Confirm Delete All
                </h3>
                <p className="text-gray-300 mb-2">
                  Are you sure you want to delete <span className="font-bold text-red-400">ALL {applications.length} applications</span>?
                </p>
                <p className="text-red-400 mb-6 font-semibold">
                  This action cannot be undone!
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDeleteAll}
                    disabled={deletedAllDataLoading}
                    className="px-4 py-2 cursor-pointer bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteAll}
                    disabled={deletedAllDataLoading}
                    className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletedAllDataLoading ? "Deleting All..." : "Delete All"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobEnquiry;