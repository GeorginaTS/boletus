import { describe, expect, it } from "vitest";
import { firestoreService } from "../firestoreService";

describe("firestoreService", () => {
  it("should have createUserProfile and getUserProfile methods", () => {
    expect(firestoreService).toHaveProperty("createUserProfile");
    expect(firestoreService).toHaveProperty("getUserProfile");
  });
});
