import { describe, expect, it } from "vitest";
import { authService } from "../authService";

describe("authService", () => {
  it("should have login, logout, register, getCurrentUser methods", () => {
    expect(authService).toHaveProperty("login");
    expect(authService).toHaveProperty("logout");
    expect(authService).toHaveProperty("register");
    expect(authService).toHaveProperty("getCurrentUser");
  });
});
