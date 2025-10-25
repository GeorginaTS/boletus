import { describe, expect, it } from "vitest";
import { notificationService } from "../notificationService";

describe("notificationService", () => {
  it("should have requestAndSavePushToken and addNotificationListener methods", () => {
    expect(notificationService).toHaveProperty("requestAndSavePushToken");
    expect(notificationService).toHaveProperty("addNotificationListener");
  });
});
