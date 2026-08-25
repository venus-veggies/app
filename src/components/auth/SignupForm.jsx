import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { OtpField } from "./OtpField";
import { COPY } from "../../config/copy";

export function SignupForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !password.trim() || !otp.trim()) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await register({ name, phone, password, otp });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
        <User size={16} className="text-muted shrink-0" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={COPY.fullNamePlaceholder}
          className="w-full text-sm outline-none placeholder:text-muted"
          required
        />
      </label>

      <OtpField
        phone={phone}
        onPhoneChange={setPhone}
        otp={otp}
        onOtpChange={setOtp}
      />

      <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
        <Lock size={16} className="text-muted shrink-0" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={COPY.passwordPlaceholder}
          type={showPassword ? "text" : "password"}
          className="w-full text-sm outline-none placeholder:text-muted"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="text-muted shrink-0"
          aria-label={
            showPassword ? COPY.hidePasswordAria : COPY.showPasswordAria
          }
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </label>

      {error && <p className="text-tomato-600 text-sm text-center">{error}</p>}

      <button
        type="submit"
        className="mt-2 bg-leaf-500 hover:bg-leaf-600 text-white font-medium rounded-pill py-3 transition-all active:scale-95"
      >
        Create Account
      </button>
    </form>
  );
}
