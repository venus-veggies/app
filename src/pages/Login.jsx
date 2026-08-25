import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

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
          {mode !== "reset" && (
            <div className="flex bg-page rounded-pill p-1 mb-5">
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 text-sm font-medium py-2 rounded-pill transition-colors capitalize ${
                    mode === m ? "bg-leaf-500 text-white" : "text-body"
                  }`}
                >
                  {m === "login" ? "Login" : "Signup"}
                </button>
              ))}
            </div>
          )}

          {mode === "login" && (
            <LoginForm onForgotPassword={() => setMode("reset")} />
          )}
          {mode === "signup" && (
            <SignupForm onSuccess={() => navigate(ROUTES.shop)} />
          )}
          {mode === "reset" && (
            <ResetPasswordForm onBackToLogin={() => setMode("login")} />
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
