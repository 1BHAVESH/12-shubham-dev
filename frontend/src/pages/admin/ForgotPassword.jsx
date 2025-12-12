import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useChangeAdminPasswordMutation } from "@/redux/features/adminApi";

// ---------------- VALIDATION SCHEMA ---------------- //
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  newPassword: yup
    .string()
    .min(6, "Password must be minimum 6 characters")
    .required("New password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangeAdminPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await changePassword({
        phone: data.phone,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password reset successfully!");
      reset();

      setTimeout(() => {
        navigate("/admin/login");
      }, 1000);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Reset Password
          </h1>
          <p className="text-zinc-400 text-center mb-6">
            Verify using your registered phone
          </p>

          {/* -------------- FORM ---------------- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-white">Registered Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  type="tel"
                  placeholder="9999999999"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  {...register("phone")}
                  onInput={(e) => {
                    // Remove all non-digits
                    let value = e.target.value.replace(/[^0-9]/g, "");

                    // Force max 10 digits
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }

                    e.target.value = value;
                  }}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-white">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  type="password"
                  placeholder="********"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  {...register("newPassword")}
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-white">Confirm Password</Label>
              <Input
                type="password"
                placeholder="********"
                className="bg-zinc-800 border-zinc-700 text-white"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d4af37] hover:bg-[#c49b2e] text-black font-semibold h-11"
            >
              {isLoading ? "Processing..." : "Reset Password"}
            </Button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-zinc-400 mt-6">
            Back to{" "}
            <Link className="text-[#d4af37] hover:underline" to="/admin/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
