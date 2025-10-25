import { render } from "@testing-library/react";
import FirebaseDebug from "../FirebaseDebug";
describe("FirebaseDebug", () => {
  it("renders without crashing", () => {
    const { container } = render(<FirebaseDebug />);
    expect(container).toBeDefined();
  });
});
