import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { placeOrder } from "../../data/orders";
import { ROUTES } from "../../config/navigation";
import { COPY } from "../../config/copy";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "../../config/constants";
import api from "../../api/client";

export function CheckoutForm({ subtotal }) {
  const { lineItems, clearCart } = useCart();
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
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);

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

    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const totalAmount = subtotal + delivery;

    if (paymentMethod === "online") {
      try {
        const razorpayResponse = await api.post(
          "/orders/create-razorpay-order",
          {
            amount: totalAmount,
            receipt: `order_${Date.now()}`,
          },
        );
        const {
          key_id,
          id: order_id,
          amount,
          currency,
        } = razorpayResponse.data;

        const options = {
          key: key_id,
          amount: amount,
          currency: currency,
          name: "Venus Veggies",
          description: "Order payment",
          order_id: order_id,
          handler: async function (response) {
            setPlacing(true);
            try {
              const orderResult = await placeOrder({
                address_line1: address.address_line1,
                address_line2: address.address_line2,
                landmark: address.landmark,
                pincode: address.pincode,
                payment_method: "online",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                note,
                items,
              });

              clearCart();
              toast.success("Order placed successfully!");
              navigate(`/order-confirmation/${orderResult.data.id}`);
            } catch (err) {
              toast.error(
                err.response?.data?.message ||
                  "Failed to place order after payment",
              );
            } finally {
              setPlacing(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to initiate payment",
        );
      }
      return;
    }

    // COD
    setPlacing(true);
    try {
      const orderResult = await placeOrder({
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        landmark: address.landmark,
        pincode: address.pincode,
        payment_method: "cod",
        note,
        items,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${orderResult.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
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

      <div>
        <label className="block text-sm font-medium text-text-body mb-1">
          Delivery Instructions (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="e.g. Call on arrival, leave at gate, or any special request"
          className="w-full border border-border rounded-btn px-3 py-2 text-sm outline-none placeholder:text-muted resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-body mb-1">
          Payment Method
        </label>
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      <Button type="submit" className="w-full py-3" disabled={placing}>
        {placing ? "Placing order…" : COPY.cartCheckout}
      </Button>
    </form>
  );
}
