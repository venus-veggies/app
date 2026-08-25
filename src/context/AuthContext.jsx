import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me")
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ phone, password }) => {
    const { data } = await api.post("/login", { phone, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/register", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }, []);

  const requestOtp = useCallback(async (phone) => {
    await api.post("/request-otp", { phone });
    // No OTP returned; admin sees it in /dev/otps
  }, []);

  const verifyOtp = useCallback(async ({ phone, otp }) => {
    const { data } = await api.post("/verify-otp", { phone, otp });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await api.put("/profile", payload);
    setUser(data.user);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      requestOtp,
      verifyOtp,
      updateProfile,
      logout,
    }),
    [
      user,
      loading,
      login,
      register,
      requestOtp,
      verifyOtp,
      updateProfile,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
