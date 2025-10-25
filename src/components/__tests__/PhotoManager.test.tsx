import { render } from "@testing-library/react";
import PhotoManager from "../PhotoManager";
describe("PhotoManager", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <PhotoManager
        photoPreviewUrl={null}
        isUploadingPhoto={false}
        onTakePhoto={() => {}}
        onRemovePhoto={() => {}}
      />
    );
    expect(container).toBeDefined();
  });
});
