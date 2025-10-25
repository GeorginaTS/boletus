import { render } from "@testing-library/react";
import { vi } from "vitest";
import LocationListCard from "../LocationListCard";
describe("LocationListCard", () => {
  it("renders without crashing", () => {
    const mockData = {
      location: {
        id: "1",
        name: "Test Location",
        hasPhoto: false,
        description: "Test description",
        lat: 0,
        lng: 0,
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      onViewOnMap: vi.fn(),
      onDelete: vi.fn(),
    };
    const { container } = render(<LocationListCard data={mockData} />);
    expect(container).toBeDefined();
  });
});
