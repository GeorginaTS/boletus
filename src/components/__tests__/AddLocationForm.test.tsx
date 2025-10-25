import { render } from "@testing-library/react";
import AddLocationForm from "../AddLocationForm";
describe("AddLocationForm", () => {
  it("renders without crashing", () => {
    const mockFormData = { name: "", description: "", lat: 0, lng: 0 };
    const { container } = render(
      <AddLocationForm
        formData={mockFormData}
        photoPreviewUrl={null}
        isSubmitting={false}
        isUploadingPhoto={false}
        onInputChange={() => {}}
        onSubmit={() => {}}
        onTakePhoto={() => {}}
        onRemovePhoto={() => {}}
      />
    );
    expect(container).toBeDefined();
  });
});
