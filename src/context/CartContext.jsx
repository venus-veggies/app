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

  // Determine which localStorage key to use
  const storageKey = user ? `cart_${user.id}` : GUEST_KEY;

  // Load cart from storage when key changes (including guest)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems({});
      }
    } catch {
      setItems({});
    }
  }, [storageKey]);

  // Save cart whenever items change
  useEffect(() => {
    if (Object.keys(items).length === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, storageKey]);

  // Merge guest cart into user cart on login
  useEffect(() => {
    if (user) {
      const guestCart = localStorage.getItem(GUEST_KEY);
      if (guestCart) {
        try {
          const guestItems = JSON.parse(guestCart);
          if (Object.keys(guestItems).length > 0) {
            setItems((prev) => {
              const merged = { ...prev };
              for (const [key, guestEntry] of Object.entries(guestItems)) {
                if (merged[key]) {
                  merged[key].qty += guestEntry.qty;
                } else {
                  merged[key] = guestEntry;
                }
              }
              return merged;
            });
          }
          localStorage.removeItem(GUEST_KEY);
        } catch {
          localStorage.removeItem(GUEST_KEY);
        }
      }
    }
  }, [user]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const key = product.slug; // <-- slug, not id
      const existing = prev[key];
      const nextQty = (existing?.qty ?? 0) + qty;
      return {
        ...prev,
        [key]: {
          product: {
            slug: product.slug,
            name: product.name,
            image_url: product.image_url,
            price: product.price,
            variant: product.variant,
          },
          qty: nextQty,
        },
      };
    });
  }, []);

  const setQty = useCallback((productSlug, qty) => {
    // <-- takes slug
    setItems((prev) => {
      if (qty <= 0) {
        const { [productSlug]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productSlug]: { ...prev[productSlug], qty } };
    });
  }, []);

  const removeItem = useCallback((productSlug) => {
    // <-- takes slug
    setItems((prev) => {
      const { [productSlug]: _drop, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const lineItems = useMemo(() => Object.values(items), [items]);
  const totalCount = useMemo(
    () => lineItems.reduce((sum, l) => sum + l.qty, 0),
    [lineItems],
  );
  const subtotal = useMemo(
    () => lineItems.reduce((sum, l) => sum + l.qty * (l.product.price ?? 0), 0),
    [lineItems],
  );

  const value = {
    lineItems,
    totalCount,
    subtotal,
    addItem,
    setQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
