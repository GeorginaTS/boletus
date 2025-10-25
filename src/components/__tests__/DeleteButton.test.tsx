import { render } from "@testing-library/react";
import DeleteButton from "../DeleteButton";
describe("DeleteButton", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <DeleteButton itemName="Test Item" onDelete={() => {}} />
    );
    expect(container).toBeDefined();
  });
});
