// Firebase Cloud Messaging Service Worker
// Aquest fitxer gestiona les notificacions en background per a PWA

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js"
);

// Configuració de Firebase (es carregarà des de variables d'entorn)
const firebaseConfig = {
  apiKey: self.VITE_FIREBASE_API_KEY,
  authDomain: self.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: self.VITE_FIREBASE_PROJECT_ID,
  storageBucket: self.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: self.VITE_FIREBASE_APP_ID,
};

// Inicialitza Firebase
firebase.initializeApp(firebaseConfig);

// Obté una referència al servei de missatgeria
const messaging = firebase.messaging();

// Gestió de missatges en background
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Personalitza la notificació
  const notificationTitle = payload.notification?.title || "Mushroom Finder";
  const notificationOptions = {
    body: payload.notification?.body || "Nova notificació",
    icon: payload.notification?.icon || "/favicon.svg",
    badge: "/favicon.svg",
    data: payload.data,
    actions: [
      {
        action: "view",
        title: "Veure",
        icon: "/icons/view.png",
      },
      {
        action: "dismiss",
        title: "Descartar",
        icon: "/icons/dismiss.png",
      },
    ],
    requireInteraction: true,
    silent: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestió de clics en notificacions
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === "dismiss") {
    // No fer res, només tancar la notificació
    return;
  }

  // Obre o enfoca l'aplicació
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si hi ha una finestra oberta, enfoca-la
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            if (notificationData && notificationData.locationId) {
              // Navega a la localització específica
              client.postMessage({
                type: "NOTIFICATION_CLICK",
                data: notificationData,
              });
            }
            return client.focus();
          }
        }

        // Si no hi ha cap finestra oberta, obre'n una de nova
        let url = self.location.origin;
        if (notificationData && notificationData.locationId) {
          url += `/tab2?locationId=${notificationData.locationId}`;
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Gestió d'instal·lació del service worker
self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker installing...");
  self.skipWaiting();
});

// Gestió d'activació del service worker
self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker activating...");
  event.waitUntil(clients.claim());
});

// Gestió de push events (per a compatibilitat addicional)
self.addEventListener("push", (event) => {
  if (event.data) {
    console.log(
      "[firebase-messaging-sw.js] Push event received:",
      event.data.text()
    );

    try {
      const payload = event.data.json();
      const title = payload.notification?.title || "Mushroom Finder";
      const options = {
        body: payload.notification?.body || "Nova notificació",
        icon: payload.notification?.icon || "/favicon.svg",
        badge: "/favicon.svg",
        data: payload.data,
      };

      event.waitUntil(self.registration.showNotification(title, options));
    } catch (error) {
      console.error(
        "[firebase-messaging-sw.js] Error processing push event:",
        error
      );
    }
  }
});
