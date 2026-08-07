import { useMemo } from "react";

const TONES = {
  leaf: { fill: "#5B8C42", text: "#FFFFFF" },
  gold: { fill: "#E0A039", text: "#3D362E" },
  tomato: { fill: "#D1552F", text: "#FFFFFF" },
};

/**
 * ProduceBadge — the one signature visual of this UI.
 * A small scalloped "sticker" shape, like the label on real fruit,
 * used for freshness tags, discounts, and callouts.
 */
export default function ProduceBadge({
  label,
  tone = "leaf",
  size = 56,
  rotate = -8,
  className = "",
}) {
  const { fill, text } = TONES[tone] ?? TONES.leaf;

  // Build a wavy scalloped-circle path using a sine-modulated radius.
  const path = useMemo(() => {
    const cx = 50,
      cy = 50,
      base = 42,
      amp = 4,
      bumps = 16,
      points = 120;
    let d = "";
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * Math.PI * 2;
      const r = base + amp * Math.sin(t * bumps);
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      d += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
    }
    return d + "Z";
  }, []);

  return (
    <div
      className={`inline-flex items-center justify-center drop-shadow-sm select-none ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="absolute"
      >
        <path d={path} fill={fill} />
      </svg>
      <span
        className="relative font-display font-semibold leading-none text-center px-1"
        style={{ color: text, fontSize: size * 0.19 }}
      >
        {label}
      </span>
    </div>
  );
}
