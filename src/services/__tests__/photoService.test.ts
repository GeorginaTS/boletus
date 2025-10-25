import { describe, expect, it } from "vitest";
import { photoService } from "../photoService";

describe("photoService", () => {
  it("should have uploadPhotoForLocation and getPhotoUrl methods", () => {
    expect(photoService).toHaveProperty("uploadPhotoForLocation");
    expect(photoService).toHaveProperty("getPhotoUrl");
  });
});
