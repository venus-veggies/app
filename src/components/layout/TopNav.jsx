import { Link, NavLink } from "react-router-dom";
import { NAV_ICONS, NAV_LINKS, ROUTES } from "../../config/navigation";
import { BRAND } from "../../content/brand";
import { useCart } from "../../context/CartContext";
import { COPY } from "../../config/copy";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-leaf-700" : "text-body hover:text-leaf-700"}`;

export default function TopNav() {
  const { totalCount } = useCart();
  const LogoIcon = NAV_ICONS.logo;
  const LocationIcon = NAV_ICONS.location;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-[var(--topnav-height)] flex items-center gap-4">
        {/* Logo */}
        <Link to={ROUTES.home} className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-leaf-500 text-white flex items-center justify-center">
            <LogoIcon size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold text-leaf-900 hidden sm:inline">
            Venus
          </span>
        </Link>

        {/* Delivery pill – mobile only */}
        <div className="md:hidden flex items-center gap-1 text-xs text-body bg-leaf-100 rounded-pill px-3 py-1.5">
          <LocationIcon size={13} className="text-leaf-700" />
          <span>{BRAND.deliveryPromise}</span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 ml-2">
          {NAV_LINKS.map(({ key, label, path }) => (
            <NavLink
              key={key}
              to={path}
              end={key === "shop"}
              className={navLinkClass}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-sm ml-auto items-center gap-2 bg-page rounded-pill px-3.5 py-2 border border-border">
          <NAV_ICONS.search size={16} className="text-muted" />
          <input
            placeholder={COPY.searchPlaceholder}
            className="bg-transparent text-sm outline-none placeholder:text-muted w-full"
          />
        </div>

        {/* Cart + profile icons – DESKTOP ONLY */}
        <div className="hidden md:flex items-center gap-1 ml-auto md:ml-4">
          <Link
            to={ROUTES.cart}
            className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-leaf-100 transition-colors"
          >
            <NAV_ICONS.cart size={20} className="text-ink" />
            {totalCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-gold-500 text-[10px] font-semibold text-ink flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          <Link
            to={ROUTES.profile}
            className="hidden md:flex w-10 h-10 rounded-full items-center justify-center hover:bg-leaf-100 transition-colors"
          >
            <NAV_ICONS.profile size={20} className="text-ink" />
          </Link>
        </div>
      </div>
    </header>
  );
}
