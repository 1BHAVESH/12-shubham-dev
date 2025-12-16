import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/redux/features/adminApi";
import { toast } from "sonner";

export default function BannerForm({ open, onOpenChange, banner }) {
  console.log(banner);
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const isEditing = !!banner;
  const isLoading = isCreating || isUpdating;

  const BASE_URL = "http://localhost:3001";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title || "",
        description: banner.description || "",
        link: banner.link || "",
        order: banner.order || 0,
      });
      console.log(banner.imgUrl);
      setImagePreview(banner?.imageUrl ? `${BASE_URL}${banner.imageUrl}` : null);
      setIsActive(banner.isActive !== undefined ? banner.isActive : true);
      console.log(imagePreview);
    } else {
      reset({
        title: "",
        description: "",
        link: "",
        order: 0,
      });
      setImagePreview(null);
      setIsActive(true);
    }
    setSelectedFile(null);
  }, [banner, reset]);

  console.log(imagePreview);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);
      formData.append("order", data.order);
      formData.append("isActive", isActive);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditing) {
        await updateBanner({ id: banner._id, formData }).unwrap();
        toast.success("Banner updated successfully!");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully!");
      }

      onOpenChange(false);
      reset();
      setSelectedFile(null);
      setImagePreview(null);
      setIsActive(true);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:cursor-pointer bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Banner" : "Add New Banner"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter banner title"
              className="bg-zinc-800 border-zinc-700"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter banner description"
              className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              {...register("description")}
            />
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="link">Link (optional)</Label>
            <Input
              id="link"
              placeholder="https://example.com"
              className="bg-zinc-800 border-zinc-700"
              {...register("link")}
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              placeholder="0"
              className="bg-zinc-800 border-zinc-700"
              {...register("order", { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="space-y-0.5">
              <Label htmlFor="active-toggle" className="text-base cursor-pointer">
                Banner Status
              </Label>
              <p className="text-sm text-zinc-400">
                {isActive ? "Banner is active and visible" : "Banner is inactive and hidden"}
              </p>
            </div>
            <Switch
              id="active-toggle"
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-[#d4af37]"
            />
          </div>

          <div className="space-y-2">
            <Label>Banner Image</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute cursor-pointer top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <span className="text-zinc-400 text-sm">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#d4af37] hover:bg-[#b8962f] text-black"
            >
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}