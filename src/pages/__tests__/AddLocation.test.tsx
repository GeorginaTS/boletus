import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AddLocation from "../AddLocation";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AuthProvider>{ui}</AuthProvider>
    </ThemeProvider>
  );
}

describe("AddLocation page", () => {
  it("renders add location form", () => {
    renderWithProviders(<AddLocation />);
    expect(screen.getByText(/afegir localització/i)).toBeDefined();
  });
});
