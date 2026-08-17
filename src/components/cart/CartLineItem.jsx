import { useState } from "react";
import { X } from "lucide-react";
import { QuantityStepper } from "../ui/QuantityStepper";
import { formatINR } from "../../config/constants";

export function CartLineItem({ product, qty, onRemove, onQtyChange }) {
  const unit = product.variant?.display_label ?? product.variant?.label ?? "";
  const imageSrc = product.image_url;
  const [imgError, setImgError] = useState(false);

  // Variant-aware key – same as CartContext
  const itemKey = product.variant?.id
    ? `${product.slug}_${product.variant.id}`
    : product.slug;

  return (
    <div className="flex gap-3 bg-surface rounded-card p-3 shadow-card">
      {imageSrc && !imgError ? (
        <img
          src={imageSrc}
          alt={product.name}
          className="w-16 h-16 rounded-btn object-cover shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-16 h-16 rounded-btn flex items-center justify-center bg-leaf-100/60 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="type-name line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <p className="type-caption mb-1.5">{unit}</p>
          </div>
          <button
            onClick={() => onRemove(itemKey)}
            aria-label={`Remove ${product.name}`}
            className="text-muted hover:text-tomato-600 shrink-0 transition-colors active:scale-90"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="type-price">{formatINR(product.price * qty)}</span>
          <QuantityStepper
            value={qty}
            onChange={(val) => onQtyChange(itemKey, val)}
          />
        </div>
      </div>
    </div>
  );
}
