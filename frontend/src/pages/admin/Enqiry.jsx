import {
  useDeleteEnquiryMutation,
  useExcelImportEnquiriesMutation,
  useGetAllContactsQuery,
  useGetExcelEnquiriesQuery,
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
  Plus,
  Download,
  Upload,
} from "lucide-react";
import {
  useGetProjectTitleQuery,
  useMailSendMutation,
} from "@/redux/features/shubamdevApi";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const enquirySchema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .trim()
    .matches(
      /^[A-Za-z]+( [A-Za-z]+)*$/,
      "Only letters with single space allowed"
    ),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(/^\S+$/, "Spaces not allowed"),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),

  project: yup.string().required("Project is required"),

  message: yup.string().optional(),
});

function Enquiry() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(enquirySchema),
  });
  const { data, isLoading, error } = useGetAllContactsQuery();
  const [excelImportEnquiries] = useExcelImportEnquiriesMutation();
  const {
    data: excelData,
    isLoading: excelLoading,
    error: excelError,
  } = useGetExcelEnquiriesQuery();
  const [deleteEnquiry, { isLoading: deleteLoading }] =
    useDeleteEnquiryMutation();

  const [mailSend, { isLoading: mailSendLoading }] = useMailSendMutation();

  const { data: projectTitleData, isLoading: projectTitleLoading } =
    useGetProjectTitleQuery();
