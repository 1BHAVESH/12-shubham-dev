import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateGeneralSettingMutation,
  useGetGeneralSettingQueryQuery,
} from "@/redux/features/adminApi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const GeneralSettings = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const [logoPreview, setLogoPreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { data, isSuccess, isLoading } =
    useGetGeneralSettingQueryQuery();
  const [createGeneralSetting] =
    useCreateGeneralSettingMutation();

  const getImageUrl = (preview) => {
    if (!preview) return null;
    if (preview.startsWith("blob:")) return preview;
    return `${API_URL}/${preview}`;
  };

  useEffect(() => {
    if (isSuccess && data?.data) {
      const s = data.data;

      setValue("email", s.email);
      setValue("phone", s.phone);
      setValue("copyright", s.copyright);

      setValue("whatsappUrl", s.whatsappUrl);
      setValue("instagramUrl", s.instagramUrl);
      setValue("facebookUrl", s.facebookUrl);

      setLogoPreview(s.logo);
    }
  }, [isSuccess, data, setValue]);

  const validateImageFile = (fileList) => {
    if (!fileList || fileList.length === 0) return true;

    const file = fileList[0];
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      return "Only JPG, PNG, WebP allowed";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "Max size 5MB";
    }

    return true;
  };

  const onSubmit = async (formData) => {
    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] && typeof formData[key] === "string") {
          form.append(key, formData[key].trim());
        }
      });

      if (formData.logo?.[0]) {
        form.append("logo", formData.logo[0]);
      }

      const res = await createGeneralSetting(form);

      if (res?.data?.success) {
        alert("Settings updated successfully");
      } else {
        alert("Failed to update settings");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (isLoading) return <h1 className="p-6 text-white">Loading...</h1>;

  return (
    <div className="p-6 bg-zinc-900 text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">
        General Settings
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="font-medium block mb-2">Logo</label>
              <input
                type="file"
                accept="image/*"
                {...register("logo", { validate: validateImageFile })}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setLogoPreview(
                      URL.createObjectURL(e.target.files[0])
                    );
                  }
                }}
                className="w-full bg-zinc-800 p-2 rounded"
              />

              {logoPreview && (
                <img
                  src={getImageUrl(logoPreview)}
                  onClick={() => {
                    setPreviewImage(getImageUrl(logoPreview));
                    setPreviewOpen(true);
                  }}
                  className="mt-2 w-20 h-20 rounded cursor-pointer object-cover bg-zinc-700"
                  alt="Logo preview"
                />
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-medium block mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email required",
                })}
                className="w-full bg-zinc-800 p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="font-medium block mb-2">
                Phone *
              </label>
              <input
                type="text"
                {...register("phone", {
                  required: "Phone required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone must be 10 digits",
                  },
                })}
                className="w-full bg-zinc-800 p-2 rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            

            {/* Instagram URL */}
            <div>
              <label className="font-medium block mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                {...register("instagramUrl")}
                placeholder="https://instagram.com/yourpage"
                className="w-full bg-zinc-800 p-2 rounded"
              />
            </div>

            {/* Facebook URL */}
            <div>
              <label className="font-medium block mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                {...register("facebookUrl")}
                placeholder="https://facebook.com/yourpage"
                className="w-full bg-zinc-800 p-2 rounded"
              />
            </div>

            {/* Copyright */}
            <div>
              <label className="font-medium block mb-2">
                Copyright
              </label>
              <input
                {...register("copyright")}
                className="w-full bg-zinc-800 p-2 rounded"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          {isSubmitting ? "Updating..." : "Update Settings"}
        </button>
      </form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <img
            src={previewImage}
            className="max-h-[70vh] mx-auto rounded"
            alt="Preview"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneralSettings;
