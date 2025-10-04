import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "mushroom-finder",
  webDir: "dist",
  plugins: {
    Geolocation: {
      // Configuració per màxima precisió GPS
      enableHighAccuracy: true,
      timeout: 30000, // 30 segons per donar temps al GPS
      maximumAge: 10000, // Només 10 segons per forçar dades fresques
      // Configuracions addicionals per Android/iOS
      androidGpsTimeout: 30000,
      iosLocationTimeout: 30000,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
