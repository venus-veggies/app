import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Wallet,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

const MENU_ICONS = {
  orders: Package,
  addresses: MapPin,
  payment: Wallet,
  notifications: Bell,
  help: HelpCircle,
};

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Separate editing states for header and address card
  const [profileEditing, setProfileEditing] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || "",
    address_line1: user?.address_line1 || "",
    address_line2: user?.address_line2 || "",
    landmark: user?.landmark || "",
    pincode: user?.pincode || "",
  });
  const [saving, setSaving] = useState(false);

  const initials = (user?.name || "G")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  const handleSaveAddress = async () => {
    if (!address.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!address.address_line1.trim() || !address.pincode.trim()) {
      toast.error("Address and pincode are required.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(address);
      toast.success("Address updated.");
      setAddressEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-6">
      {/* Profile header – clicking toggles profile editing */}
      <div
        onClick={() => setProfileEditing((e) => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setProfileEditing((e) => !e);
          }
        }}
        className="flex items-center gap-4 mb-6 cursor-pointer select-none"
      >
        <div className="relative w-16 h-16 rounded-full bg-leaf-500 text-white flex items-center justify-center font-display text-xl font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h1 className="type-hero truncate">{user?.name || "Guest"}</h1>
          <p className="type-caption truncate">
            {user?.phone || COPY.notSignedIn}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setProfileEditing((e) => !e);
          }}
          aria-label={COPY.editProfileAria}
          className="ml-auto w-9 h-9 rounded-full bg-leaf-100 flex items-center justify-center shrink-0 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
        >
          <Pencil size={15} className="text-leaf-700" />
        </button>
      </div>

      {/* Address card */}
      <div className="bg-surface rounded-card shadow-card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="type-section">{COPY.addressTitle}</h2>
          {!addressEditing && (
            <button
              onClick={() => setAddressEditing(true)}
              className="text-sm text-leaf-700 flex items-center gap-1"
            >
              <Pencil size={13} />
              {COPY.editAddress}
            </button>
          )}
        </div>

        {addressEditing ? (
          <div className="space-y-3">
            <input
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              placeholder="Full name"
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <input
              value={address.address_line1}
              onChange={(e) =>
                setAddress({ ...address, address_line1: e.target.value })
              }
              placeholder={COPY.addressLine1Placeholder}
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <input
              value={address.address_line2}
              onChange={(e) =>
                setAddress({ ...address, address_line2: e.target.value })
              }
              placeholder={COPY.addressLine2Placeholder}
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <input
              value={address.landmark}
              onChange={(e) =>
                setAddress({ ...address, landmark: e.target.value })
              }
              placeholder={COPY.landmarkPlaceholder}
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <input
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              placeholder={COPY.pincodePlaceholder}
              type="tel"
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAddressEditing(false)}
                className="flex-1 py-2.5 rounded-btn border border-border text-body text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAddress}
                disabled={saving}
                className="flex-1 py-2.5 rounded-btn bg-leaf-500 text-white text-sm font-medium"
              >
                {saving ? "Saving…" : COPY.saveAddress}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-body">
            <p className="font-medium text-ink">{user?.name || "—"}</p>
            <p>{user?.address_line1 || "No address saved"}</p>
            {user?.address_line2 && <p>{user.address_line2}</p>}
            {user?.landmark && <p>{user.landmark}</p>}
            <p className="font-medium">{user?.pincode || ""}</p>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-card shadow-card divide-y divide-border overflow-hidden mb-6">
        {COPY.menuItems.map(({ label, key }) => {
          const Icon = MENU_ICONS[key];
          return (
            <button
              key={key}
              onClick={() => {
                if (key === "orders") {
                  navigate(ROUTES.orders);
                } else if (key === "addresses") {
                  setAddressEditing(true);
                } else {
                  toast(COPY.menuNotWired.replace("{{label}}", label));
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-page transition-colors"
            >
              {Icon && <Icon size={18} className="text-leaf-700 shrink-0" />}
              <span className="type-name">{label}</span>
              <ChevronRight size={16} className="ml-auto text-muted shrink-0" />
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-tomato-600 font-medium py-3"
      >
        <LogOut size={17} />
        {COPY.logoutLabel}
      </button>
    </div>
  );
}
