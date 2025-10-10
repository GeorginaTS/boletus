import App from "@/App";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import "@styles/globals-dark.css";
import "@styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";

// Defineix els elements PWA per a funcionalitats com la càmera
defineCustomElements(window);

// Registra el service worker per a la PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
