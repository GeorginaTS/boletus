import { render } from "@testing-library/react";
import LastLocationCard from "../LastLocationCard";
describe("LastLocationCard", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <LastLocationCard latitude={41.38} longitude={2.17} />
    );
    expect(container).toBeDefined();
  });
});
