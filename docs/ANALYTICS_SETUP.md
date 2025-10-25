# Analytics Setup

## Overview
This document explains how Firebase Analytics is integrated in the project for both Android (native app) and PWA (web app), and how to check statistics.

---

## 1. Firebase Analytics for Android

- **Configuration file:** `google-services.json` must be present in `android/app/`.
- **Gradle dependency:** Ensure the following is in `android/app/build.gradle`:
  ```gradle
  implementation 'com.google.firebase:firebase-analytics'
  ```
- **Automatic tracking:** No extra code is needed; Firebase automatically tracks app usage and events.
- **Statistics:**
  - Access via [Firebase Console](https://console.firebase.google.com/) > Analytics.
  - Download stats are available in [Google Play Console](https://play.google.com/console/).

---

## 2. Firebase Analytics for PWA/Web

- **Initialization:**
  - In `src/config/firebase.ts`:
    ```ts
    import { getAnalytics } from "firebase/analytics";
    import { initializeApp } from "firebase/app";
    // ...existing code...
    const app = initializeApp(firebaseConfig);
    export const analytics = getAnalytics(app);
    ```
- **Environment variables:**
  - Set all Firebase config variables in `.env` or via Vite environment variables.
- **Statistics:**
  - Access via [Firebase Console](https://console.firebase.google.com/) > Analytics.

---

## 3. How to Check Analytics

- **Firebase Console:**
  - Go to your project > Analytics > Dashboard.
  - View events, user engagement, retention, and more.
- **Google Play Console:**
  - For download/install stats (Android only).

---

## 4. Custom Events (Optional)

You can log custom events in your app:
```ts
import { logEvent } from "firebase/analytics";
import { analytics } from "@/config/firebase";

logEvent(analytics, "event_name", { param: "value" });
```

---

## 5. Troubleshooting

- Ensure `google-services.json` is present and correct for Android.
- Check that all Firebase config variables are set for web.
- Verify that Analytics appears in the Firebase Console after usage.

---

## References
- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Google Play Console](https://play.google.com/console/)

---

**Last updated:** October 25, 2025
