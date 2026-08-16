import { Minus, Plus } from "lucide-react";
import { COPY } from "../../config/copy";

export function QuantityStepper({ value, onChange, min = 0, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 bg-page border border-border rounded-pill px-1.5 py-1 ${className}`}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-ink shadow-card transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
        aria-label={COPY.quantityDecreaseAria}
      >
        <Minus size={12} />
      </button>
      <span className="w-4 text-center text-sm font-medium text-ink">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 rounded-full bg-leaf-500 flex items-center justify-center text-white shadow-sm transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-300"
        aria-label={COPY.quantityIncreaseAria}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
