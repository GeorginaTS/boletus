/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Mushroom Finder",
        short_name: "Bolets",
        description:
          "Troba, guarda i comparteix les millors ubicacions per recollir bolets.",
        start_url: ".",
        display: "standalone",
        background_color: "#f8f8f8",
        theme_color: "#8B4513",
        orientation: "portrait",
        lang: "ca",
        scope: ".",
        icons: [
          {
            src: "web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "screenshoots/screenshot1.png",
            sizes: "1080x1920",
            type: "image/png",
          },
          {
            src: "screenshoots/screenshot2.png",
            sizes: "1080x1920",
            type: "image/png",
          },
          {
            src: "screenshoots/screenshot3.png",
            sizes: "1080x1920",
            type: "image/png",
          },
        ],
        categories: ["travel", "nature", "tools"],
        prefer_related_applications: false,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@theme": path.resolve(__dirname, "./src/theme"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            if (id.includes("@ionic/react")) {
              return "ionic";
            }
            if (id.includes("firebase")) {
              return "firebase";
            }
            if (id.includes("google")) {
              return "google-maps";
            }
            return "vendor";
          }

          // Application chunks
          if (id.includes("/src/pages/")) {
            return "pages";
          }
          if (id.includes("/src/services/")) {
            return "services";
          }
          if (id.includes("/src/components/")) {
            return "components";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
