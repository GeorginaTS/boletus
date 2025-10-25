import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Map from "../Map";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AuthProvider>{ui}</AuthProvider>
    </ThemeProvider>
  );
}

describe("Map page", () => {
  it("renders map container", () => {
    renderWithProviders(<Map />);
    expect(screen.getByTestId("map-container")).toBeDefined();
  });
});
