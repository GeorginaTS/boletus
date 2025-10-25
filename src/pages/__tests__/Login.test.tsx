import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Login from "../Login";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AuthProvider>{ui}</AuthProvider>
    </ThemeProvider>
  );
}

describe("Login page", () => {
  it("renders login form", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/iniciar sessió/i)).toBeDefined();
  });
});
