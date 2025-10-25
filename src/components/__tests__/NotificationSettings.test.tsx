import { render } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import NotificationSettings from "../NotificationSettings";
describe("NotificationSettings", () => {
  it("renders without crashing", () => {
    // Mock Notification API
    global.Notification = class {
      static permission: NotificationPermission = "granted";
      static requestPermission(): Promise<NotificationPermission> {
        return Promise.resolve("granted");
      }
      badge = "";
      body = "";
      data = {};
      dir: NotificationDirection = "auto";
      icon = "";
      image = "";
      lang = "en";
      renotify = false;
      requireInteraction = false;
      silent = false;
      tag = "";
      timestamp = Date.now();
      title = "";
      vibrate = [];
      actions = [];
      eventListeners = {};
      close() {}
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {
        return false;
      }
      onclick = null;
      onclose = null;
      onerror = null;
      onshow = null;
      constructor(title: string, options?: NotificationOptions) {
        this.title = title;
        Object.assign(this, options);
      }
    };
    const { container } = render(
      <AuthProvider>
        <NotificationSettings />
      </AuthProvider>
    );
    expect(container).toBeDefined();
  });
});
