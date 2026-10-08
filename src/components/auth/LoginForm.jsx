import { useState } from "react";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { COPY } from "../../config/copy";

export function LoginForm({ onForgotPassword, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ phone, password });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || COPY.loginFailed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
        <Phone size={16} className="text-muted shrink-0" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={COPY.phonePlaceholder}
          type="tel"
          className="w-full text-sm outline-none placeholder:text-muted"
          required
        />
      </label>

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
        {COPY.loginTab}
      </button>

      <button
        type="button"
        onClick={onForgotPassword}
        className="text-center text-sm text-leaf-700 underline underline-offset-2 mt-1"
      >
        Forgot password?
      </button>
    </form>
  );
}
