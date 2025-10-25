import { describe, expect, it } from "vitest";
import { googleMapsService } from "../googleMapsService";

describe("googleMapsService", () => {
  it("should have initialize, createMap and addLocation methods", () => {
    expect(googleMapsService).toHaveProperty("initialize");
    expect(googleMapsService).toHaveProperty("createMap");
    expect(googleMapsService).toHaveProperty("addLocation");
  });
});
