import { render } from "@testing-library/react";
import LocationInfoCard from "../LocationInfoCard";
describe("LocationInfoCard", () => {
  it("renders without crashing", () => {
    const mockLocation = {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: Date.now(),
    };
    const { container } = render(
      <LocationInfoCard
        location={mockLocation}
        loading={false}
        error={null}
        accuracy={0}
        isHighAccuracy={false}
        cityName={null}
        provinceName={null}
        countryName={null}
        isLoadingCity={false}
        onUpdateLocation={() => {}}
        onHighAccuracyLocation={() => {}}
      />
    );
    expect(container).toBeDefined();
  });
});
