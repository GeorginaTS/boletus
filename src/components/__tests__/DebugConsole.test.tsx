import { render } from "@testing-library/react";
import DebugConsole from "../DebugConsole";
describe("DebugConsole", () => {
  it("renders without crashing", () => {
    const { container } = render(<DebugConsole />);
    expect(container).toBeDefined();
  });
});
