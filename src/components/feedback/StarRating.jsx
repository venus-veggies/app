export function StarRating({ value = 0, onChange, size = "text-2xl" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`${size} ${
            star <= value ? "text-gold-500" : "text-subtle"
          } ${!onChange ? "cursor-default" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
