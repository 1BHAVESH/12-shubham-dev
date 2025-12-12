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
  } = useForm({
    mode: "onBlur", // Validate on blur
  });

  const [faviconPreview, setFaviconPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // RTK Query Hooks
  const { data, isSuccess, isLoading } = useGetGeneralSettingQueryQuery();
  const [createGeneralSetting] = useCreateGeneralSettingMutation();

  // Helper function to get correct image URL
  const getImageUrl = (preview) => {
    if (!preview) return null;
    if (preview.startsWith("blob:")) return preview;
    return `${API_URL}/${preview}`;
  };

  // Load Existing Values
  useEffect(() => {
    if (isSuccess && data?.data) {
      const s = data.data;

      setValue("applicationName", s.applicationName);
      setValue("email", s.email);
      setValue("phone", s.phone);
      setValue("copyright", s.copyright);
      setValue("whatsappMobile", s.whatsappMobile);

      setFaviconPreview(s.favicon);
      setLogoPreview(s.logo);
      setFooterLogoPreview(s.footerLogo);
    }
  }, [isSuccess, data, setValue]);

  // File validation helper
  const validateImageFile = (fileList) => {
    if (!fileList || fileList.length === 0) return true; // Optional field

    const file = fileList[0];
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      return "Only image files (JPG, PNG, GIF, WebP) are allowed";
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return "File size must be less than 5MB";
    }

    return true;
  };

  // Validate no empty spaces
  const validateNotEmpty = (value) => {
    if (!value || value.trim() === "") {
      return "This field cannot be empty or contain only spaces";
    }
    return true;
  };

  // Submit Handler
  const onSubmit = async (formData) => {
    try {
      const form = new FormData();

      // Trim and append string values
      Object.keys(formData).forEach((key) => {
        if (formData[key] && typeof formData[key] === "string") {
          form.append(key, formData[key].trim());
        }
      });

      if (formData.favicon?.[0]) form.append("favicon", formData.favicon[0]);
      if (formData.logo?.[0]) form.append("logo", formData.logo[0]);
      if (formData.footerLogo?.[0])
        form.append("footerLogo", formData.footerLogo[0]);

      const res = await createGeneralSetting(form);

      if (res?.data?.success) {
        alert("Settings Updated Successfully!");
      } else {
        alert("Error updating settings!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while updating settings");
    }
  };

  if (isLoading) return <h1 className="text-white p-6">Please wait...</h1>;

  return (
    <div className="p-6 bg-zinc-900 text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Application Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Favicon */}
            <div>
              <label className="font-medium block mb-2">Favicon (25×25)</label>
              <input
                type="file"
                accept="image/*"
                {...register("favicon", {
                  validate: validateImageFile,
                })}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFaviconPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full bg-zinc-800 p-2 rounded"
              />
              {errors.favicon && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.favicon.message}
                </p>
              )}

              {faviconPreview && (
                <img
                  src={getImageUrl(faviconPreview)}
                  onClick={() => {
                    setPreviewImage(getImageUrl(faviconPreview));
                    setPreviewOpen(true);
                  }}
                  className="mt-2 w-10 h-10 rounded cursor-pointer bg-zinc-700 object-cover"
                  alt="Favicon preview"
                />
              )}
            </div>

            {/* App Name */}
            <div>
              <label className="font-medium block mb-2">
                Application Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("applicationName", {
                  required: "Application name is required",
                  validate: validateNotEmpty,
                  minLength: {
                    value: 3,
                    message: "Application name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Application name must not exceed 50 characters",
                  },
                })}
                className="w-full bg-zinc-800 p-2 rounded"
                placeholder="Enter application name"
              />
              {errors.applicationName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.applicationName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-medium block mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  validate: validateNotEmpty,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full bg-zinc-800 p-2 rounded"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="font-medium block mb-2">Logo</label>
              <input
                type="file"
                accept="image/*"
                {...register("logo", {
                  validate: validateImageFile,
                })}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setLogoPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full bg-zinc-800 p-2 rounded"
              />
              {errors.logo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.logo.message}
                </p>
              )}

              {logoPreview && (
                <img
                  src={getImageUrl(logoPreview)}
                  onClick={() => {
                    setPreviewImage(getImageUrl(faviconPreview));
                    setPreviewOpen(true);
                  }}
                  className="mt-2 w-20 h-20 rounded cursor-pointer bg-zinc-700 object-cover"
                  alt="Logo preview"
                />
              )}
            </div>

            {/* Copyright */}
            <div>
              <label className="font-medium block mb-2">Copyright</label>
              <input
                {...register("copyright", {
                  validate: (value) => {
                    if (value && value.trim() === "") {
                      return "Copyright cannot contain only spaces";
                    }
                    return true;
                  },
                  maxLength: {
                    value: 100,
                    message: "Copyright must not exceed 100 characters",
                  },
                })}
                className="w-full bg-zinc-800 p-2 rounded"
                placeholder="Enter copyright text"
              />
              {errors.copyright && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.copyright.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="font-medium block mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter phone number"
                className="w-full bg-zinc-800 p-2 rounded"
                {...register("phone", {
                  required: "Phone number is required",
                  validate: (value) => {
                    if (!/^[0-9]{10}$/.test(value)) {
                      return "Phone number must be exactly 10 digits";
                    }
                    return true;
                  },
                })}
                onInput={(e) => {
                  // Only numbers allowed
                  let value = e.target.value.replace(/\D/g, "");

                  // Limit to 10 digits max
                  if (value.length > 10) {
                    value = value.slice(0, 10);
                  }

                  e.target.value = value;
                }}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Footer Logo */}
            <div>
              <label className="font-medium block mb-2">Footer Logo</label>
              <input
                type="file"
                accept="image/*"
                {...register("footerLogo", {
                  validate: validateImageFile,
                })}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFooterLogoPreview(
                      URL.createObjectURL(e.target.files[0])
                    );
                  }
                }}
                className="w-full bg-zinc-800 p-2 rounded"
              />
              {errors.footerLogo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.footerLogo.message}
                </p>
              )}

              {footerLogoPreview && (
                <img
                  src={getImageUrl(footerLogoPreview)}
                  onClick={() => {
                    setPreviewImage(getImageUrl(faviconPreview));
                    setPreviewOpen(true);
                  }}
                  className="mt-2 w-20 cursor-pointer h-20 rounded bg-zinc-700 object-cover"
                  alt="Footer logo preview"
                />
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="font-medium block mb-2">WhatsApp Mobile</label>
              <input
                type="tel"
                {...register("whatsappMobile", {
                  validate: (value) => {
                    if (!value) return true; // Optional field
                    if (value.trim() === "") {
                      return "WhatsApp number cannot contain only spaces";
                    }
                    if (!/^[0-9]{10,15}$/.test(value.trim())) {
                      return "WhatsApp number must be 10-15 digits";
                    }
                    return true;
                  },
                })}
                className="w-full bg-zinc-800 p-2 rounded"
                placeholder="Enter WhatsApp number"
              />
              {errors.whatsappMobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.whatsappMobile.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-medium transition-colors"
        >
          {isSubmitting ? "Updating..." : "Update Settings"}
        </button>
      </form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-zinc-900 text-white border border-zinc-700 max-w-3xl [&>button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="w-full flex justify-center">
            <img
              src={previewImage}
              onClick={() => {
                setPreviewImage(getImageUrl(faviconPreview));
                setPreviewOpen(true);
              }}
              className="max-h-[70vh] cursor-pointer rounded-lg object-contain"
              alt="Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneralSettings;
