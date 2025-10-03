import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "mushroom-finder",
  webDir: "dist",
  plugins: {
    Geolocation: {
      // Configuració per millor precisió
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    },
  },
};

export default config;
