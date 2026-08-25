import { useState } from "react";
import { Phone, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";

export function OtpField({
  phone,
  onPhoneChange,
  otp,
  onOtpChange,
  buttonLabel = "Send OTP",
  successMessage = "OTP sent. Check admin OTP logs.",
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }
    setSending(true);
    try {
      await api.post("/request-otp", { phone: phone.trim() });
      setOtpSent(true);
      toast.success(successMessage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <label className="flex flex-1 items-center gap-2 border border-border rounded-btn px-3 py-2.5">
          <Phone size={16} className="text-muted shrink-0" />
          <input
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Phone number"
            type="tel"
            className="w-full text-sm outline-none placeholder:text-muted"
            required
          />
        </label>
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={sending}
          className="shrink-0 px-4 py-2 rounded-btn border border-leaf-200 text-leaf-700 text-sm font-medium hover:bg-leaf-100 transition disabled:opacity-50"
        >
          {sending ? "Sending…" : otpSent ? "Resend" : buttonLabel}
        </button>
      </div>

      {otpSent && (
        <label className="flex items-center gap-2 border border-border rounded-btn px-3 py-2.5">
          <Lock size={16} className="text-muted shrink-0" />
          <input
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            placeholder="OTP"
            inputMode="numeric"
            className="w-full text-sm outline-none placeholder:text-muted"
            required
          />
        </label>
      )}
    </div>
  );
}
