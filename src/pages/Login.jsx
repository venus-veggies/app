import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Lock, Phone, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login({ phone, password });
      } else {
        await register({ name, phone, password });
      }
      navigate(ROUTES.shop);
    } catch (err) {
      const message = err.response?.data?.message || COPY.loginFailed;
      setError(message);
    }
  };

  const tabLabel = mode === "login" ? COPY.loginTab : COPY.signupTab;

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
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 text-sm font-medium py-2 rounded-pill transition-colors capitalize ${
                  mode === m ? "bg-leaf-500 text-white" : "text-body"
                }`}
              >
                {m === "login" ? COPY.loginTab : COPY.signupTab}
              </button>
            ))}
          </div>

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
                  aria-label={COPY.fullNameAria}
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
                aria-label={COPY.phoneAria}
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
                aria-label={COPY.passwordAria}
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
              className="mt-2 bg-leaf-500 hover:bg-leaf-600 text-white font-medium rounded-pill py-3 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500"
            >
              {tabLabel}
            </button>
          </form>

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
