import { AuthProvider } from "@/contexts/AuthContext";
import { render } from "@testing-library/react";
import UserProfileForm from "../UserProfileForm";

describe("UserProfileForm", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <AuthProvider>
        <UserProfileForm />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });
});
