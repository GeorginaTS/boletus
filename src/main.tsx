import App from '@/App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import '@styles/globals.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Defineix els elements PWA per a funcionalitats com la càmera
defineCustomElements(window);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);