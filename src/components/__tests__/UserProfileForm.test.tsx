import * as AuthContext from "@/contexts/AuthContext";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import UserProfileForm from "../UserProfileForm";

describe("UserProfileForm", () => {
  beforeAll(() => {
    const mockUser = {
      uid: "testuid",
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
    };
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: mockUser,
      userProfile: null,
      createUserProfile: vi.fn(),
      updateUserProfile: vi.fn(),
      loading: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUserProfile: vi.fn(),
    });
  });

  it("renders without crashing", () => {
    const { container } = render(<UserProfileForm isNew={true} />);
    expect(container).toBeDefined();
  });
});
