import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Products from "./Products";

// Mock the data hooks so no real API calls fire
vi.mock("../data/categories", () => ({
  getCategories: vi.fn(() => Promise.resolve([])),
}));

vi.mock("../hooks/useProducts", () => ({
  useProducts: vi.fn(() => ({
    products: [],
    meta: null,
    loading: false,
    error: null,
  })),
}));

describe("Products page", () => {
  it("renders the search input and category chips", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <MemoryRouter>
            <Products />
          </MemoryRouter>
        </CartProvider>
      </AuthProvider>,
    );

    // Search input
    expect(
      screen.getByPlaceholderText("Search vegetables…"),
    ).toBeInTheDocument();

    // Category chips (at least "All" should be visible)
    expect(screen.getByText("All")).toBeInTheDocument();
  });
});
