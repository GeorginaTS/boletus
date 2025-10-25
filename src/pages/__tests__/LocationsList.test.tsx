import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import LocationsList from "../LocationsList";

describe("LocationsList page", () => {
  it("renders locations list", () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <LocationsList />
        </ThemeProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/les meves localitzacions/i)).toBeDefined();
  });
});
