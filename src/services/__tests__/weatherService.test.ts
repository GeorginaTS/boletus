import { describe, expect, it } from "vitest";
import { weatherService } from "../weatherService";

describe("weatherService", () => {
  it("should have getCurrentWeather method", () => {
    expect(weatherService).toHaveProperty("getCurrentWeather");
  });
});
