import { render } from "@testing-library/react";
import ProfileViewCard from "../ProfileViewCard";
describe("ProfileViewCard", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ProfileViewCard
        user={null}
        userProfile={null}
        onEditProfile={() => {}}
        onLogout={() => {}}
      />
    );
    expect(container).toBeDefined();
  });
});
