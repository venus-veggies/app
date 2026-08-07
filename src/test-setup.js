// src/test-setup.js
import "@testing-library/jest-dom/vitest";

// Suppress specific React warnings that are expected in our test environment
const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString() || "";

  // Ignore specific known warnings
  if (
    message.includes("ReactDOM.render is no longer supported") ||
    message.includes("Warning: validateDOMNesting")
  ) {
    return;
  }

  originalError.call(console, ...args);
};
