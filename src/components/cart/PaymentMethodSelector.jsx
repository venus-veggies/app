export function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="flex gap-3">
      <label
        className={`flex-1 flex items-center justify-center gap-2 border rounded-btn px-3 py-2.5 text-sm cursor-pointer ${
          value === "cod" ? "border-leaf-500 bg-leaf-100" : "border-border"
        }`}
      >
        <input
          type="radio"
          name="payment_method"
          value="cod"
          checked={value === "cod"}
          onChange={() => onChange("cod")}
          className="hidden"
        />
        Cash on Delivery
      </label>
      <label
        className={`flex-1 flex items-center justify-center gap-2 border rounded-btn px-3 py-2.5 text-sm cursor-pointer ${
          value === "online" ? "border-leaf-500 bg-leaf-100" : "border-border"
        }`}
      >
        <input
          type="radio"
          name="payment_method"
          value="online"
          checked={value === "online"}
          onChange={() => onChange("online")}
          className="hidden"
        />
        Online Payment
      </label>
    </div>
  );
}
