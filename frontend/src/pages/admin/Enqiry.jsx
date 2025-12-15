import {
  useDeleteEnquiryMutation,
  useGetAllContactsQuery,
} from "@/redux/features/adminApi";
import React, { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Eye,
  Trash2,
} from "lucide-react";

const Enquiry = () => {
  const { data, isLoading } = useGetAllContactsQuery();

  const [deleteEnquiry, { isLoading: deleteLoading }] =
    useDeleteEnquiryMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    console.log(selectedEnquiry);
  }, [selectedEnquiry]);

  const handleDelete = async (id) => {
    try {
      await deleteEnquiry(id).unwrap();
      setDeleteConfirm(null);
      setSelectedEnquiry(null);
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
    }
  };

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

  const enquiries = data?.data || [];

const filteredEnquiries = enquiries.filter(
  (enquiry) =>
    enquiry.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from fullname to fullName
    enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.phone?.includes(searchTerm) ||
    enquiry.project?.toLowerCase().includes(searchTerm.toLowerCase()) // Added project search for better UX
);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log(enquiries);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Enquiry Management
        </h1>
        <p className="text-gray-400">Total Enquiries: {enquiries.length}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-yellow-500 to-yellow-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEnquiries.map((enquiry, index) => (
                <tr
                  key={enquiry._id}
                  className={`hover:bg-gray-700 transition-colors ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="text-gray-500 mr-2" size={18} />
                      <span className="text-sm font-medium text-gray-200">
                        {enquiry.fullName || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Mail
                        className="text-gray-500 mr-2 flex-shrink-0"
                        size={18}
                      />
                      <span className="text-sm text-gray-300 truncate max-w-xs">
                        {enquiry.email || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="text-gray-500 mr-2" size={18} />
                      <span className="text-sm text-gray-300">
                        {enquiry.phone || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {enquiry.project || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="text-gray-500 mr-2" size={18} />
                      <span className="text-sm text-gray-300">
                        {formatDate(enquiry.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="inline-flex cursor-pointer items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye className="mr-1" size={16} />
                        View
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(enquiry)}
                        disabled={deleteLoading}
                        className="inline-flex cursor-pointer items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="mr-1" size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg">No enquiries found</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Enquiry Details
                </h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-gray-900 cursor-pointer hover:cursor-pointer hover:bg-opacity-10 p-2 rounded-full transition w-8 h-8 flex items-center justify-center text-xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    Full Name
                  </label>
                  <p className="text-white text-lg font-medium">
                    {selectedEnquiry.fullName || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    Phone
                  </label>
                  <p className="text-white text-lg font-medium">
                    {selectedEnquiry.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                  Email
                </label>
                <p className="text-white break-all">
                  {selectedEnquiry.email || "N/A"}
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                  Project
                </label>
                <p className="text-white">{selectedEnquiry.project || "N/A"}</p>
              </div>

              <div className="bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 p-4 rounded-lg">
                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center">
                  <MessageSquare size={16} className="mr-2" />
                  Message
                </label>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message || "No message provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    Date
                  </label>
                  <p className="text-gray-300 text-sm">
                    {formatDate(selectedEnquiry.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 border-t border-gray-700">
              <button
                onClick={() => setDeleteConfirm(selectedEnquiry)}
                className="px-6 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-6 py-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-600 p-6">
              <div className="flex items-center gap-3">
                <Trash2 size={24} className="text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Delete Enquiry
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete the enquiry from{" "}
                <span className="font-semibold text-white">
                  {deleteConfirm.fullName}
                </span>
                ?
              </p>
              <p className="text-gray-400 text-sm">
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-900 px-6 py-4 flex justify-end gap-3 border-t border-gray-700">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
                className="px-6 py-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleteLoading}
                className="px-6 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
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
