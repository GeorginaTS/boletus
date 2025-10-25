import { render } from "@testing-library/react";
import WeatherInfo from "../WeatherInfo";
describe("WeatherInfo", () => {
  it("renders without crashing", () => {
    const { container } = render(<WeatherInfo latitude={0} longitude={0} />);
    expect(container).toBeDefined();
  });
});
