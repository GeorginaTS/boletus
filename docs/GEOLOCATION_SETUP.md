# Geolocation Setup

## Overview
Aquest document explica la implementació de la geolocalització a l'app, utilitzant el hook personalitzat `useGeolocation`.

---

## 1. Què és la Geolocalització?

- Permet obtenir la posició actual de l'usuari (latitud i longitud) mitjançant el GPS del dispositiu o la ubicació del navegador.
- S'utilitza per mostrar la ubicació en el mapa, calcular distàncies, activar notificacions de proximitat, etc.

---

## 2. Implementació del Hook `useGeolocation`

- **Fitxer:** `src/hooks/useGeolocation.ts`
- **Funcionalitat:**
  - Obté la ubicació actual de l'usuari.
  - Gestiona permisos de geolocalització.
  - Actualitza la posició en temps real si l'usuari es mou.
- **Exemple d'ús:**
  ```ts
  import useGeolocation from '@/hooks/useGeolocation';
  // ...existing code...
  const { position, error } = useGeolocation();
  ```
  - `position`: Objecte amb latitud i longitud.
  - `error`: Missatge d'error si la ubicació no es pot obtenir.

---

## 3. Permisos

- **Android/iOS:**
  - Cal autoritzar l'accés a la ubicació.
- **Web/PWA:**
  - Es sol·licita permís a l'usuari per accedir a la ubicació.

---

## 4. Troubleshooting

- Comprova que els permisos de ubicació estan concedits.
- Verifica que el dispositiu té GPS o accés a ubicació.
- Revisa la gestió d'errors en el hook.

---

## Referències
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

**Last updated:** October 25, 2025
