import { ThemeProvider } from "@/contexts/ThemeContext";
import { render } from "@testing-library/react";
import SectionHeader from "../SectionHeader";

describe("SectionHeader", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ThemeProvider>
        <SectionHeader icon={"icon"} title="Test" />
      </ThemeProvider>
    );
    expect(container).toBeDefined();
  });
});
