import { render } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import MapView from "../MapView";

import { vi } from "vitest";

// Mock setTimeout to run instantly
beforeAll(() => {
  vi.spyOn(global, "setTimeout").mockImplementation(
    (callback, delay, ...args) => {
      callback(...args);
      return {} as unknown as NodeJS.Timeout;
    }
  );
});
afterAll(() => {
  // @ts-expect-error: mockRestore només existeix si s'ha fet spyOn
  global.setTimeout.mockRestore?.();
});

// Mock googleMapsService
vi.mock("@services/googleMapsService", () => ({
  googleMapsService: {
    createMap: vi.fn(),
    loadAndDisplayLocations: vi.fn(),
    resize: vi.fn(),
    destroy: vi.fn(),
    updateUserLocation: vi.fn(),
  },
}));
describe("MapView", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <AuthProvider>
        <MapView />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });
});
