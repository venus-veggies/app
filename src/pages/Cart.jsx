import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CartLineItem } from "../components/cart/CartLineItem";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Button } from "../components/ui/Button";
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
      <div className="flex flex-col items-center text-center py-20">
        <div className="w-16 h-16 rounded-full bg-leaf-100 flex items-center justify-center mb-4">
          <ShoppingBasket size={28} className="text-leaf-600" />
        </div>
        <h1 className="type-section mb-1">{COPY.cartEmptyTitle}</h1>
        <p className="text-sm text-muted mb-5">{COPY.cartEmptyHint}</p>
        <Link to={ROUTES.shop}>
          <Button>{COPY.cartStartShopping}</Button>
        </Link>
      </div>
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

      <div className="flex flex-col gap-3 mb-5">
        {lineItems.map(({ key, product, qty }) => (
          <CartLineItem
            key={key}
            product={product}
            qty={qty}
            onRemove={removeItem}
            onQtyChange={setQty}
          />
        ))}
      </div>

      <OrderSummary subtotal={subtotal} />

      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-card shadow-card p-4 mb-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="type-section">Delivery Address</h2>
          {!showAddressForm && (
            <button
              type="button"
              onClick={() => setShowAddressForm(true)}
              className="text-sm text-leaf-700 flex items-center gap-1"
            >
              <Pencil size={14} /> Change
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
              placeholder="House no, street, area"
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
              required
            />
            <input
              value={address.address_line2}
              onChange={(e) =>
                setAddress({ ...address, address_line2: e.target.value })
              }
              placeholder="Colony, sector (optional)"
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <input
              value={address.landmark}
              onChange={(e) =>
                setAddress({ ...address, landmark: e.target.value })
              }
              placeholder="Landmark (optional)"
              className="w-full border border-border rounded-btn px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <input
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              placeholder="Pincode"
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

      {lineItems.length > 0 && (
        <button
          onClick={() => clearCart()}
          className="w-full text-center text-sm text-tomato-600 mt-2 underline underline-offset-2 transition-colors hover:text-tomato-500 active:scale-95"
        ></button>
      )}
    </div>
  );
}