const [showImported, setShowImported] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);

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

  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries;

    if (selectedProject !== "all") {
      filtered = filtered.filter(
        (enquiry) => enquiry.project === selectedProject
      );
    }

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

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue == null) aValue = "";
        if (bValue == null) bValue = "";

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (sortConfig.key === "createdAt") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [enquiries, searchTerm, selectedProject, sortConfig]);

  // Export to Excel
  const handleExportToExcel = useCallback(() => {
    // Prepare data for export
    const exportData = filteredEnquiries.map((enquiry) => ({
      "Full Name": enquiry.fullName,
      Email: enquiry.email,
      Phone: enquiry.phone,
      Project: enquiry.project,
      Message: enquiry.message || "",
      "Submitted On": formatDate(enquiry.createdAt),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 25 }, // Project
      { wch: 40 }, // Message
      { wch: 20 }, // Submitted On
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `enquiries_${date}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  }, [filteredEnquiries]);

  // Handle file selection for import
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFile(file);
    setImportErrors([]);
    setImportPreview([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and transform data
        const validatedData = [];
        const errors = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2; // +2 because Excel is 1-indexed and has header row
          const rowErrors = [];

          // Map Excel columns to our schema
          const enquiryData = {
            fullName: row["Full Name"] || row["fullName"] || "",
            email: row["Email"] || row["email"] || "",
            phone: String(row["Phone"] || row["phone"] || ""),
            project: row["Project"] || row["project"] || "",
            message: row["Message"] || row["message"] || "",
          };

          // Validate each field
          try {
            enquirySchema.validateSync(enquiryData, { abortEarly: false });
            validatedData.push(enquiryData);
          } catch (err) {
            err.inner.forEach((validationError) => {
              rowErrors.push(
                `${validationError.path}: ${validationError.message}`
              );
            });
            errors.push({ row: rowNum, errors: rowErrors, data: enquiryData });
          }
        });

        setImportPreview(validatedData);
        setImportErrors(errors);
      } catch (err) {
        alert("Error reading file. Please ensure it's a valid Excel file.");
        setImportFile(null);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Import enquiries
  const handleImport = async () => {
    if (importPreview.length === 0) {
      alert("No valid data to import");
      return;
    }

    try {
      await excelImportEnquiries(importPreview).unwrap();

      alert(`Imported ${importPreview.length} enquiries`);

      setShowImportModal(false);
      setImportFile(null);
      setImportPreview([]);
      setImportErrors([]);

      // 🔥 UI ko imported mode me switch karo
      setShowImported(true);
    } catch (err) {
      console.error("Excel import error:", err);
      alert("Failed to import Excel enquiries");
    }
  };

  // Download Excel template
  const downloadTemplate = () => {
    const templateData = [
      {
        "Full Name": "John Doe",
        Email: "john@example.com",
        Phone: "1234567890",
        Project: "Project Name",
        Message: "Optional message",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 25 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "enquiry_template.xlsx");
  };

  // Sorting function
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "asc") {
          return { key, direction: "desc" };
        } else if (prevConfig.direction === "desc") {
          return { key: null, direction: "asc" };
        }
      }
      return { key, direction: "asc" };
    });
  }, []);

  const enquiriesForUI = showImported
  ? excelData?.data || []
  : filteredEnquiries;

  // Get sort icon
  const getSortIcon = useCallback(
    (columnKey) => {
      if (sortConfig.key !== columnKey) {
        return <ArrowUpDown size={16} className="opacity-40" />;
      }
      if (sortConfig.direction === "asc") {
        return <ArrowUp size={16} />;
      }
      return <ArrowDown size={16} />;
    },
    [sortConfig]
  );

  // Memoized filtered and sorted enquiries

  const uniqueProjects = projectTitleData?.titles;

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteEnquiry(id).unwrap();
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        setDeleteConfirm(null);
        setSelectedEnquiry(null);
      } catch (error) {
        console.error("Failed to delete enquiry:", error);
        alert("Failed to delete enquiry. Please try again.");
      }
    },
    [deleteEnquiry]
  );

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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProject("all");
    setSortConfig({ key: null, direction: "asc" });
  };

  const onSubmitEnquiry = async (formData) => {
    try {
      const response = await mailSend(formData);
      console.log(response);
      reset();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            Loading enquiries...
          </p>
        </div>
      </div>
    );
  }

  if (projectTitleLoading) return <h1>wait...</h1>;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
        <div className="text-center">
          <div className="text-red-500 text-lg sm:text-xl mb-4">
            ⚠️ Error Loading Data
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            {error?.data?.message || "Failed to load enquiries"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Enquiry Management
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Total: {enquiries.length} | Filtered: {filteredEnquiries.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* <button
            onClick={downloadTemplate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 font-semibold text-sm sm:text-base"
          >
            <Download size={20} />
            Template
          </button> */}
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 font-semibold text-sm sm:text-base"
          >
            <Upload size={20} />
            Import
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 font-semibold text-sm sm:text-base"
          >
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 font-semibold text-sm sm:text-base"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 sm:mb-6 bg-gray-800 rounded-lg p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-3 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
              aria-label="Search enquiries"
            />
          </div>

          <div className="md:col-span-4 relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer text-sm sm:text-base"
              aria-label="Filter by project"
            >
              <option value="all">All Projects</option>
              {uniqueProjects?.map((project) => (
                <option key={project._id} value={project.title}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedProject !== "all" || sortConfig.key) && (
            <div className="md:col-span-1">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Clear all filters"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {(searchTerm || selectedProject !== "all" || sortConfig.key) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="bg-yellow-500 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                Search: "
                {searchTerm.length > 20
                  ? searchTerm.substring(0, 20) + "..."
                  : searchTerm}
                "
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-yellow-600 rounded-full p-0.5 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedProject !== "all" && (
              <span className="bg-yellow-500 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                Project: {selectedProject}
                <button
                  onClick={() => setSelectedProject("all")}
                  className="hover:bg-yellow-600 cursor-pointer rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {sortConfig.key && (
              <span className="bg-yellow-500 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                Sorted:{" "}
                {sortConfig.key === "fullName"
                  ? "Name"
                  : sortConfig.key === "createdAt"
                  ? "Date"
                  : sortConfig.key.charAt(0).toUpperCase() +
                    sortConfig.key.slice(1)}
                ({sortConfig.direction === "asc" ? "↑" : "↓"})
                <button
                  onClick={() => setSortConfig({ key: null, direction: "asc" })}
                  className="hover:bg-yellow-600 cursor-pointer rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-gray-800 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="text-white">
            <tr>
              <th
                onClick={() => handleSort("fullName")}
                className="px-4 xl:px-6 py-3 xl:py-4 text-left font-semibold cursor-pointer select-none text-sm xl:text-base"
              >
                <div className="flex items-center gap-2">
                  Name
                  {getSortIcon("fullName")}
                </div>
              </th>
              <th
                onClick={() => handleSort("email")}
                className="px-4 xl:px-6 py-3 xl:py-4 text-left font-semibold cursor-pointer select-none text-sm xl:text-base"
              >
                <div className="flex items-center gap-2">
                  Email
                  {getSortIcon("email")}
                </div>
              </th>
              <th
                onClick={() => handleSort("phone")}
                className="px-4 xl:px-6 py-3 xl:py-4 text-left font-semibold cursor-pointer select-none text-sm xl:text-base"
              >
                <div className="flex items-center gap-2">
                  Phone
                  {getSortIcon("phone")}
                </div>
              </th>
              <th
                onClick={() => handleSort("project")}
                className="px-4 xl:px-6 py-3 xl:py-4 text-left font-semibold cursor-pointer select-none text-sm xl:text-base"
              >
                <div className="flex items-center gap-2">
                  Project
                  {getSortIcon("project")}
                </div>
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className="px-4 xl:px-6 py-3 xl:py-4 text-left font-semibold cursor-pointer select-none text-sm xl:text-base"
              >
                <div className="flex items-center gap-2">
                  Date
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-center font-semibold text-sm xl:text-base">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredEnquiries.map((enquiry) => (
              <tr
                key={enquiry._id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-gray-200">
                  <div className="flex items-center">
                    <User className="mr-2 flex-shrink-0" size={16} />
                    <span className="truncate text-sm xl:text-base">
                      {enquiry.fullName}
                    </span>
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-gray-300 truncate text-sm xl:text-base">
                  {enquiry.email}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-gray-300 text-sm xl:text-base">
                  {enquiry.phone}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-gray-300 truncate text-sm xl:text-base">
                  {enquiry.project}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-gray-300 whitespace-nowrap text-sm xl:text-base">
                  {formatDate(enquiry.createdAt)}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-center">
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
            <p className="text-base xl:text-lg">
              {searchTerm || selectedProject !== "all"
                ? "No enquiries match your filters"
                : "No enquiries found"}
            </p>
            {(searchTerm || selectedProject !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition-colors cursor-pointer text-sm xl:text-base"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-800 rounded-lg">
            <MessageSquare className="mx-auto mb-2" size={40} />
            <p className="text-base">
              {searchTerm || selectedProject !== "all"
                ? "No enquiries match your filters"
                : "No enquiries found"}
            </p>
            {(searchTerm || selectedProject !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg transition-colors cursor-pointer text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry._id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User
                      className="mr-2 text-yellow-500 flex-shrink-0"
                      size={18}
                    />
                    <h3 className="font-semibold text-white text-base">
                      {enquiry.fullName}
                    </h3>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <Mail
                      className="mr-2 text-yellow-500 flex-shrink-0"
                      size={14}
                    />
                    <span className="truncate">{enquiry.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <Phone
                      className="mr-2 text-yellow-500 flex-shrink-0"
                      size={14}
                    />
                    <span>{enquiry.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <MessageSquare
                      className="mr-2 text-yellow-500 flex-shrink-0"
                      size={14}
                    />
                    <span className="truncate">{enquiry.project}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs mt-2">
                    <Calendar className="mr-2 flex-shrink-0" size={12} />
                    <span>{formatDate(enquiry.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-2 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => setDeleteConfirm(enquiry)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Enquiry Details
              </h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start">
                <User
                  className="text-yellow-500 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Full Name</p>
                  <p className="text-white text-base sm:text-lg">
                    {selectedEnquiry.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail
                  className="text-yellow-500 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                  <p className="text-white text-sm sm:text-base break-all">
                    {selectedEnquiry.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone
                  className="text-yellow-500 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Phone</p>
                  <p className="text-white text-sm sm:text-base">
                    {selectedEnquiry.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare
                  className="text-yellow-500 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm">Project</p>
                  <p className="text-white text-sm sm:text-base break-words">
                    {selectedEnquiry.project}
                  </p>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div className="flex items-start">
                  <MessageSquare
                    className="text-yellow-500 mt-1 mr-3 flex-shrink-0"
                    size={18}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Message</p>
                    <p className="text-white text-sm sm:text-base whitespace-pre-wrap break-words">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Calendar
                  className="text-yellow-500 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Submitted On
                  </p>
                  <p className="text-white text-sm sm:text-base">
                    {formatDate(selectedEnquiry.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors cursor-pointer text-sm sm:text-base"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(selectedEnquiry);
                  setSelectedEnquiry(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors cursor-pointer text-sm sm:text-base"
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
            className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete the enquiry from{" "}
              <span className="font-semibold text-yellow-500">
                {deleteConfirm.fullName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
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

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Import Enquiries from Excel
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-500 file:text-white file:cursor-pointer hover:file:bg-green-600"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Supported formats: .xlsx, .xls
                </p>
              </div>

              {/* Preview Section */}
              {importFile && (
                <>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">
                      File: {importFile.name}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Valid Entries: {importPreview.length}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Invalid Entries: {importErrors.length}
                    </p>
                  </div>

                  {/* Show Valid Entries */}
                  {importPreview.length > 0 && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-green-500 font-semibold mb-3">
                        ✓ Valid Entries ({importPreview.length})
                      </h3>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {importPreview.slice(0, 5).map((entry, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-800 p-2 rounded text-sm"
                          >
                            <p className="text-white">
                              {entry.fullName} - {entry.email} - {entry.phone}
                            </p>
                            <p className="text-gray-400">{entry.project}</p>
                          </div>
                        ))}
                        {importPreview.length > 5 && (
                          <p className="text-gray-400 text-sm">
                            ... and {importPreview.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show Errors */}
                  {importErrors.length > 0 && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-red-500 font-semibold mb-3">
                        ✗ Invalid Entries ({importErrors.length})
                      </h3>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {importErrors.map((error, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-800 p-2 rounded text-sm"
                          >
                            <p className="text-red-400 font-semibold">
                              Row {error.row}:
                            </p>
                            <ul className="text-gray-300 list-disc list-inside">
                              {error.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Import Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowImportModal(false);
                        setImportFile(null);
                        setImportPreview([]);
                        setImportErrors([]);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors cursor-pointer text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={importPreview.length === 0 || mailSendLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors cursor-pointer font-semibold text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {mailSendLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Import {importPreview.length} Enquiries
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Enquiry Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Add New Enquiry
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitEnquiry)}
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    {...register("fullName")}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.fullName?.message}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    {...register("email")}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.email?.message}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    {...register("phone", {
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      },
                    })}
                    inputMode="numeric"
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.phone?.message}
                  </p>
                </div>
              </div>

              {/* Project */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Project <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Filter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <select
                    {...register("project")}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select a project</option>
                    {uniqueProjects?.map((project) => (
                      <option key={project._id} value={project.title}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500 text-sm">
                    {errors.project?.message}
                  </p>
                </div>
              </div>

              {/* Message (Optional) */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Message <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-3 top-3 text-gray-500"
                    size={18}
                  />
                  <textarea
                    {...register("message")}
                    rows="4"
                    placeholder="Enter message"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded transition-colors cursor-pointer font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
  <span>{enquiries.fullName}</span>

  {showImported && (
    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
      Imported
    </span>
  )}
</div>
    </div>
  );
}

export default Enquiry;
