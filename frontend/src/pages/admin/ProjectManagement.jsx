import { useState } from "react";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/admin/ProjectForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useToggleProjectMutation,
} from "@/redux/features/adminApi";

import DataTable from "@/components/common/DataTable";
import useDataTable from "@/hooks/useDataTable";
import { Switch } from "@/components/ui/switch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ProjectManagement() {
  const [toggleProject] = useToggleProjectMutation();

  const { data: projectsData, isLoading, error } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const projects = projectsData?.data || [];

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    filteredData: filteredProjects,
    paginatedData: paginatedProjectsUnsorted,
  } = useDataTable(projects, {
    searchKeys: ["title", "location", "price"],
    filterFunction: (item, status) => {
      if (status === "all") return true;
      return item.status === status;
    },
  });

  // APPLY SORTING TO FILTERED DATA
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "isActive") {
      aVal = a.isActive ? 1 : 0;
      bVal = b.isActive ? 1 : 0;
    }

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // PAGINATE SORTED DATA
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIdx, startIdx + itemsPerPage);

  // ---------------- ACTION HANDLERS ----------------

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(projectToDelete._id).unwrap();
      toast.success("Project deleted successfully!");
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  // ⭐ NEW: Toggle Active / Inactive with validation
  const handleToggleActive = async (project) => {
    // Count currently active projects
    const activeCount = projects.filter(p => p.isActive).length;
    
    // If trying to deactivate the last active project, prevent it
    if (project.isActive && activeCount === 1) {
      toast.error("At least one project must remain active!");
      return;
    }

    try {
      console.log(project);
      const response = await toggleProject(project._id).unwrap();

      console.log(response);
      toast.success(
        `Project ${project.isActive ? "Deactivated" : "Activated"} successfully`
      );

      if (response.success) {
        toast.success("project is activate");
      } else {
        toast.warning("project is deactivate");
      }
    } catch (error) {
      toast.error("Failed to update project status");
    }
  };

  // ---------------- RENDER ----------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load projects. Try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Project Management</h1>

        <Button
          onClick={handleAdd}
          className="bg-[#d4af37] hover:bg-[#b8962f] text-black cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* DATA TABLE */}
      <DataTable
        title=""
        subtitle=""
        data={projects}
        paginatedData={paginatedProjects}
        filteredData={filteredProjects}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalPages={totalPages}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        filterOptions={[
          { value: "all", label: "All" },
          { value: "ongoing", label: "Ongoing" },
          { value: "completed", label: "Completed" },
          { value: "upcoming", label: "Upcoming" },
        ]}
        columns={[
          {
            key: "image",
            label: "Image",
            sortable: false,
            render: (project) =>
              project.imageUrl ? (
                <img
                  src={`${API_URL}${project.imageUrl}`}
                  className="w-16 h-12 object-cover rounded cursor-pointer"
                  onClick={() => {
                    setPreviewImage(`${API_URL}${project.imageUrl}`);
                    setPreviewOpen(true);
                  }}
                />
              ) : (
                <div className="w-16 h-12 bg-zinc-800 rounded flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-zinc-500" />
                </div>
              ),
          },

          {
            key: "title",
            label: "Title",
            render: (project) => (
              <div>
                <p className="text-white font-medium">{project.title}</p>
                <p className="text-zinc-500 text-sm">{project.price}</p>
              </div>
            ),
          },

          { key: "location", label: "Location" },

          {
            key: "status",
            label: "Project Status",
            render: (project) => {
              const statusColors = {
                ongoing: "text-blue-400 bg-blue-500/20",
                completed: "text-green-400 bg-green-500/20",
                upcoming: "text-yellow-400 bg-yellow-500/20",
              };

              return (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[project.status] ||
                    "text-blue-400 bg-blue-500/20"
                  }`}
                >
                  {project.status}
                </span>
              );
            },
          },

          {
            key: "isActive",
            label: "Active Status",
            render: (project) => {
              // ⭐ Check if this is the last active project
              const activeCount = projects.filter(p => p.isActive).length;
              const isLastActive = project.isActive && activeCount === 1;
              
              return (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={project.isActive}
                    onCheckedChange={() => handleToggleActive(project)}
                    disabled={isLastActive}
                    className="cursor-pointer data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isLastActive ? "Cannot deactivate the last active project" : ""}
                  />
                  <span className="text-sm">
                    {project.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              );
            },
          },

          {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (project) => (
              <div className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleEdit(project)}
                  className="text-zinc-400 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(project)}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* PROJECT FORM */}
      <ProjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
        length={projects.length}
      />

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{projectToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IMAGE PREVIEW DIALOG */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-3xl [&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="w-full flex justify-center">
            <img
              src={previewImage}
              className="max-h-[70vh] rounded-lg object-contain"
              alt="Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}