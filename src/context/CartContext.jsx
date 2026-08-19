import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getCartKey,
  loadAndMergeGuestCart,
  saveCart,
} from "../utils/cartStorage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState({});

  const storageKey = getCartKey(user);

  // Load cart and merge guest cart when storageKey or user changes
  useEffect(() => {
    setItems(loadAndMergeGuestCart(storageKey, user));
  }, [storageKey, user]);

  // Save cart whenever items change
  useEffect(() => {
    saveCart(storageKey, items);
  }, [items, storageKey]);

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
