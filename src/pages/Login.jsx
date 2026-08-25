import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Lock, Phone, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function Login() {
  const [mode, setMode] = useState("login"); // 'login', 'signup', 'reset'
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const { login, register, requestOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError(null);
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }
    setSendingOtp(true);
    try {
      await requestOtp(phone.trim());
      setOtpSent(true);
      toast.success("OTP sent. Check admin OTP logs.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim() || !otp.trim() || !password.trim()) {
      toast.error("Phone, OTP, and new password are required.");
      return;
    }
    try {
      await resetPassword({
        phone: phone.trim(),
        otp: otp.trim(),
        new_password: password,
      });
      toast.success("Password reset successful. Please login.");
      setMode("login");
      setOtpSent(false);
      setOtp("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      try {
        await login({ phone, password });
        navigate(ROUTES.shop);
      } catch (err) {
        setError(err.response?.data?.message || COPY.loginFailed);
      }
      return;
    }

    // signup mode
    if (!name.trim() || !phone.trim() || !password.trim() || !otp.trim()) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await register({ name, phone, password, otp });
      navigate(ROUTES.shop);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <div className="bg-leaf-700 rounded-b-[2.5rem] px-6 pt-14 pb-20 text-center text-white">
        <span className="w-12 h-12 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-3">
          <Leaf size={24} />
        </span>
        <h1 className="font-display text-2xl font-semibold">{COPY.appName}</h1>
        <p className="text-sm text-leaf-100/90 mt-1">{COPY.appTagline}</p>
      </div>

      <div className="flex-1 px-5">
        <div className="max-w-sm mx-auto -mt-10 bg-surface rounded-card shadow-card p-6">
          <div className="flex bg-page rounded-pill p-1 mb-5">
            {["login", "signup", "reset"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setOtpSent(false);
                  setOtp("");
                }}
                className={`flex-1 text-sm font-medium py-2 rounded-pill transition-colors capitalize ${
                  mode === m ? "bg-leaf-500 text-white" : "text-body"
                }`}
              >
                {m === "login" ? "Login" : m === "signup" ? "Signup" : "Reset"}
              </button>
            ))}
          </div>

          {mode === "reset" ? (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-3"
            >
              <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
                <Phone size={16} className="text-muted shrink-0" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  type="tel"
                  className="w-full text-sm outline-none placeholder:text-muted"
                  required
                />
              </label>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="px-4 py-2 rounded-btn border border-leaf-200 text-leaf-700 text-sm font-medium hover:bg-leaf-100 transition"
              >
                {sendingOtp ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
              </button>

              <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
                <Lock size={16} className="text-muted shrink-0" />
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  inputMode="numeric"
                  className="w-full text-sm outline-none placeholder:text-muted"
                  required
                />
              </label>

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

              {error && (
                <p className="text-tomato-600 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="mt-2 bg-leaf-500 hover:bg-leaf-600 text-white font-medium rounded-pill py-3 transition-all active:scale-95"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === "signup" && (
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
              )}

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

              {mode === "signup" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="shrink-0 px-4 py-2 rounded-btn border border-leaf-200 text-leaf-700 text-sm font-medium hover:bg-leaf-100 transition"
                  >
                    {sendingOtp ? "Sending…" : otpSent ? "Resend" : "Send OTP"}
                  </button>
                  {otpSent && (
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="OTP"
                      inputMode="numeric"
                      className="w-full text-sm outline-none border border-border rounded-btn px-3 py-2"
                      required
                    />
                  )}
                </div>
              )}

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

              {error && (
                <p className="text-tomato-600 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="mt-2 bg-leaf-500 hover:bg-leaf-600 text-white font-medium rounded-pill py-3 transition-all active:scale-95"
              >
                {mode === "login" ? "Log in" : "Create Account"}
              </button>
            </form>
          )}

          <button
            onClick={() => navigate(ROUTES.shop)}
            className="w-full text-center text-sm text-muted mt-4 underline underline-offset-2"
          >
            {COPY.continueGuest}
          </button>
        </div>
      </div>
    </div>
  );
}
