import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CartLineItem } from "../components/cart/CartLineItem";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { placeOrder } from "../data/orders";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function Cart() {
  const { lineItems, subtotal, setQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    address_line1: user?.address_line1 || "",
    address_line2: user?.address_line2 || "",
    landmark: user?.landmark || "",
    pincode: user?.pincode || "",
  });

  const [showAddressForm, setShowAddressForm] = useState(
    !user?.address_line1 || !user?.pincode,
  );
  const [placing, setPlacing] = useState(false);

  if (lineItems.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBasket size={28} className="text-leaf-600" />}
        title={COPY.cartEmptyTitle}
        message={COPY.cartEmptyHint}
        actionLabel={COPY.cartStartShopping}
        actionTo={ROUTES.shop}
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.address_line1.trim() || !address.pincode.trim()) {
      toast.error("Please provide address and pincode.");
      setShowAddressForm(true);
      return;
    }

    const items = lineItems.map(({ product, qty }) => ({
      product_variant_id: product.variant?.id,
      quantity: qty,
    }));

    if (items.some((i) => !i.product_variant_id)) {
      toast.error(
        "Some items are missing variant info. Please remove and re-add them.",
      );
      return;
    }

    setPlacing(true);
    try {
      await placeOrder({
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        landmark: address.landmark,
        pincode: address.pincode,
        payment_method: "cod",
        items,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate(ROUTES.orders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="pb-8">
      <h1 className="type-hero mb-4">{COPY.cartTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Items – left 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {lineItems.map(({ key, product, qty }) => (
            <CartLineItem
              key={key}
              product={product}
              qty={qty}
              onRemove={removeItem}
              onQtyChange={setQty}
            />
          ))}

          {lineItems.length > 0 && (
            <button
              onClick={() => clearCart()}
              className="w-full text-center text-sm text-tomato-600 mt-1 underline underline-offset-2 transition-colors hover:text-tomato-500 active:scale-95"
            >
              {COPY.cartClear}
            </button>
          )}
        </div>

        {/* Summary + address + checkout – right 1/3 */}
        <div className="space-y-4">
          <OrderSummary subtotal={subtotal} />

          <form
            onSubmit={handleSubmit}
            className="bg-surface rounded-card shadow-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="type-section">{COPY.addressTitle}</h2>
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-sm text-leaf-700 flex items-center gap-1"
                >
                  <Pencil size={14} />
                  Change
                </button>
              )}
            </div>

            {showAddressForm ? (
              <>
                <input
                  value={address.address_line1}
                  onChange={(e) =>
                    setAddress({ ...address, address_line1: e.target.value })
                  }
                  placeholder={COPY.addressLine1Placeholder}
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
                  required
                />
                <input
                  value={address.address_line2}
                  onChange={(e) =>
                    setAddress({ ...address, address_line2: e.target.value })
                  }
                  placeholder={COPY.addressLine2Placeholder}
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
                />
                <input
                  value={address.landmark}
                  onChange={(e) =>
                    setAddress({ ...address, landmark: e.target.value })
                  }
                  placeholder={COPY.landmarkPlaceholder}
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
                />
                <input
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  placeholder={COPY.pincodePlaceholder}
                  type="tel"
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
                  required
                />
              </>
            ) : (
              <div className="text-sm text-body bg-leaf-100/60 rounded-btn p-3">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                {address.landmark && <p>{address.landmark}</p>}
                <p className="font-medium">{address.pincode}</p>
              </div>
            )}

            <Button type="submit" className="w-full py-3" disabled={placing}>
              {placing ? "Placing order…" : COPY.cartCheckout}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
