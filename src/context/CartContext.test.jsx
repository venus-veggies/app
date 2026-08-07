import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { AuthProvider } from "./AuthContext";

// Helper: render the cart hook wrapped in both providers
function renderCartHook() {
  return renderHook(() => useCart(), {
    wrapper: ({ children }) => (
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    ),
  });
}

describe("CartContext", () => {
  it("starts with an empty cart", () => {
    const { result } = renderCartHook();
    expect(result.current.lineItems).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds an item to the cart", () => {
    const { result } = renderCartHook();
    const product = {
      slug: "test-product",
      name: "Test Product",
      image_url: null,
      price: 45,
      variant: { display_label: "500 g" },
    };

    act(() => {
      result.current.addItem(product, 2);
    });

    expect(result.current.lineItems).toHaveLength(1);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.subtotal).toBe(90); // 45 × 2
  });

  it("removes an item from the cart", () => {
    const { result } = renderCartHook();
    const product = {
      slug: "test-product",
      name: "Test Product",
      image_url: null,
      price: 45,
      variant: { display_label: "500 g" },
    };

    act(() => {
      result.current.addItem(product, 1);
      result.current.removeItem(product.slug);
    });

    expect(result.current.lineItems).toHaveLength(0);
  });
});
