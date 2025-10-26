import { render } from "@testing-library/react";
import LocationInfoCard from "../LocationInfoCard";
describe("LocationInfoCard", () => {
  it("renders without crashing", () => {
    const mockLocation = {
      lat: 41.3851,
      lng: 2.1734,
      latitude: 41.3851,
      longitude: 2.1734,
      accuracy: 15,
      timestamp: Date.now(),
      altitude: 0,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
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
