import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { OtpField } from "./OtpField";

export function ResetPasswordForm({ onBackToLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!otp.trim()) {
      setError("Please enter the OTP sent to your phone.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    try {
      await resetPassword({
        phone: phone.trim(),
        otp: otp.trim(),
        new_password: password,
      });
      toast.success("Password reset successful. Please login.");
      onBackToLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <OtpField
        phone={phone}
        onPhoneChange={setPhone}
        otp={otp}
        onOtpChange={setOtp}
        successMessage="OTP sent. Check admin OTP logs."
      />

      <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
        <Lock size={16} className="text-muted shrink-0" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          type={showPassword ? "text" : "password"}
          className="w-full text-sm outline-none placeholder:text-muted"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="text-muted shrink-0"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </label>

      {error && <p className="text-tomato-600 text-sm text-center">{error}</p>}

      <button
        type="submit"
        className="mt-2 bg-leaf-500 hover:bg-leaf-600 text-white font-medium rounded-pill py-3 transition-all active:scale-95"
      >
        Reset Password
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="text-center text-sm text-leaf-700 underline underline-offset-2 mt-1"
      >
        Back to Login
      </button>
    </form>
  );
}
