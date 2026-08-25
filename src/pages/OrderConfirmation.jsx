import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useOrder } from "../hooks/useOrder";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { ROUTES } from "../config/navigation";
import { formatINR } from "../config/constants";

export default function OrderConfirmation() {
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
        <p className="mb-3">Order not found.</p>
        <Link to={ROUTES.shop} className="text-leaf-700 underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const customerNote = order.notes?.find((n) => n.author === "customer")?.body;

  return (
    <div className="pb-8">
      <SubPageHeader title="Order Confirmation" backTo={ROUTES.shop} />

      <div className="flex flex-col items-center text-center py-10">
        <div className="w-16 h-16 rounded-full bg-leaf-100 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-leaf-600" />
        </div>
        <h1 className="type-hero mb-1">Order placed successfully!</h1>
        <p className="text-sm text-muted mb-6">Order #{order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-card shadow-card p-4">
          <h2 className="type-section mb-2">Items</h2>
          <div className="divide-y divide-border">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 text-sm">
                <div>
                  <p className="text-ink">{item.product_name}</p>
                  <p className="text-muted text-xs">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-body">{formatINR(item.total_price)}</p>
                  <p className="text-muted text-xs">
                    {formatINR(item.unit_price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface rounded-card shadow-card p-4">
            <h2 className="type-section mb-2">Summary</h2>
            <div className="flex justify-between text-sm text-body mb-1">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-body mb-1">
              <span>Delivery</span>
              <span>{formatINR(order.delivery_charge)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-tomato-600 mb-1">
                <span>Discount</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span className="text-leaf-700">{formatINR(order.total)}</span>
            </div>
          </div>

          <div className="bg-surface rounded-card shadow-card p-4">
            <h2 className="type-section mb-2">Delivery Address</h2>
            <p className="text-sm text-body">{order.address || "—"}</p>
          </div>

          {customerNote && (
            <div className="bg-surface rounded-card shadow-card p-4">
              <h2 className="type-section mb-2">Your Note</h2>
              <p className="text-sm text-body">{customerNote}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link to={ROUTES.orders} className="flex-1">
          <button className="w-full py-3 rounded-btn bg-surface border border-leaf-200 text-leaf-700 text-sm font-medium">
            View My Orders
          </button>
        </Link>
        <Link to={ROUTES.shop} className="flex-1">
          <button className="w-full py-3 rounded-btn bg-leaf-500 text-white text-sm font-medium">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
