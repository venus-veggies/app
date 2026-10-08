export const DELIVERY_FEE = 20;
export const FREE_DELIVERY_THRESHOLD = 300;
export const DEBOUNCE_DELAY = 350; // ms
export const DEFAULT_PER_PAGE = 50;

export function formatINR(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return "₹0";
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

export const DELIVERY_TIME = "10:00 AM";
export const DELIVERY_NOTE = `Delivered fresh next morning before ${DELIVERY_TIME}`;
