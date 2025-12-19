import React, { useEffect, useState } from "react";
import {
  useCreateMediaPostMutationMutation,
  useUpdateMediaPostMutation,
  useGetAllPostsQuery,
  useDeleteMediaPostMutation,
  useToggleMediaPostStatusMutation,
} from "@/redux/features/adminApi";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Pencil, AlertCircle, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/* =======================
   YUP VALIDATION SCHEMAS
======================= */
const createSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),

  year: yup
    .number()
    .typeError("Year must be a number")
    .integer("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 10, "Invalid year")
    .required("Year is required"),

  month: yup
    .string()
    .required("Month is required")
    .oneOf(
      ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"],
      "Please select a valid month"
    ),

  publishDate: yup.string().required("Publish date is required"),

  image: yup
    .mixed()
    .required("Image is required")
    .test(
      "fileExists",
      "Please select an image",
      (value) => value && value.length > 0
    )
    .test(
      "fileType",
      "Only JPG, PNG, and WebP formats allowed",
      (value) =>
        value &&
        value[0] &&
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value[0].type
        )
    )
    .test(
      "fileSize",
      "Image must be less than 5MB",
      (value) => value && value[0] && value[0].size <= 5 * 1024 * 1024
    ),
});

const editSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Title is required"),

  year: yup
    .number()
    .typeError("Year must be a number")
    .integer("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 10, "Invalid year")
    .required("Year is required"),

  month: yup
    .string()
    .required("Month is required")
    .oneOf(
      ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"],
      "Please select a valid month"
    ),

  publishDate: yup.string().required("Publish date is required"),

  image: yup
    .mixed()
    .nullable()
    .test(
      "fileType",
      "Only JPG, PNG, and WebP formats allowed",
      (value) => {
        if (!value || value.length === 0) return true;
        return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value[0].type
        );
      }
    )
    .test(
      "fileSize",
      "Image must be less than 5MB",
      (value) => {
        if (!value || value.length === 0) return true;
        return value[0].size <= 5 * 1024 * 1024;
      }
    ),
});

