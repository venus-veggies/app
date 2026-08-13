import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useOrder } from "../hooks/useOrder";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  delivered: "bg-leaf-100 text-leaf-700",
  cancelled: "bg-tomato-100 text-tomato-600",
};

export default function OrderDetail() {
  const { id } = useParams();
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse space-y-4">
        <div className="h-6 bg-leaf-100 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-leaf-100 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="mb-3">Order not found</p>
        <Link to={ROUTES.orders} className="text-leaf-700 underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <Link
        to={ROUTES.orders}
        className="inline-flex items-center gap-1 text-sm text-leaf-700 mb-4"
      >
        <ChevronLeft size={16} />
        My Orders
      </Link>

      <div className="flex items-center justify-between mb-4">
        <h1 className="type-hero">Order #{order.id}</h1>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-pill ${
            statusStyles[order.status] || "bg-surface-secondary text-text-body"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4 mb-4">
        <h2 className="type-section mb-2">Items</h2>
        <div className="divide-y divide-border">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between py-2 text-sm">
              <div>
                <p className="text-ink font-medium">{item.product_name}</p>
                <p className="text-muted text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-body">₹{item.total_price}</p>
                <p className="text-muted text-xs">₹{item.unit_price} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4 mb-4">
        <h2 className="type-section mb-2">Summary</h2>
        <div className="flex justify-between text-sm text-body mb-1">
          <span>Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-body mb-1">
          <span>Delivery</span>
          <span>₹{order.delivery_charge}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-tomato-600 mb-1">
            <span>Discount</span>
            <span>-₹{order.discount}</span>
          </div>
        )}
        <div className="border-t border-border pt-2 flex justify-between font-medium text-ink">
          <span>Total</span>
          <span className="text-leaf-700">₹{order.total}</span>
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <h2 className="type-section mb-2">Delivery Address</h2>
        <p className="text-sm text-body">{order.address || "—"}</p>
        <p className="text-xs text-muted mt-1">
          Ordered on{" "}
          {new Date(order.ordered_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
