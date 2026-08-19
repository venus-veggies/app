export function LoadingSkeleton({ variant = "card", count = 8 }) {
  if (variant === "product-card") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-card shadow-card animate-pulse"
          >
            <div className="aspect-square bg-leaf-100/60 rounded-t-card" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-leaf-100 rounded w-3/4" />
              <div className="h-3 bg-leaf-100 rounded w-1/2" />
              <div className="h-4 bg-leaf-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: simple centered loading block
  return (
    <div className="py-20 text-center animate-pulse space-y-4">
      <div className="h-6 bg-leaf-100 rounded w-1/3 mx-auto" />
      <div className="h-4 bg-leaf-100 rounded w-1/2 mx-auto" />
    </div>
  );
}
