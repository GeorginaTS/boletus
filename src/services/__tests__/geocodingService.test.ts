import { describe, expect, it } from "vitest";
import { geocodingService } from "../geocodingService";

describe("geocodingService", () => {
  it("should have getLocationInfo method", () => {
    expect(geocodingService).toHaveProperty("getLocationInfo");
  });
});
