import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "../../config/constants";
import { COPY, tpl } from "../../config/copy";

export function OrderSummary({ subtotal }) {
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <div className="bg-surface rounded-card shadow-card p-4 mb-4">
      <h2 className="type-section mb-3">{COPY.orderSummaryTitle}</h2>
      <div className="flex justify-between text-sm text-body mb-1.5">
        <span>{COPY.subtotalLabel}</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="flex justify-between text-sm text-body mb-3">
        <span>{COPY.deliveryLabel}</span>
        <span>{delivery === 0 ? COPY.deliveryFree : `₹${delivery}`}</span>
      </div>
      {delivery > 0 && (
        <p className="text-xs text-gold-600 mb-3">
          {tpl(COPY.deliveryUpsell, {
            amount: FREE_DELIVERY_THRESHOLD - subtotal,
          })}
        </p>
      )}
      <div className="border-t border-border pt-3 flex justify-between type-section">
        <span>{COPY.totalLabel}</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}
