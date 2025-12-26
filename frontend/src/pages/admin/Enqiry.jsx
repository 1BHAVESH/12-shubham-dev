import {
  useDeleteEnquiryMutation,
  useExcelImportEnquiriesMutation,
  useGetAllContactsQuery,
  useSearchEnquiriesQuery,
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
  ChevronLeft,
  ChevronRight,
  Database,
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
  project: yup.string().optional(),
  message: yup.string().optional(),
});

// Sample data generator
const generateSampleData = (count = 10, projects = []) => {
  const firstNames = [
    "Raj",
    "Priya",
    "Amit",
    "Sneha",
    "Vikram",
    "Ananya",
    "Rahul",
    "Kavya",
    "Arjun",
    "Meera",
    "Sanjay",
    "Pooja",
    "Karan",
    "Nisha",
    "Rohan",
  ];
  const lastNames = [
    "Sharma",
    "Patel",
    "Kumar",
    "Singh",
    "Gupta",
    "Verma",
    "Mehta",
    "Reddy",
    "Joshi",
    "Nair",
    "Iyer",
    "Desai",
    "Chopra",
    "Malhotra",
    "Agarwal",
  ];
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const messages = [
    "I am interested in knowing more about this project.",
    "Could you please share the brochure and pricing details?",
    "I would like to schedule a site visit.",
    "What are the payment plans available?",
    "Is this project ready to move in?",
    "Please contact me with more information.",
    "I am looking for a 2BHK apartment in this location.",
    "What amenities are included in this project?",
  ];

  const sampleData = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(
      Math.random() * 100
    )}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const phone = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const project =
      projects.length > 0
        ? projects[Math.floor(Math.random() * projects.length)].title
        : "N/A";
    const message =
      Math.random() > 0.3
        ? messages[Math.floor(Math.random() * messages.length)]
        : "";

    sampleData.push({
      fullName,
      email,
      phone,
      project,
      message,
    });
  }

  return sampleData;
};

const getProjectTitle = (project) => {
  if (!project) return "";
  if (typeof project === "string") return project;
  if (typeof project === "object" && project.title) return project.title;
  return "";
};

