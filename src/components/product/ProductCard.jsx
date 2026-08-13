import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAddToCart } from "../../hooks/useAddToCart";
import { productPath } from "../../config/navigation";

export default function ProductCard({ product, className = "" }) {
  const { lineItems } = useCart();
  const addToCart = useAddToCart();
  const [imgError, setImgError] = useState(false);

  // Get first active variant
  const activeVariant = product.variants?.find((v) => v.status === "active");
  const price = activeVariant ? parseFloat(activeVariant.current_price) : 0;
  const unit = activeVariant?.display_label ?? "";

  // Build the same key used in CartContext so we can count correctly
  const itemKey = activeVariant
    ? `${product.slug}_${activeVariant.id}`
    : product.slug;

  const inCart = lineItems.find((l) => l.key === itemKey)?.qty ?? 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeVariant) return;
    addToCart(
      {
        slug: product.slug,
        name: product.name,
        image_url: product.image_url,
        price,
        variant: activeVariant,
      },
      1,
    );
  };

  return (
    <Link
      to={productPath(product.slug)}
      className={`group block bg-surface rounded-card shadow-card hover:shadow-card-hover transition-shadow overflow-hidden ${className}`}
    >
      <div className="relative aspect-square bg-leaf-100/60 overflow-hidden">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-leaf-100/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-leaf-400"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
        <button
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-2 right-2 min-w-8 h-8 px-1.5 rounded-full bg-leaf-500 hover:bg-leaf-600 text-white flex items-center justify-center gap-1 shadow-float active:scale-95 transition-transform"
        >
          <Plus size={16} strokeWidth={2.5} />
          {inCart > 0 && (
            <span className="text-xs font-semibold leading-none">{inCart}</span>
          )}
        </button>
      </div>
      <div className="p-3">
        <h3 className="type-name truncate">{product.name}</h3>
        <p className="type-caption mb-1.5">{unit || "Per piece"}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="type-price">₹{price || "—"}</span>
        </div>
      </div>
    </Link>
  );
}
