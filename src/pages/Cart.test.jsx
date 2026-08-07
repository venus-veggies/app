import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Cart from "./Cart";

describe("Cart page", () => {
  it("renders the empty state when cart is empty", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>,
    );

    expect(screen.getByText("Your basket is empty")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start shopping" }),
    ).toBeInTheDocument();
  });
});
