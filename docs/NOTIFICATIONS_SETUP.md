# Notifications Setup

## Overview
Aquest document explica com estan implementades les notificacions push a l'app, tant per Android com per PWA/web, utilitzant Firebase Cloud Messaging (FCM) i el hook personalitzat `useNotifications`.

---

## 1. Firebase Cloud Messaging (FCM)

- **Configuració:**
  - El fitxer `google-services.json` ha d'estar present a `android/app/`.
  - Les variables de configuració de Firebase han d'estar definides a `.env` o via Vite per la web.
- **Dependències:**
  - S'utilitza la llibreria oficial de Firebase per a la gestió de missatges.

---

## 2. Implementació del Hook `useNotifications`

- **Fitxer:** `src/hooks/useNotifications.ts`
- **Funcionalitat:**
  - Gestiona la subscripció a notificacions push.
  - Sol·licita permisos a l'usuari.
  - Registra el token de dispositiu per rebre notificacions.
  - Gestiona la recepció de missatges en primer pla.
- **Exemple d'ús:**
  ```ts
  import useNotifications from '@/hooks/useNotifications';
  // ...existing code...
  useNotifications();
  ```

---

## 3. Permisos i Subscripció

- **Android:**
  - Els permisos es gestionen automàticament via Firebase.
- **Web/PWA:**
  - Es sol·licita permís a l'usuari per mostrar notificacions.
  - El Service Worker gestiona la recepció de notificacions en segon pla.

---

## 4. Enviament de Notificacions

- Les notificacions es poden enviar des del Firebase Console o via API utilitzant el token del dispositiu.
- Exemple d'enviament via API:
  ```json
  POST https://fcm.googleapis.com/fcm/send
  {
    "to": "<device_token>",
    "notification": {
      "title": "Títol",
      "body": "Missatge"
    }
  }
  ```

---

## 5. Troubleshooting

- Comprova que el Service Worker estigui registrat correctament per la web.
- Verifica que el token de dispositiu s'obté i s'envia correctament.
- Revisa la configuració de permisos en el navegador i dispositiu.

---

## Referències
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications](https://web.dev/push-notifications/)

---

**Last updated:** October 25, 2025
