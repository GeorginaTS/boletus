import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.georginats.boletus", // identificador únic de la teva app
  appName: "Boletus",
  webDir: "dist", // deixa-ho igual si builda a dist/
  plugins: {
    Geolocation: {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 10000,
      androidGpsTimeout: 30000,
      iosLocationTimeout: 30000,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;

