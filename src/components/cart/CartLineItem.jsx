import { X } from "lucide-react";
import { QuantityStepper } from "../ui/QuantityStepper";

export function CartLineItem({ product, qty, onRemove, onQtyChange }) {
  const unit = product.variant?.display_label ?? "";
  const imageSrc = product.image_url;

  return (
    <div className="flex gap-3 bg-surface rounded-card p-3 shadow-card">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={product.name}
          className="w-16 h-16 rounded-btn object-cover shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const placeholder = document.createElement("div");
            placeholder.className =
              "w-16 h-16 rounded-btn flex items-center justify-center bg-leaf-100/60 shrink-0";
            placeholder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-leaf-400"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
            e.currentTarget.parentNode.appendChild(placeholder);
          }}
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
            <h3 className="type-name truncate">{product.name}</h3>
            <p className="type-caption mb-1.5">{unit}</p>
          </div>
          <button
            onClick={() => onRemove(product.slug)}
            aria-label={`Remove ${product.name}`}
            className="text-muted hover:text-tomato-600 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="type-price">
            ₹{(product.price * qty).toFixed(0)}
          </span>
          <QuantityStepper
            value={qty}
            onChange={(val) => onQtyChange(product.slug, val)}
          />
        </div>
      </div>
    </div>
  );
}
