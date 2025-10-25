import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LocationDetail from "../LocationDetail";

describe("LocationDetail page", () => {
  it("renders location detail", () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter>
            <LocationDetail />
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    );
    expect(
      screen.getByText((content) => content.includes("Detall de Localització"))
    ).toBeDefined();
  });
});