function Enquiry() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(enquirySchema),
  });

  const { data, isLoading, error, refetch } = useGetAllContactsQuery();
  const [excelImportEnquiries] = useExcelImportEnquiriesMutation();
  const [deleteEnquiry, { isLoading: deleteLoading }] =
    useDeleteEnquiryMutation();
  const [mailSend, { isLoading: mailSendLoading }] = useMailSendMutation();
  const { data: projectTitleData, isLoading: projectTitleLoading } =
    useGetProjectTitleQuery();

  // State
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
  const [showSampleDataModal, setShowSampleDataModal] = useState(false);
  const [sampleDataCount, setSampleDataCount] = useState(10);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: searchResult, isFetching } = useSearchEnquiriesQuery(
    searchTerm,
    {
      skip: !searchTerm,
    }
  );

  // Load data from API
  useEffect(() => {
    if (data?.data) {
      setEnquiries(data.data);
    }
  }, [data]);

  // Socket listener for real-time updates
  useEffect(() => {
    const handleNewEnquiry = (newEnquiry) => {
      setEnquiries((prev) => {
        const exists = prev.some((e) => e._id === newEnquiry._id);
        if (exists) return prev;
        return [newEnquiry, ...prev];
      });
    };

    socket.on("newEnquiry", handleNewEnquiry);
    return () => socket.off("newEnquiry", handleNewEnquiry);
  }, []);

  // Filter and sort enquiries
  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries;

    if (selectedProject !== "all") {
      filtered = filtered.filter((enq) => {
        const projectTitle = getProjectTitle(enq.project);
        return projectTitle === selectedProject;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((enq) => {
        const projectTitle = getProjectTitle(enq.project);
        return (
          enq.fullName?.toLowerCase().includes(term) ||
          enq.email?.toLowerCase().includes(term) ||
          enq.phone?.includes(searchTerm) ||
          projectTitle.toLowerCase().includes(term)
        );
      });
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (sortConfig.key === "createdAt") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [enquiries, searchTerm, selectedProject, sortConfig]);

  let finalEnquiries = filteredEnquiries;

  if (searchTerm) {
    // local search se kuch nahi mila
    if (filteredEnquiries.length === 0) {
      if (searchResult?.data === null) {
        finalEnquiries = [];
      } else if (Array.isArray(searchResult?.data)) {
        finalEnquiries = searchResult.data;
      }
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(finalEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnquiries = finalEnquiries.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProject, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  }, []);

  const getSortIcon = useCallback(
    (columnKey) => {
      if (sortConfig.key !== columnKey)
        return <ArrowUpDown size={16} className="opacity-40" />;
      return sortConfig.direction === "asc" ? (
        <ArrowUp size={16} />
      ) : (
        <ArrowDown size={16} />
      );
    },
    [sortConfig]
  );

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

  const handleExportToExcel = useCallback(() => {
    const exportData = filteredEnquiries.map((enq) => ({
      fullName: enq.fullName || "",
      email: enq.email || "",
      phone: enq.phone || "",
      Project: enq.project?.title || "N/A",
      project_id: enq.project?._id || "N/A",
      Message: enq.message || "",
      "Submitted On": formatDate(enq.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 25 },
      { wch: 40 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `enquiries_${date}.xlsx`);
  }, [filteredEnquiries, formatDate]);

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
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validatedData = [];
        const errors = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2;
          const enquiryData = {
            fullName: row["Full Name"] || row["fullName"] || "",
            email: row["Email"] || row["email"] || "",
            phone: String(row["Phone"] || row["phone"] || ""),
            project: row["Project"] || row["project"] || "N/A",
            Project_Id: row["project_id"] || "N/A",
            message: row["Message"] || row["message"] || "",
          };

          try {
            enquirySchema.validateSync(enquiryData, { abortEarly: false });
            validatedData.push(enquiryData);
          } catch (err) {
            const rowErrors = err.inner.map((e) => `${e.path}: ${e.message}`);
            errors.push({ row: rowNum, errors: rowErrors, data: enquiryData });
          }
        });

        setImportPreview(validatedData);
        setImportErrors(errors);

        if (validatedData.length === 0 && errors.length > 0) {
          alert(
            "No valid entries found in the Excel file. Please check the format."
          );
        }
      } catch (err) {
        alert("Error reading file. Please ensure it's a valid Excel file.");
        setImportFile(null);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (importPreview.length === 0) {
      alert("No valid data to import");
      return;
    }

    try {
      await excelImportEnquiries(importFile).unwrap();
      await refetch(); // Refresh the main enquiries list
      alert(`Successfully imported ${importPreview.length} enquiries`);
      setShowImportModal(false);
      setImportFile(null);
      setImportPreview([]);
      setImportErrors([]);
    } catch (err) {
      console.error("Excel import error:", err);
      alert("Failed to import Excel enquiries");
    }
  };

  const handleGenerateSampleData = async () => {
    const uniqueProjects = projectTitleData?.titles || [];
    const sampleData = generateSampleData(sampleDataCount, uniqueProjects);

    try {
      await excelImportEnquiries(sampleData).unwrap();
      await refetch(); // Refresh the main enquiries list
      alert(`Successfully generated ${sampleDataCount} sample enquiries`);
      setShowSampleDataModal(false);
    } catch (err) {
      console.error("Sample data generation error:", err);
      alert("Failed to generate sample data");
    }
  };

  const onSubmitEnquiry = async (formData) => {
    try {
      await mailSend(formData);
      reset();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || projectTitleLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Data</div>
          <p className="text-gray-400">
            {error?.data?.message || "Failed to load enquiries"}
          </p>
        </div>
      </div>
    );
  }

  const uniqueProjects = projectTitleData?.titles || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Enquiry Management
          </h1>
          <p className="text-gray-400">
            Total: {enquiries.length} | Filtered: {filteredEnquiries.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowSampleDataModal(true)}
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <Database size={20} />
            Sample Data
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <Upload size={20} />
            Import
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-purple-500 cursor-pointer hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
            >
              <option value="all">All Projects</option>
              {uniqueProjects.map((project) => (
                <option key={project._id} value={project.title}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          {(searchTerm || selectedProject !== "all" || sortConfig.key) && (
            <div className="md:col-span-1">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
                title="Clear all filters"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="text-white">
            <tr>
              <th
                onClick={() => handleSort("fullName")}
                className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Name {getSortIcon("fullName")}
                </div>
              </th>
              <th
                onClick={() => handleSort("email")}
                className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Email {getSortIcon("email")}
                </div>
              </th>
              <th
                onClick={() => handleSort("phone")}
                className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Phone {getSortIcon("phone")}
                </div>
              </th>
              <th
                onClick={() => handleSort("project")}
                className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Project {getSortIcon("project")}
                </div>
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Date {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedEnquiries.map((enquiry) => (
              <tr
                key={enquiry._id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 text-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {enquiry.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 truncate">
                  {enquiry.email}
                </td>
                <td className="px-6 py-4 text-gray-300">{enquiry.phone}</td>
                <td className="px-6 py-4 text-gray-300 truncate">
                  {enquiry.project == null ? "N/A" : enquiry.project.title}
                </td>
                <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                  {formatDate(enquiry.createdAt)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(enquiry)}
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
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
            <p>No enquiries found</p>
          </div>
        )}
        {searchTerm && finalEnquiries.length === 0 && !isFetching && (
          <p className="text-red-400 text-center py-6">
            Not Found ❌
          </p>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {paginatedEnquiries.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-800 rounded-lg">
            <MessageSquare className="mx-auto mb-2" size={40} />
            <p>No enquiries found</p>
          </div>
        ) : (
          paginatedEnquiries.map((enquiry) => (
            <div
              key={enquiry._id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2 gap-2">
                    <User className="text-yellow-500" size={18} />
                    <h3 className="font-semibold text-white">
                      {enquiry.fullName}
                    </h3>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <Mail className="mr-2 text-yellow-500" size={14} />
                    <span className="truncate">{enquiry.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <Phone className="mr-2 text-yellow-500" size={14} />
                    <span>{enquiry.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <MessageSquare className="mr-2 text-yellow-500" size={14} />
                    <span className="truncate">
                      {enquiry.project == null ? "N/A" : enquiry.project.title}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs mt-2">
                    <Calendar className="mr-2" size={12} />
                    <span>{formatDate(enquiry.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="flex-1 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => setDeleteConfirm(enquiry)}
                  className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-2"
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

      {/* Pagination Controls */}
      {filteredEnquiries.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredEnquiries.length)} of{" "}
            {filteredEnquiries.length} enquiries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 cursor-pointer rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-yellow-500 text-gray-900 font-semibold"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Sample Data Modal */}
      {showSampleDataModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSampleDataModal(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">
                Generate Sample Data
              </h2>
              <button
                onClick={() => setShowSampleDataModal(false)}
                className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Generate realistic sample enquiry data for testing and
                demonstration purposes.
              </p>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Number of Entries
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={sampleDataCount}
                  onChange={(e) =>
                    setSampleDataCount(
                      Math.min(100, Math.max(5, parseInt(e.target.value) || 10))
                    )
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Choose between 5 and 100 sample entries
                </p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">
                  Sample Data Includes:
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>✓ Realistic Indian names</li>
                  <li>✓ Valid email addresses</li>
                  <li>✓ 10-digit phone numbers</li>
                  <li>✓ Random project assignments</li>
                  <li>✓ Common enquiry messages</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowSampleDataModal(false)}
                  className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateSampleData}
                  disabled={mailSendLoading}
                  className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {mailSendLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Database size={18} />
                      Generate {sampleDataCount} Entries
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                className="text-gray-400 cursor-pointer hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <User className="text-yellow-500 mt-1 mr-3" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white text-lg">
                    {selectedEnquiry.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="text-yellow-500 mt-1 mr-3" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white break-all">
                    {selectedEnquiry.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-yellow-500 mt-1 mr-3" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{selectedEnquiry.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare
                  className="text-yellow-500 mt-1 mr-3"
                  size={18}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">Project</p>
                  <p className="text-white break-words">
                    {selectedEnquiry.project
                      ? getProjectTitle(selectedEnquiry.project)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div className="flex items-start">
                  <MessageSquare
                    className="text-yellow-500 mt-1 mr-3"
                    size={18}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-sm">Message</p>
                    <p className="text-white whitespace-pre-wrap break-words">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Calendar className="text-yellow-500 mt-1 mr-3" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Submitted On</p>
                  <p className="text-white">
                    {formatDate(selectedEnquiry.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(selectedEnquiry);
                  setSelectedEnquiry(null);
                }}
                className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
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
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
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
                className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleteLoading}
                className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
            className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">
                Import Enquiries from Excel
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
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

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowImportModal(false);
                        setImportFile(null);
                        setImportPreview([]);
                        setImportErrors([]);
                      }}
                      className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={importPreview.length === 0 || mailSendLoading}
                      className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">Add New Enquiry</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitEnquiry)}
              className="space-y-4"
            >
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
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

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
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      },
                    })}
                    inputMode="numeric"
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

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
                    {uniqueProjects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.project && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.project.message}
                  </p>
                )}
              </div>

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

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mailSendLoading}
                  className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {mailSendLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Enquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enquiry;
