import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityStepper } from "./QuantityStepper";

describe("QuantityStepper", () => {
  it("shows the current value", () => {
    render(<QuantityStepper value={3} onChange={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onChange with incremented value when + is clicked", async () => {
    const handleChange = vi.fn();
    render(<QuantityStepper value={3} onChange={handleChange} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Increase quantity" }),
    );
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange with decremented value when - is clicked", async () => {
    const handleChange = vi.fn();
    render(<QuantityStepper value={3} onChange={handleChange} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Decrease quantity" }),
    );
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("does not go below the min value", async () => {
    const handleChange = vi.fn();
    render(<QuantityStepper value={0} onChange={handleChange} min={0} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Decrease quantity" }),
    );
    expect(handleChange).toHaveBeenCalledWith(0);
  });
});
