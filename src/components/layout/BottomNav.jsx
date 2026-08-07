import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { NAV_ICONS, NAV_LINKS } from "../../config/navigation";

export default function BottomNav() {
  const { totalCount } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border safe-bottom">
      <div className="flex items-stretch justify-around px-2 py-1.5">
        {NAV_LINKS.map(({ key, label, icon, path, end, badge }) => {
          const Icon = NAV_ICONS[icon];
          return (
            <NavLink
              key={key}
              to={path}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-pill min-w-[4.5rem] transition-colors ${
                  isActive ? "bg-leaf-100 text-leaf-700" : "text-muted"
                }`
              }
            >
              <span className="relative">
                <Icon size={20} strokeWidth={2.2} />
                {badge && totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[1rem] h-4 px-1 rounded-full bg-gold-500 text-[9px] font-semibold text-ink flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
