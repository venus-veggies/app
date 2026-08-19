import { Link } from "react-router-dom";
import { Button } from "./Button";
import { COPY } from "../../config/copy";

export function EmptyState({
  icon,
  title,
  message,
  actionLabel = COPY.cartStartShopping,
  actionTo = "/shop",
}) {
  return (
    <div className="flex flex-col items-center text-center py-16">
      {icon && <div className="mb-3 text-leaf-400">{icon}</div>}
      <h2 className="type-section mb-1">{title}</h2>
      {message && <p className="text-sm text-muted mb-5">{message}</p>}
      {actionLabel && (
        <Link to={actionTo}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
