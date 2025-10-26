// Mock IonToggle to expose checked and disabled props for Vitest
import { fireEvent, render, waitFor } from "@testing-library/react";
import { User } from "firebase/auth";
import { vi } from "vitest";
import NotificationToggle from "../NotificationToggle";
vi.mock("@ionic/react", () => {
  return {
    IonToggle: ({
      checked,
      disabled,
      ...props
    }: React.PropsWithChildren<{
      checked?: boolean;
      disabled?: boolean;
      [key: string]: unknown;
    }>) => (
      <input
        type="checkbox"
        data-testid={props["data-testid"]}
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          if (typeof props.onIonChange === "function") {
            props.onIonChange({ detail: { checked: e.target.checked } });
          }
        }}
      />
    ),
    IonItem: ({ children }: React.PropsWithChildren<object>) => <>{children}</>,
    IonLabel: ({ children }: React.PropsWithChildren<object>) => (
      <>{children}</>
    ),
  };
});

describe("NotificationToggle", () => {
  const mockUser = { uid: "testuid" } as User;

  it("mostra el toggle activat si pushToken existeix", () => {
    const { getByTestId } = render(
      <NotificationToggle user={mockUser} pushToken="token123" />
    );
    const toggle = getByTestId("notification-toggle") as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  it("mostra el toggle desactivat si no hi ha pushToken", () => {
    const { getByTestId } = render(
      <NotificationToggle user={mockUser} pushToken={null} />
    );
    const toggle = getByTestId("notification-toggle") as HTMLInputElement;
    expect(toggle.checked).toBe(false);
  });

  it("canvia l'estat del toggle quan l'usuari fa clic", async () => {
    const { getByTestId, rerender } = render(
      <NotificationToggle user={mockUser} pushToken={null} />
    );
    const toggle = getByTestId("notification-toggle") as HTMLInputElement;
    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    rerender(<NotificationToggle user={mockUser} pushToken={"token123"} />);
    await waitFor(() =>
      expect(
        (getByTestId("notification-toggle") as HTMLInputElement).checked
      ).toBe(true)
    );
  });

  it("mostra error si no hi ha usuari", async () => {
    const { getByTestId } = render(
      <NotificationToggle user={null} pushToken={null} />
    );
    const toggle = getByTestId("notification-toggle") as HTMLInputElement;
    expect(toggle.disabled).toBe(true);
    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    // El toggle no hauria de canviar d'estat
    expect(toggle.checked).toBe(false);
  });
});
