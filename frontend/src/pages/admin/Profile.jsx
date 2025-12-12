import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import {
  useChangeAdminPasswordMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/features/adminApi";

// ---------------- VALIDATION SCHEMAS ---------------- //
const profileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone number is required"),
});

const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "Password must be minimum 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function Profile() {
  const { data, isLoading } = useGetAdminProfileQuery();
  const [changeAdminPassword] = useChangeAdminPasswordMutation();
  const [updateAdminProfile, { isLoading: updateLoading }] =
    useUpdateAdminProfileMutation();

  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ---------------- PROFILE FORM ---------------- //
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  // Load API data into form
  useEffect(() => {
    if (data?.data) {
      resetProfile({
        name: data.data.name || "",
        email: data.data.email || "",
        phone: data.data.phone || "",
      });
    }
  }, [data, resetProfile]);

  // ---------------- PASSWORD FORM ---------------- //
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // ---------------- UPDATE PROFILE SUBMIT ---------------- //
  const submitProfile = async (formData) => {
    try {
      await updateAdminProfile(formData).unwrap();
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- CHANGE PASSWORD SUBMIT ---------------- //
  const submitPassword = async (formData) => {
    try {
      await changeAdminPassword({
        phone: data?.data?.phone,
        newPassword: formData.newPassword,
      }).unwrap();

      setPasswordSuccess("Password changed successfully!");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <h1 className="text-white">Loading profile...</h1>;

  return (
    <div className="p-6 text-white space-y-10">

      {/* ---------------- PROFILE SETTINGS ---------------- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

        {profileSuccess && (
          <p className="text-green-400 text-sm mb-4">{profileSuccess}</p>
        )}

        <form
          onSubmit={handleProfileSubmit(submitProfile)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Full Name</label>
            <input
              {...registerProfile("name")}
              className="mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 
              focus:border-[#d4af37] outline-none"
            />
            {profileErrors.name && (
              <span className="text-red-400 text-xs mt-1">{profileErrors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Email</label>
            <input
              {...registerProfile("email")}
              className="mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 
              focus:border-[#d4af37] outline-none"
            />
            {profileErrors.email && (
              <span className="text-red-400 text-xs mt-1">{profileErrors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Phone</label>
            <input
              {...registerProfile("phone")}
              className="mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 
              focus:border-[#d4af37] outline-none"
            />
            {profileErrors.phone && (
              <span className="text-red-400 text-xs mt-1">{profileErrors.phone.message}</span>
            )}
          </div>

          {/* Save Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={updateLoading}
              className="px-6 py-2 bg-[#d4af37] text-black font-semibold rounded 
              hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* ---------------- CHANGE PASSWORD ---------------- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        {passwordSuccess && (
          <p className="text-green-400 text-sm mb-4">{passwordSuccess}</p>
        )}

        <form
          onSubmit={handlePasswordSubmit(submitPassword)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Hidden phone */}
          <input
            type="hidden"
            value={data?.data?.phone}
            {...registerPassword("phone")}
          />

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">New Password</label>
            <input
              {...registerPassword("newPassword")}
              type="password"
              className="mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 
              focus:border-[#d4af37] outline-none"
            />
            {passwordErrors.newPassword && (
              <span className="text-red-400 text-xs mt-1">
                {passwordErrors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              {...registerPassword("confirmPassword")}
              type="password"
              className="mt-1 p-2 rounded bg-zinc-800 border border-zinc-700 
              focus:border-[#d4af37] outline-none"
            />
            {passwordErrors.confirmPassword && (
              <span className="text-red-400 text-xs mt-1">
                {passwordErrors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Update Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-6 py-2 bg-[#d4af37] text-black font-semibold rounded 
              hover:bg-yellow-500 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
