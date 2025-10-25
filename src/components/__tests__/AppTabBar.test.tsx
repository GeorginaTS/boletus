import { render } from "@testing-library/react";
import AppTabBar from "../AppTabBar";
describe("AppTabBar", () => {
  it("renders without crashing", () => {
    const { container } = render(<AppTabBar />);
    expect(container).toBeDefined();
  });
});
