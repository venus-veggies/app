import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_KEY = "cart_guest";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState({});

  const storageKey = user ? `cart_${user.id}` : GUEST_KEY;

  // Load cart from storage, merging guest cart into user cart if needed
  useEffect(() => {
    let baseItems = {};

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        baseItems = JSON.parse(saved);
      }
    } catch {
      baseItems = {};
    }

    if (user) {
      const guestCart = localStorage.getItem(GUEST_KEY);
      if (guestCart) {
        try {
          const guestItems = JSON.parse(guestCart);
          const merged = { ...baseItems };

          for (const [key, guestEntry] of Object.entries(guestItems)) {
            if (merged[key]) {
              merged[key].qty += guestEntry.qty;
            } else {
              merged[key] = guestEntry;
            }
          }

          baseItems = merged;
          localStorage.removeItem(GUEST_KEY);
        } catch {
          localStorage.removeItem(GUEST_KEY);
        }
      }
    }

    setItems(baseItems);
  }, [storageKey, user]);

  // Save cart whenever items change
  useEffect(() => {
    if (Object.keys(items).length === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, storageKey]);

  // Add item – variant-aware
  const addItem = useCallback((product, qty = 1, selectedVariant = null) => {
    setItems((prev) => {
      const variant = selectedVariant || product.variant || null;
      const key = variant?.id ? `${product.slug}_${variant.id}` : product.slug;

      const existing = prev[key];
      const nextQty = (existing?.qty ?? 0) + qty;

      return {
        ...prev,
        [key]: {
          product: {
            slug: product.slug,
            name: product.name,
            image_url: product.image_url,
            price: variant?.current_price ?? product.price ?? 0,
            variant: variant
              ? {
                  id: variant.id,
                  label: variant.display_label || variant.label || null,
                  price: variant.current_price ?? variant.price ?? null,
                  unit: variant.quantity_unit || variant.unit || null,
                }
              : null,
          },
          qty: nextQty,
        },
      };
    });
  }, []);

  const setQty = useCallback((itemKey, qty) => {
    setItems((prev) => {
      if (qty <= 0) {
        const { [itemKey]: _drop, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemKey]: { ...prev[itemKey], qty },
      };
    });
  }, []);

  const removeItem = useCallback((itemKey) => {
    setItems((prev) => {
      const { [itemKey]: _drop, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const lineItems = useMemo(
    () =>
      Object.entries(items).map(([key, entry]) => ({
        key,
        ...entry,
      })),
    [items],
  );

  const totalCount = useMemo(
    () => lineItems.reduce((sum, l) => sum + l.qty, 0),
    [lineItems],
  );

  const subtotal = useMemo(
    () => lineItems.reduce((sum, l) => sum + l.qty * (l.product.price ?? 0), 0),
    [lineItems],
  );

  const value = useMemo(
    () => ({
      lineItems,
      totalCount,
      subtotal,
      addItem,
      setQty,
      removeItem,
      clearCart,
    }),
    [lineItems, totalCount, subtotal, addItem, setQty, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
