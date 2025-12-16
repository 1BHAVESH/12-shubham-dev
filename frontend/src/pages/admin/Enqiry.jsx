import {
  useDeleteEnquiryMutation,
  useGetAllContactsQuery,
} from "@/redux/features/adminApi";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { socket } from "@/socket";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Eye,
  Trash2,
  X,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useGetProjectTitleQuery } from "@/redux/features/shubamdevApi";

const Enquiry = () => {
  const { data, isLoading, error } = useGetAllContactsQuery();
  const [deleteEnquiry, { isLoading: deleteLoading }] =
    useDeleteEnquiryMutation();

  const { data: projectTitleData, isLoading: projectTitleLoading } = useGetProjectTitleQuery();

  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Initial load from API
  useEffect(() => {
    if (data?.data) {
      setEnquiries(data.data);
    }
  }, [data]);

  // Real-time socket listener with cleanup
  useEffect(() => {
    const handleNewEnquiry = (newEnquiry) => {
      setEnquiries((prev) => [newEnquiry, ...prev]);
    };

    socket.on("newEnquiry", handleNewEnquiry);

    return () => {
      socket.off("newEnquiry", handleNewEnquiry);
    };
  }, []);

  // Sorting function
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // If clicking the same column, toggle direction
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          // Reset sorting on third click
          return { key: null, direction: 'asc' };
        }
      }
      // New column, start with ascending
      return { key, direction: 'asc' };
    });
  }, []);

  // Get sort icon
  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={16} className="opacity-40" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp size={16} />;
    }
    return <ArrowDown size={16} />;
  }, [sortConfig]);

  // Memoized filtered and sorted enquiries
  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries;

    // Filter by project if not "all"
    if (selectedProject !== "all") {
      filtered = filtered.filter(
        (enquiry) => enquiry.project === selectedProject
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.fullName?.toLowerCase().includes(term) ||
          enquiry.email?.toLowerCase().includes(term) ||
          enquiry.phone?.includes(searchTerm) ||
          enquiry.project?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue == null) aValue = '';
        if (bValue == null) bValue = '';

        // Convert to lowercase for string comparison
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        // Special handling for dates
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [enquiries, searchTerm, selectedProject, sortConfig]);

  // Get unique project titles from enquiries
  const uniqueProjects = useMemo(() => {
    const projects = new Set(
      enquiries.map((enquiry) => enquiry.project).filter(Boolean)
    );
    return Array.from(projects).sort();
  }, [enquiries]);

  // Delete handler with error handling
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteEnquiry(id).unwrap();
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
      setDeleteConfirm(null);
      setSelectedEnquiry(null);
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
      alert("Failed to delete enquiry. Please try again.");
    }
  }, [deleteEnquiry]);

  // Format date utility
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProject("all");
    setSortConfig({ key: null, direction: 'asc' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Data</div>
          <p className="text-gray-400">{error?.data?.message || "Failed to load enquiries"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Enquiry Management
        </h1>
        <p className="text-gray-400">
          Total Enquiries: {enquiries.length} | Filtered: {filteredEnquiries.length}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or project..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label="Search enquiries"
            />
          </div>

          {/* Project Filter Dropdown */}
          <div className="md:col-span-4 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer"
              aria-label="Filter by project"
            >
              <option value="all">All Projects</option>
              {uniqueProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedProject !== "all" || sortConfig.key) && (
            <div className="md:col-span-1">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Clear all filters"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedProject !== "all" || sortConfig.key) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-yellow-600 rounded-full p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedProject !== "all" && (
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                Project: {selectedProject}
                <button
                  onClick={() => setSelectedProject("all")}
                  className="hover:bg-yellow-600 cursor-pointer rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {sortConfig.key && (
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                Sorted by: {sortConfig.key === 'fullName' ? 'Name' : 
                           sortConfig.key === 'createdAt' ? 'Date' : 
                           sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)} 
                ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                <button
                  onClick={() => setSortConfig({ key: null, direction: 'asc' })}
                  className="hover:bg-yellow-600 cursor-pointer rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-yellow-500 text-gray-900">
            <tr>
              <th 
                onClick={() => handleSort('fullName')}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-yellow-600 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Name
                  {getSortIcon('fullName')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-yellow-600 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Email
                  {getSortIcon('email')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('phone')}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-yellow-600 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Phone
                  {getSortIcon('phone')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('project')}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-yellow-600 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Project
                  {getSortIcon('project')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('createdAt')}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-yellow-600 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  Date
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredEnquiries.map((enquiry) => (
              <tr key={enquiry._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 text-gray-200">
                  <div className="flex items-center">
                    <User className="mr-2 flex-shrink-0" size={16} />
                    <span className="truncate">{enquiry.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 truncate">{enquiry.email}</td>
                <td className="px-6 py-4 text-gray-300">{enquiry.phone}</td>
                <td className="px-6 py-4 text-gray-300 truncate">{enquiry.project}</td>
                <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                  {formatDate(enquiry.createdAt)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded transition-colors cursor-pointer"
                      aria-label={`View details for ${enquiry.fullName}`}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(enquiry)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                      aria-label={`Delete enquiry from ${enquiry.fullName}`}
                      title="Delete Enquiry"
                      disabled={deleteLoading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <MessageSquare className="mx-auto mb-2" size={48} />
            <p className="text-lg">
              {searchTerm || selectedProject !== "all"
                ? "No enquiries match your filters"
                : "No enquiries found"}
            </p>
            {(searchTerm || selectedProject !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedEnquiry && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div 
            className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <User className="text-yellow-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white text-lg">{selectedEnquiry.fullName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="text-yellow-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{selectedEnquiry.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-yellow-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{selectedEnquiry.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare className="text-yellow-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Project</p>
                  <p className="text-white">{selectedEnquiry.project}</p>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div className="flex items-start">
                  <MessageSquare className="text-yellow-500 mt-1 mr-3" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Message</p>
                    <p className="text-white whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Calendar className="text-yellow-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Submitted On</p>
                  <p className="text-white">{formatDate(selectedEnquiry.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(selectedEnquiry);
                  setSelectedEnquiry(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors cursor-pointer"
              >
                Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div 
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the enquiry from{" "}
              <span className="font-semibold text-yellow-500">{deleteConfirm.fullName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
    </div>
  );
};

export default Enquiry;