const AdminMediaPost = () => {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { data, isLoading } = useGetAllPostsQuery();
  const [updateStatus] = useUpdateMediaPostMutation();
  const [deleteMediaPost, { isLoading: deleting }] = useDeleteMediaPostMutation();
  const [toggleMediaPostStatus, { data: toggleData }] = useToggleMediaPostStatusMutation();

  if (isLoading) return <h1 className="text-white">Please wait...</h1>;

  const posts = data?.data || [];

  console.log(posts)

  /* =======================
     COUNT ACTIVE POSTS
  ======================= */
  const getActiveCount = () => {
    return posts.filter((p) => p.isActive).length;
  };

  /* =======================
     TOGGLE STATUS
  ======================= */
  const handleStatusChange = async (post) => {
    const activeCount = getActiveCount();

    if (post.isActive && activeCount <= 1) {
      alert("Cannot deactivate! At least one post must remain active.");
      return;
    }

    try {
      await toggleMediaPostStatus(post._id).unwrap();
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Status update failed", error);
      alert(error?.data?.message || "Failed to update status");
    }
  };

  /* =======================
     DELETE POST
  ======================= */
  const handleDelete = async (post) => {
    const activeCount = getActiveCount();

    // Prevent deleting if it's the last active post
    if (post.isActive && activeCount <= 1) {
      alert("Cannot delete! At least one active post must exist.");
      return;
    }

    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${post.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteMediaPost(post._id).unwrap();
      
      // Optional: Show success message
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Media Posts</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Active Posts: {getActiveCount()} / {posts.length}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedPost(null);
            setOpen(true);
          }}
          className="bg-[#d4af37] cursor-pointer hover:bg-[#c29d2f] text-black font-medium"
        >
          + Create Post
        </Button>
      </div>

      {/* WARNING */}
      {getActiveCount() <= 1 && (
        <div className="mb-4 bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>At least one post must remain active and visible</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm text-left text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Publish Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr
                key={post._id}
                className={`border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors ${
                  !post.isActive ? "opacity-60" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <img
                    src={`${API_URL}/uploads/${post.image}`}
                    alt={post.title}
                    className="w-14 h-14 rounded object-cover"
                  />
                </td>

                <td className="px-4 py-3 font-medium text-white">
                  {post.title}
                  {!post.isActive && (
                    <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">{post.month}</td>
                <td className="px-4 py-3">{post.year}</td>
                <td className="px-4 py-3">
                  {new Date(post.publishDate).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={post.isActive}
                      onCheckedChange={() => handleStatusChange(post)}
                      disabled={post.isActive && getActiveCount() <= 1}
                      className="data-[state=checked]:bg-green-600"
                    />
                    {post.isActive ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* EDIT BUTTON */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPost(post);
                        setOpen(true);
                      }}
                      className="text-[#d4af37] hover:text-[#c29d2f] hover:bg-[#d4af37]/10"
                      title="Edit post"
                    >
                      <Pencil size={18} />
                    </Button>

                    {/* DELETE BUTTON */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(post)}
                      disabled={deleting || (post.isActive && getActiveCount() <= 1)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        post.isActive && getActiveCount() <= 1
                          ? "Cannot delete the last active post"
                          : "Delete post"
                      }
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {posts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-zinc-400">
                  No media posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MediaPostModal open={open} setOpen={setOpen} post={selectedPost} />
    </div>
  );
};

export default AdminMediaPost;

/* =======================
   MEDIA POST MODAL
======================= */
const MediaPostModal = ({ open, setOpen, post }) => {
  const [createMediaPostMutation, { isLoading: creating }] =
    useCreateMediaPostMutationMutation();
  const [updateMediaPostMutation, { isLoading: updating }] =
    useUpdateMediaPostMutation();

  const isEdit = Boolean(post);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      title: "",
      year: "",
      month: "",
      publishDate: "",
      image: null,
    },
  });

  const [preview, setPreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const watchedImage = watch("image");

  /* =======================
     IMAGE PREVIEW
  ======================= */
  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    if (post?.image) {
      setPreview(`${API_URL}/uploads/${post.image}`);
    } else {
      setPreview(null);
    }
  }, [watchedImage, post]);

  /* =======================
     PREFILL FORM FOR EDIT
  ======================= */
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        year: post.year || "",
        month: post.month || "",
        publishDate: post.publishDate?.slice(0, 10) || "",
        image: null,
      });
    } else {
      reset({
        title: "",
        year: "",
        month: "",
        publishDate: "",
        image: null,
      });
    }
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [post, reset]);

  /* =======================
     SUBMIT HANDLER
  ======================= */
  const onSubmit = async (formValues) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      const formData = new FormData();
      formData.append("title", formValues.title.trim());
      formData.append("year", formValues.year);
      formData.append("month", formValues.month);
      formData.append("publishDate", formValues.publishDate);

      if (isEdit) {
        // EDIT MODE: Image is optional
        if (formValues.image && formValues.image.length > 0) {
          formData.append("image", formValues.image[0]);
        }

        await updateMediaPostMutation({
          id: post._id,
          data: formData,
        }).unwrap();

        setSubmitSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        // CREATE MODE: Image is required
        if (!formValues.image || formValues.image.length === 0) {
          setSubmitError("Image is required");
          return;
        }

        formData.append("isActive", true);
        formData.append("image", formValues.image[0]);

        await createMediaPostMutation(formData).unwrap();

        setSubmitSuccess(true);
        reset();
        setTimeout(() => {
          setOpen(false);
          setSubmitSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(
        error?.data?.message || error?.message || "Operation failed"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Media Post" : "Create Media Post"}
          </DialogTitle>
        </DialogHeader>

        {/* SUCCESS MESSAGE */}
        {submitSuccess && (
          <div className="bg-green-900/30 border border-green-700 rounded p-3 text-green-200">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>
                {isEdit ? "Post updated successfully!" : "Post created successfully!"}
              </span>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {submitError && (
          <div className="bg-red-900/30 border border-red-700 rounded p-3 text-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          </div>
        )}

        <div onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              {...register("title")}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 2024"
              {...register("year")}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              disabled={isSubmitting}
            />
            {errors.year && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.year.message}
              </p>
            )}
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Month <span className="text-red-500">*</span>
            </label>
            <select
              {...register("month")}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              disabled={isSubmitting}
            >
              <option value="">Select a month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.month && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.month.message}
              </p>
            )}
          </div>

          {/* Publish Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("publishDate")}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              disabled={isSubmitting}
            />
            {errors.publishDate && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.publishDate.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Featured Image {isEdit ? <span className="text-zinc-400">(Optional - leave empty to keep current)</span> : <span className="text-red-500">*</span>}
            </label>

            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border border-zinc-700"
                />
                {isEdit && !watchedImage?.length && (
                  <div className="absolute top-2 right-2 bg-zinc-800/90 px-2 py-1 rounded text-xs">
                    Current Image
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              {...register("image")}
              className="w-full text-sm text-zinc-300
               file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0
               file:bg-[#d4af37] file:text-black
               hover:file:bg-[#c29d2f] file:cursor-pointer"
              disabled={isSubmitting}
            />
            <p className="text-zinc-400 text-xs">
              Max size: 5MB. Formats: JPG, PNG, WebP
            </p>

            {errors.image && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.image.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || creating || updating}
            className="w-full bg-[#d4af37] hover:bg-[#c29d2f] text-black font-medium py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting || creating || updating
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};