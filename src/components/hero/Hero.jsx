import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BRAND } from "../../content/brand";
import { Button } from "../ui/Button";
import { ROUTES } from "../../config/navigation";
import { COPY } from "../../config/copy";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <div className="bg-leaf-100 rounded-card p-4 md:p-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-surface text-leaf-900 text-xs font-semibold px-2.5 py-1.5 rounded-pill mb-2.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {BRAND.locality}
          </span>

          <h1 className="type-hero mb-1.5">{BRAND.headline}</h1>
          <p
            className="type-body mb-4 max-w-sm"
            dangerouslySetInnerHTML={{ __html: BRAND.tagline }}
          />

          <div className="flex flex-wrap gap-2.5">
            <Link to={ROUTES.shop}>
              <Button>{COPY.heroStartShopping}</Button>
            </Link>
            <Button variant="outline">{COPY.heroSeeTodaysRate}</Button>
          </div>
        </div>
        <div className="relative order-first md:order-last">
          <img
            src="/images/vegetable-basket.png"
            alt="Fresh vegetable basket"
            className="w-full aspect-[3/2] md:aspect-[16/10] object-cover object-top rounded-card"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
