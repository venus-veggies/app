import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  delivered: "bg-leaf-100 text-leaf-700",
  cancelled: "bg-tomato-100 text-tomato-600",
};

export default function Orders() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse space-y-4">
        <div className="h-6 bg-leaf-100 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-leaf-100 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="mb-3">{error}</p>
        <Link to={ROUTES.shop} className="text-leaf-700 underline">
          {COPY.backToShop}
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="mb-3">No orders yet.</p>
        <Link to={ROUTES.shop} className="text-leaf-700 underline">
          {COPY.cartStartShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="type-hero mb-4">My Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`${ROUTES.orders}/${order.id}`}
            className="block bg-surface rounded-card shadow-card p-4 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-ink">Order #{order.id}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-pill ${
                  statusStyles[order.status] ||
                  "bg-surface-secondary text-text-body"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex justify-between text-sm text-body">
              <span>
                {new Date(order.ordered_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="font-semibold text-leaf-700">
                ₹{order.total}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
