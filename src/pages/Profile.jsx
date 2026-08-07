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

// Map menu item keys to actual Lucide components
const MENU_ICONS = {
  orders: Package,
  addresses: MapPin,
  payment: Wallet,
  notifications: Bell,
  help: HelpCircle,
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="pb-6">
      <div className="flex items-center gap-4 mb-6">
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
          onClick={() => toast(COPY.editProfileNotWired)}
          aria-label={COPY.editProfileAria}
          className="ml-auto w-9 h-9 rounded-full bg-leaf-100 flex items-center justify-center shrink-0"
        >
          <Pencil size={15} className="text-leaf-700" />
        </button>
      </div>

      <div className="bg-surface rounded-card shadow-card divide-y divide-border overflow-hidden mb-6">
        {COPY.menuItems.map(({ label, key }) => {
          const Icon = MENU_ICONS[key];
          return (
            <button
              key={key}
              onClick={() =>
                toast(COPY.menuNotWired.replace("{{label}}", label))
              }
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
