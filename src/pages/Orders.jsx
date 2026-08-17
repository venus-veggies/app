import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";
import { formatINR } from "../config/constants";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`${ROUTES.orders}/${order.id}`}
            className="block bg-surface rounded-card shadow-card p-4 hover:shadow-card-hover transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
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
                {formatINR(order.total)}
              </span>
            </div>

            {order.thumbnails?.length > 0 ? (
              <div className="flex -space-x-2 mt-3">
                {order.thumbnails.slice(0, 3).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-surface object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="flex -space-x-2 mt-3">
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-leaf-100 flex items-center justify-center">
                  <Sprout size={14} className="text-leaf-600" />
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
