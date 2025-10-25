import { AuthProvider } from "@/contexts/AuthContext";
import { render } from "@testing-library/react";
import AuthGuard from "../AuthGuard";

describe("AuthGuard", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <AuthProvider>
        <AuthGuard>
          <div>Protected</div>
        </AuthGuard>
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });
});
