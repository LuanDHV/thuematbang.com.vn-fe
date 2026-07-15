import "@testing-library/jest-dom";
import { afterEach, jest } from "@jest/globals";

afterEach(() => {
  jest.clearAllMocks();
});

if (typeof window !== "undefined") {
  // Provide a browser-like matchMedia for components that branch on responsive UI.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as typeof window.matchMedia,
  });
}
