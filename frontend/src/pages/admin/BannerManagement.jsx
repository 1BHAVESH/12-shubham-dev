import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

const BASE_URL = "http://localhost:3001";

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

  const banners = bannersData?.data || [];

  // ⭐ Use the reusable search + filter + pagination hook
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
    paginatedData: paginatedBanners,
  } = useDataTable(banners, {
    searchKeys: ["title", "description"],
    filterFunction: (item, status) => {
      if (status === "all") return true;
      if (status === "active") return item.isActive !== false;
      if (status === "inactive") return item.isActive === false;
    },
  });

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

  const handleStatusToggle = async (banner, newStatus) => {
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

  console.log(banners)

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load banners. Please try again.
      </div>
    );
  }

  // ----------------- UI (Using Reusable DataTable) -----------------

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Banner Management</h1>

        <Button
          onClick={handleAdd}
          className="bg-[#d4af37] hover:bg-[#b8962f] text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <DataTable
        title="Banners"
        subtitle="Manage your website banners"
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
        filterOptions={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        columns={[
          {
            key: "image",
            label: "Image",
            render: (banner) => (
              <img
                src={`${BASE_URL}${banner.imageUrl}`}
                onClick={() => {
                  setPreviewImage(`${BASE_URL}${banner.imageUrl}`);
                  setPreviewOpen(true);
                }}
                className="w-16 h-10 object-cover rounded cursor-pointer hover:scale-105 transition"
              />
            ),
          },

          { key: "title", label: "Title" },

          {
            key: "status",
            label: "Status",
            render: (banner) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={banner.isActive !== false}
                  onCheckedChange={(checked) =>
                    handleStatusToggle(banner, checked)
                  }
                  className="data-[state=checked]:bg-[#d4af37]"
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
            ),
          },

          {
            key: "actions",
            label: "Actions",
            render: (banner) => (
              <div className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleEdit(banner)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(banner)}
                  className="text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* Banner Form Modal */}
      <BannerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        banner={selectedBanner}
      />

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bannerToDelete?.title}"?
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
