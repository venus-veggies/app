const FALLBACK_COLORS = [
  "#F5E6C8", // warm sand
  "#E5D4F0", // lavender
  "#F5D4D0", // rose
  "#F5EBC8", // butter
  "#D4E8C8", // mint
  "#C8E0F0", // sky
];

const ACTIVE_GREEN = "#3F9B3F";
const ACTIVE_TEXT = "#27500A";
const INACTIVE_TEXT = "#3D3833";

function colorFor(name) {
  if (!name) return FALLBACK_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function shortLabel(name) {
  if (!name) return "";
  if (name.includes("&")) {
    const first = name.split("&")[0].trim();
    if (first.length >= 2) return first;
  }
  if (name.includes("-")) {
    const parts = name
      .split("-")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) return `${parts[0]} & ${parts[1]}`;
    if (parts.length === 1) return parts[0];
  }
  return name;
}

export default function CategoryTile({ name, imageUrl, isActive, onClick }) {
  const bgColor = imageUrl ? undefined : colorFor(name);
  const label = shortLabel(name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center shrink-0 px-3 py-1.5 pb-3 rounded-2xl transition-colors ${
        isActive ? "bg-leaf-100" : "bg-transparent"
      }`}
    >
      <div
        className="w-[76px] h-[76px] rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: bgColor,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-2xl font-semibold text-[#3D3833]/70">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="relative mt-2">
        <span
          className={`text-xs text-center leading-tight max-w-[76px] block ${
            isActive ? "font-semibold" : "font-medium"
          }`}
          style={{ color: isActive ? ACTIVE_TEXT : INACTIVE_TEXT }}
        >
          {label}
        </span>
        {isActive && (
          <span
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-full"
            style={{ backgroundColor: ACTIVE_GREEN }}
          />
        )}
      </div>
    </button>
  );
}
