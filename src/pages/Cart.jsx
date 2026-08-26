import { useEffect, useRef } from "react";
import { ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { CartLineItem } from "../components/cart/CartLineItem";
import { OrderSummary } from "../components/cart/OrderSummary";
import { EmptyState } from "../components/ui/EmptyState";
import { CheckoutForm } from "../components/cart/CheckoutForm";
import { validatePrices } from "../data/products";
import { ROUTES } from "../config/navigation";
import { COPY } from "../config/copy";

export default function Cart() {
  const {
    lineItems,
    subtotal,
    setQty,
    removeItem,
    clearCart,
    updateItemPrice,
  } = useCart();
  const lastValidatedIdsRef = useRef("");

  useEffect(() => {
    const variantIds = lineItems
      .map((item) => item.product.variant?.id)
      .filter(Boolean);
    const idsKey = variantIds.join(",");

    if (!idsKey || idsKey === lastValidatedIdsRef.current) return;
    lastValidatedIdsRef.current = idsKey;

    let cancelled = false;

    validatePrices(variantIds)
      .then((variants) => {
        if (cancelled) return;

        const priceMap = {};
        variants.forEach((v) => {
          priceMap[v.id] = v.current_price;
        });

        let changed = false;
        lineItems.forEach((item) => {
          const variantId = item.product.variant?.id;
          if (variantId && priceMap[variantId] !== undefined) {
            const newPrice = parseFloat(priceMap[variantId]);
            if (item.product.price !== newPrice) {
              updateItemPrice(item.key, newPrice);
              changed = true;
            }
          }
        });

        if (changed) toast.success("Prices updated to today's rates.");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [lineItems, updateItemPrice]);

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

  return (
    <div className="pb-8">
      <h1 className="type-hero mb-4">{COPY.cartTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

        <div className="space-y-4">
          <OrderSummary subtotal={subtotal} />
          <CheckoutForm subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
