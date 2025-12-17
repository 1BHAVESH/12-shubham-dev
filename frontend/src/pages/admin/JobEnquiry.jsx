import { useDeleteAllApplicationsMutation, useDeleteJobBYIdMutation, useGetApplicationsQuery } from "@/redux/features/adminApi";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown, Trash2, Eye, Download, X, Filter, Menu } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const JobEnquiry = () => {
  // 🔹 Hooks (ALWAYS on top – no conditional return)
  const { data, isLoading } = useGetApplicationsQuery();
  const [deleteAllApplications, {data: deltedAllData, isLoading: deletedAllDataLoading}] = useDeleteAllApplicationsMutation()
  const [deleteJobBYId, {data: deleteData, isLoading: isDeleteLoading}] = useDeleteJobBYIdMutation()

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTitleFilter, setJobTitleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // 🔹 Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const itemsPerPage = 10;

  const applications = data?.data || [];

  // 🔹 Get unique job titles for filter
  const uniqueJobTitles = useMemo(() => {
    const titles = applications.map(app => app.jobTitle).filter(Boolean);
    return [...new Set(titles)].sort();
  }, [applications]);

  // 🔹 Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 🔹 Sort icon component
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4 text-yellow-500" /> : 
      <ArrowDown className="ml-2 h-4 w-4 text-yellow-500" />;
  };

  // 🔹 Filter + search + sort
  const filteredApplications = useMemo(() => {
    let result = applications.filter((app) => {
      const matchesSearch =
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      const matchesJobTitle =
        jobTitleFilter === "all" || app.jobTitle === jobTitleFilter;

      return matchesSearch && matchesStatus && matchesJobTitle;
    });

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case 'name':
            aValue = a.fullName?.toLowerCase() || '';
            bValue = b.fullName?.toLowerCase() || '';
            break;
          case 'jobTitle':
            aValue = a.jobTitle?.toLowerCase() || '';
            bValue = b.jobTitle?.toLowerCase() || '';
            break;
          case 'email':
            aValue = a.email?.toLowerCase() || '';
            bValue = b.email?.toLowerCase() || '';
            break;
          case 'date':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [applications, searchTerm, statusFilter, jobTitleFilter, sortField, sortDirection]);

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
  }, [searchTerm, statusFilter, jobTitleFilter]);

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
        const response = await deleteJobBYId(deleteId).unwrap();

        if(response.success){
          toast.success("Application deleted successfully");
        }
        setShowDeleteModal(false);
        setDeleteId(null);
      } catch (error) {
        console.error("Failed to delete application:", error);
        toast.error("Failed to delete application");
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
      const respone = await deleteAllApplications().unwrap();

      if(respone.success){
        toast.success("All applications deleted successfully");
      }
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error("Failed to delete all applications:", error);
      toast.error("Failed to delete all applications");
    }
  };

  const cancelDeleteAll = () => {
    setShowDeleteAllModal(false);
  };

  const isPdf = selectedResume?.url?.endsWith(".pdf");

  // ===============================
  // 🔥 RENDER
  // ===============================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto" />
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Job Applications</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Manage and review job applications
            </p>
          </div>
          {applications.length > 0 && (
            <Button
              onClick={handleDeleteAllClick}
              disabled={deletedAllDataLoading}
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white w-full sm:w-auto"
              size="lg"
            >
              {deletedAllDataLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Delete All Applications</span>
                  <span className="sm:hidden">Delete All</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 max-w-[700px] rounded-lg border border-gray-800 p-4 sm:p-6">
          {/* Mobile Filter Toggle */}
          <div className="flex gap-2 mb-4 sm:hidden">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Filters - Always visible */}
          <div className="hidden max-w-[700px] sm:flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by name, email, job title, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
              <SelectTrigger className="w-[240px] cursor-pointer bg-gray-800 border-gray-700 text-white focus:ring-yellow-500 focus:border-yellow-500">
                <SelectValue placeholder="All Job Titles" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white focus:bg-gray-700 focus:text-white">
                  All Job Titles
                </SelectItem>
                {uniqueJobTitles.map((title) => (
                  <SelectItem key={title} value={title} className="text-white cursor-pointer focus:bg-gray-700 focus:text-white">
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filters - Collapsible */}
          {showFilters && (
            <div className="sm:hidden space-y-3 mb-4">
              <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
                <SelectTrigger className="w-full cursor-pointer bg-gray-800 border-gray-700 text-white focus:ring-yellow-500 focus:border-yellow-500">
                  <SelectValue placeholder="All Job Titles" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white focus:bg-gray-700 focus:text-white">
                    All Job Titles
                  </SelectItem>
                  {uniqueJobTitles.map((title) => (
                    <SelectItem key={title} value={title} className="text-white cursor-pointer focus:bg-gray-700 focus:text-white">
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <p className="text-sm text-gray-400">
            Showing {currentApplications.length} of {filteredApplications.length} applications
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr className="border-b border-gray-700">
                  <th 
                    className="px-6 py-3 text-left text-gray-300 cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Applicant
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-gray-300 cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => handleSort('jobTitle')}
                  >
                    <div className="flex items-center">
                      Job Title
                      <SortIcon field="jobTitle" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-gray-300 cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Contact
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-gray-300 cursor-pointer select-none hover:bg-gray-700"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  currentApplications.map((app) => (
                    <tr key={app._id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-6 py-4 text-white font-medium">{app.fullName}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          {app.jobTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-300">{app.email}</div>
                          <div className="text-sm text-gray-500">{app.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewResume(app.resume, app.fullName)}
                            className="inline-flex cursor-pointer items-center text-sm text-yellow-400 hover:text-yellow-300"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Resume
                          </button>
                          <button
                            onClick={() => handleDeleteClick(app._id)}
                            disabled={isDeleteLoading}
                            className="inline-flex cursor-pointer items-center text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
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

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {currentApplications.length === 0 ? (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center text-gray-400">
              No applications found
            </div>
          ) : (
            currentApplications.map((app) => (
              <div key={app._id} className="bg-gray-900 rounded-lg border border-gray-800 p-4 sm:p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{app.fullName}</h3>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        {app.jobTitle}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-16">Email:</span>
                    <span className="text-gray-300">{app.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-16">Phone:</span>
                    <span className="text-gray-300">{app.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-16">Date:</span>
                    <span className="text-gray-400">{formatDate(app.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => handleViewResume(app.resume, app.fullName)}
                    className="flex-1 inline-flex cursor-pointer justify-center items-center px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm font-medium"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Resume
                  </button>
                  <button
                    onClick={() => handleDeleteClick(app._id)}
                    disabled={isDeleteLoading}
                    className="flex-1 inline-flex cursor-pointer justify-center items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="text-gray-400 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {showResumeModal && selectedResume && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-5xl h-[90vh] rounded-lg flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-800">
              <h3 className="text-white text-base sm:text-lg font-semibold">
                Resume – {selectedResume.name}
              </h3>
              <div className="flex gap-3 w-full sm:w-auto">
                <a
                  href={selectedResume.url}
                  download
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-300 px-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              {isPdf ? (
                <iframe
                  src={selectedResume.url}
                  className="w-full h-full rounded border border-gray-800"
                  title="Resume"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
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
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={isDeleteLoading}
                className="px-4 py-2 cursor-pointer bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleteLoading}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 inline-flex items-center justify-center"
              >
                {isDeleteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-semibold mb-2">Confirm Delete All</h3>
            <p className="text-gray-400 mb-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-400">
                ALL {applications.length} applications
              </span>
              ?
            </p>
            <p className="text-red-400 mb-6 font-semibold">
              This action cannot be undone!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={cancelDeleteAll}
                disabled={deletedAllDataLoading}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAll}
                disabled={deletedAllDataLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 inline-flex items-center justify-center"
              >
                {deletedAllDataLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting All...
                  </>
                ) : (
                  "Delete All"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobEnquiry;