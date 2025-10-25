# Proximity Notifications Setup

## Overview
Aquest document explica la implementació de les notificacions de proximitat a l'app, utilitzant el hook personalitzat `useProximityNotification`.

---

## 1. Què són les Proximity Notifications?

- Són notificacions que s'envien a l'usuari quan es troba a prop d'una ubicació d'interès (per exemple, una zona amb bolets).
- S'utilitzen per millorar l'experiència de l'usuari i oferir informació contextual.

---

## 2. Implementació del Hook `useProximityNotification`

- **Fitxer:** `src/hooks/useProximityNotification.ts`
- **Funcionalitat:**
  - Monitoritza la ubicació de l'usuari (GPS).
  - Comprova si l'usuari està dins d'un radi definit d'una ubicació d'interès.
  - Mostra una notificació local (push o web) si l'usuari entra en la zona.
- **Exemple d'ús:**
  ```ts
  import useProximityNotification from '@/hooks/useProximityNotification';
  // ...existing code...
  useProximityNotification(locations, radius);
  ```
  - `locations`: Array d'ubicacions d'interès (latitud/longitud).
  - `radius`: Radi de proximitat en metres.

---

## 3. Permisos

- **Android/iOS:**
  - Cal autoritzar l'accés a la ubicació.
  - Cal autoritzar les notificacions.
- **Web/PWA:**
  - Es sol·licita permís per a la ubicació i per mostrar notificacions.

---

## 4. Notificació Local

- Quan l'usuari entra en una zona de proximitat:
  - Es mostra una notificació local amb informació rellevant.
  - Exemple de codi:
    ```ts
    if (isNearLocation) {
      new Notification('Estàs a prop d'una zona de bolets!', {
        body: 'Consulta la informació disponible.',
      });
    }
    ```

---

## 5. Troubleshooting

- Comprova que els permisos de ubicació i notificacions estan concedits.
- Verifica que el hook rep correctament les ubicacions i el radi.
- Revisa la lògica de càlcul de distància per evitar notificacions falses.

---

## Referències
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

**Last updated:** October 25, 2025
