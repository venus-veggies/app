import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubPageHeader({ title, backTo }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        aria-label="Go back"
        className="w-9 h-9 rounded-full bg-leaf-100 flex items-center justify-center shrink-0"
      >
        <ChevronLeft size={18} className="text-leaf-700" />
      </button>
      <h1 className="type-hero">{title}</h1>
    </div>
  );
}
