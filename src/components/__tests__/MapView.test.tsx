import { render } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import MapView from "../MapView";
describe("MapView", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <AuthProvider>
        <MapView />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });
});
