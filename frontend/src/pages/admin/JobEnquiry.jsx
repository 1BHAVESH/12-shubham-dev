import { useGetApplicationsQuery } from "@/redux/features/shubamdevApi";
import React, { useState, useMemo, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const JobEnquiry = () => {
  // 🔹 Hooks (ALWAYS on top – no conditional return)
  const { data, isLoading } = useGetApplicationsQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">
                Job Applications
              </h1>
              <p className="text-gray-400 mt-1">
                Manage and review job applications
              </p>
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
                      Action
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
        </>
      )}
    </div>
  );
};

export default JobEnquiry;
