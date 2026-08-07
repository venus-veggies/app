import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Mock the API client
vi.mock("../api/client", () => ({
  default: {
    post: vi.fn((url) => {
      if (url === "/login") {
        return Promise.resolve({
          data: {
            token: "fake-token-123",
            user: { id: 157, name: "Updated Name", phone: "9876543210" },
          },
        });
      }
      if (url === "/logout") {
        return Promise.resolve({});
      }
      return Promise.reject(new Error("Unknown url"));
    }),
    get: vi.fn(),
  },
}));

function renderAuthHook() {
  return renderHook(() => useAuth(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no user", () => {
    const { result } = renderAuthHook();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logs in and sets the user", async () => {
    const { result } = renderAuthHook();

    await act(async () => {
      await result.current.login({ phone: "9876543210", password: "secret" });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
    expect(result.current.user.phone).toBe("9876543210");
    expect(localStorage.getItem("token")).toBe("fake-token-123");
  });

  it("logs out and clears the user", async () => {
    const { result } = renderAuthHook();

    // log in first
    await act(async () => {
      await result.current.login({ phone: "9876543210", password: "secret" });
    });

    // log out
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
