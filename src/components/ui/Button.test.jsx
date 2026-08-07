import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Add to cart</Button>);
    expect(
      screen.getByRole("button", { name: "Add to cart" }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders outline variant without primary classes", () => {
    render(<Button variant="outline">Cancel</Button>);
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button).toBeInTheDocument();
    // outline variant should not have the primary background
    expect(button.className).not.toContain("bg-leaf-500");
  });
});
