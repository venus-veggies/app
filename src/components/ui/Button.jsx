export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-leaf-500 hover:bg-leaf-600 text-white",
    outline:
      "bg-surface border border-leaf-900 text-leaf-900 hover:bg-leaf-100",
    ghost: "text-body hover:bg-leaf-100",
    danger: "text-tomato-600 hover:bg-tomato-100",
  };

  const sizes = "px-5 py-2.5 text-sm"; // default size; can be overridden via className

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
