import { render } from "@testing-library/react";
import { ThemeProvider } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";
describe("ThemeToggle", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(container).toBeDefined();
  });
});
