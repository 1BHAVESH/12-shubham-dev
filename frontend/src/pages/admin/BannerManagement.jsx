import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
  useDeleteBannerMutation,
  useUpdateBannerMutation,
  useGetAdminSideBannerQuery,
} from "@/redux/features/adminApi";

import BannerForm from "@/components/admin/BannerForm";
import DataTable from "@/components/common/DataTable";
import useDataTable from "@/hooks/useDataTable";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function BannerManagement() {
  const { data: bannersData, isLoading, error } = useGetAdminSideBannerQuery();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const banners = bannersData?.data || [];

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
    filteredData: filteredBanners,
    paginatedData: paginatedBannersUnsorted,
  } = useDataTable(banners, {
    searchKeys: ["title", "description"],
    filterFunction: (item, status) => {
      if (status === "all") return true;
      if (status === "active") return item.isActive !== false;
      if (status === "inactive") return item.isActive === false;
    },
  });

  // APPLY SORTING TO FILTERED DATA
  const sortedBanners = [...filteredBanners].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "isActive") {
      aVal = a.isActive !== false ? 1 : 0;
      bVal = b.isActive !== false ? 1 : 0;
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
  const paginatedBanners = sortedBanners.slice(startIdx, startIdx + itemsPerPage);

  // ----------------- ACTION HANDLERS -----------------

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBanner(bannerToDelete._id).unwrap();
      toast.success("Banner deleted successfully!");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete banner");
    }
  };

  // ⭐ NEW: Status toggle with validation
  const handleStatusToggle = async (banner, newStatus) => {
    // Count currently active banners
    const activeCount = banners.filter(b => b.isActive !== false).length;
    
    // If trying to deactivate the last active banner, prevent it
    if (banner.isActive !== false && !newStatus && activeCount === 1) {
      toast.error("At least one banner must remain active!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", banner.title);
      formData.append("description", banner.description || "");
      formData.append("link", banner.link || "");
      formData.append("order", banner.order || 0);
      formData.append("isActive", newStatus);

      await updateBanner({ id: banner._id, formData }).unwrap();
      toast.success(`Banner ${newStatus ? "activated" : "deactivated"}!`);
    } catch (err) {
      toast.error("Failed to update banner status");
    }
  };

  // ----------------- LOADING / ERROR -----------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load banners. Please try again.
      </div>
    );
  }

  // ----------------- MOBILE CARD VIEW -----------------
  const MobileCardView = () => (
    <div className="space-y-4 lg:hidden">
      {paginatedBanners.map((banner) => {
        const activeCount = banners.filter(b => b.isActive !== false).length;
        const isLastActive = banner.isActive !== false && activeCount === 1;

        return (
          <div
            key={banner._id}
            className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700"
          >
            {/* Image */}
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <img
                src={`${API_URL}${banner.imageUrl}`}
                onClick={() => {
                  setPreviewImage(`${API_URL}${banner.imageUrl}`);
                  setPreviewOpen(true);
                }}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition"
                alt={banner.title}
              />
              <button
                onClick={() => {
                  setPreviewImage(`${API_URL}${banner.imageUrl}`);
                  setPreviewOpen(true);
                }}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-lg truncate">
              {banner.title}
            </h3>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Status</span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={banner.isActive !== false}
                  onCheckedChange={(checked) => handleStatusToggle(banner, checked)}
                  disabled={isLastActive}
                  className="data-[state=checked]:bg-[#d4af37] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isLastActive ? "Cannot deactivate the last active banner" : ""}
                />
                <Badge
                  className={
                    banner.isActive
                      ? "bg-green-500/10 text-green-400"
                      : "bg-zinc-700 text-zinc-300"
                  }
                >
                  {banner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-zinc-700">
              <Button
                onClick={() => handleEdit(banner)}
                className="flex-1 bg-[#d4af37] hover:bg-[#b8962f] text-black cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteClick(banner)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ----------------- UI (Using Reusable DataTable for Desktop) -----------------

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-6 sm:pt-8 lg:pt-12 px-4 sm:px-6 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Banner Management
        </h1>

        <Button
          onClick={handleAdd}
          className="bg-[#d4af37] cursor-pointer hover:bg-[#b8962f] text-black w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Mobile View */}
      {paginatedBanners.length > 0 ? (
        <MobileCardView />
      ) : (
        <div className="lg:hidden text-center text-zinc-400 py-8">
          No banners found
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <DataTable
          title=""
          subtitle=""
          data={banners}
          paginatedData={paginatedBanners}
          filteredData={filteredBanners}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          filterOptions={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          columns={[
            {
              key: "image",
              label: "Image",
              sortable: false,
              render: (banner) => (
                <img
                  src={`${API_URL}${banner.imageUrl}`}
                  onClick={() => {
                    setPreviewImage(`${API_URL}${banner.imageUrl}`);
                    setPreviewOpen(true);
                  }}
                  className="w-16 h-10 object-cover rounded cursor-pointer hover:scale-105 transition"
                  alt={banner.title}
                />
              ),
            },

            { key: "title", label: "Title" },

            {
              key: "isActive",
              label: "Status",
              render: (banner) => {
                const activeCount = banners.filter(b => b.isActive !== false).length;
                const isLastActive = banner.isActive !== false && activeCount === 1;
                
                return (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.isActive !== false}
                      onCheckedChange={(checked) => handleStatusToggle(banner, checked)}
                      disabled={isLastActive}
                      className="data-[state=checked]:bg-[#d4af37] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isLastActive ? "Cannot deactivate the last active banner" : ""}
                    />
                    <Badge
                      className={
                        banner.isActive
                          ? "bg-green-500/10 text-green-400"
                          : "bg-zinc-700 text-zinc-300"
                      }
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                );
              },
            },

            {
              key: "actions",
              label: "Actions",
              sortable: false,
              render: (banner) => (
                <div className="flex gap-2 mr-10">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleEdit(banner)}
                    className="cursor-pointer right-7"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(banner)}
                    className="text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Mobile Pagination */}
      {paginatedBanners.length > 0 && (
        <div className="lg:hidden flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-sm text-zinc-400">
            Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredBanners.length)} of {filteredBanners.length}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex items-center px-3 text-white">
              {currentPage} / {totalPages}
            </div>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Banner Form Modal */}
      <BannerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        banner={selectedBanner}
      />

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete "{bannerToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full text-black sm:w-auto cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto cursor-pointer"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 w-[95vw] sm:w-[90vw] max-w-3xl [&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="w-full flex justify-center">
            <img
              src={previewImage}
              className="max-h-[60vh] sm:max-h-[70vh] rounded-lg object-contain w-full"
              alt="Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}