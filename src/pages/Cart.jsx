import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { CartLineItem } from "../components/cart/CartLineItem";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function Cart() {
  const { lineItems, subtotal, setQty, removeItem, clearCart } = useCart();

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

  return (
    <div className="pb-8">
      <h1 className="type-hero mb-4">{COPY.cartTitle}</h1>

      <div className="flex flex-col gap-3 mb-5">
        {lineItems.map(({ product, qty }) => (
          <CartLineItem
            key={product.slug}
            product={product}
            qty={qty}
            onRemove={removeItem}
            onQtyChange={setQty}
          />
        ))}
      </div>

      <OrderSummary subtotal={subtotal} />

      <Button
        className="w-full py-3"
        onClick={() => toast(COPY.cartCheckoutNotWired)}
      >
        {COPY.cartCheckout}
      </Button>

      {lineItems.length > 0 && (
        <button
          onClick={() => clearCart()}
          className="w-full text-center text-sm text-tomato-600 mt-2 underline underline-offset-2"
        >
          {COPY.cartClear}
        </button>
      )}
    </div>
  );
}
