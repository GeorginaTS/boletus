import { AuthProvider } from "@/contexts/AuthContext";
import { render } from "@testing-library/react";
import LogoutButton from "../LogoutButton";
describe("LogoutButton", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <AuthProvider>
        <LogoutButton />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });
});
