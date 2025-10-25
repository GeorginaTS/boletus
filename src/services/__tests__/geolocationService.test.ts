import { describe, expect, it } from "vitest";
import { geolocationService } from "../geolocationService";

describe("geolocationService", () => {
  it("should have getCurrentPosition and checkPermissions methods", () => {
    expect(geolocationService).toHaveProperty("getCurrentPosition");
    expect(geolocationService).toHaveProperty("checkPermissions");
  });
});
