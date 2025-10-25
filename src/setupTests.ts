// Mock Capacitor Geolocation plugin
Object.defineProperty(globalThis.navigator, "geolocation", {
  configurable: true,
  value: {
    getCurrentPosition: vi.fn((success) => {
      success({
        coords: {
          latitude: 41.3851,
          longitude: 2.1734,
          accuracy: 10,
        },
        timestamp: Date.now(),
      });
    }),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { vi } from "vitest";

// Mock matchmedia
// Mock window.matchMedia for ThemeProvider compatibility
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
