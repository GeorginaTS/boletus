import { render } from "@testing-library/react";
import NotificationToggle from "../NotificationToggle";
describe("NotificationToggle", () => {
  it("renders without crashing", () => {
    const mockUser = {
      uid: "1",
      email: "test@example.com",
      emailVerified: false,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: "",
      displayName: "Test User",
      photoURL: null,
      phoneNumber: null,
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve("token"),
      providerId: "firebase",
      getIdTokenResult: () =>
        Promise.resolve({
          authTime: "",
          claims: {},
          expirationTime: "",
          issuedAtTime: "",
          signInProvider: "",
          token: "",
          signInSecondFactor: "",
        }),
      reload: () => Promise.resolve(),
      toJSON: () => ({}),
      // Add any other required properties as needed
    };
    const { container } = render(<NotificationToggle user={mockUser} />);
    expect(container).toBeDefined();
  });
});
