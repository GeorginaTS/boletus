import { firestoreService } from "@/services/firestoreService";
import { notificationService } from "@/services/notificationService";
import { IonItem, IonLabel, IonToggle } from "@ionic/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";

interface NotificationToggleProps {
  user: User | null;
  pushToken?: string | null;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  user,
  pushToken,
}) => {
  const [notifEnabled, setNotifEnabled] = useState<boolean>(!!pushToken);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  useEffect(() => setNotifEnabled(!!pushToken), [pushToken]);

  // Helper to add timeout to long-running operations
  const withTimeout = async <T,>(
    p: Promise<T>,
    ms = 15000,
    desc = "operation"
  ) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_res, rej) => {
      timeoutId = setTimeout(
        () => rej(new Error(`${desc} timed out after ${ms}ms`)),
        ms
      );
    });
    try {
      const result = await Promise.race([p, timeoutPromise]);
      return result as T;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  return (
    <IonItem>
      <IonLabel>
        <h3>Notificacions</h3>
        <p>Activa o desactiva les notificacions push</p>
      </IonLabel>
      <IonToggle
        checked={notifEnabled}
        disabled={isToggling}
        onIonChange={async (e) => {
          const enabled = e.detail.checked;
          setNotifEnabled(enabled);
          setIsToggling(true);
          try {
            if (!user) throw new Error("Usuari no autenticat");

            // Runtime checks
            const env = (import.meta.env || {}) as Record<string, unknown>;
            const projectId = env.VITE_FIREBASE_PROJECT_ID as
              | string
              | undefined;
            if (!projectId) {
              window.dispatchEvent(
                new CustomEvent("show-toast", {
                  detail: {
                    message:
                      "Falta configuració de Firebase (VITE_FIREBASE_PROJECT_ID). Revisa .env",
                    color: "danger",
                    duration: 8000,
                  },
                })
              );
              throw new Error("Missing Firebase projectId");
            }
            if (!("serviceWorker" in navigator)) {
              window.dispatchEvent(
                new CustomEvent("show-toast", {
                  detail: {
                    message:
                      "Service Workers no són compatibles en aquest navegador. No es poden obtenir notificacions push.",
                    color: "danger",
                    duration: 8000,
                  },
                })
              );
              throw new Error("ServiceWorker not supported");
            }

            if (enabled) {
              const token = await withTimeout(
                notificationService.requestAndSavePushToken(user.uid),
                20000,
                "FCM token request"
              );
              if (token) {
                await firestoreService.updateUserProfile(user.uid, {
                  pushToken: token,
                });
              } else {
                throw new Error("No s'ha obtingut token de notificacions");
              }
            } else {
              await firestoreService.updateUserProfile(user.uid, {
                pushToken: "",
              });
            }

            window.dispatchEvent(
              new CustomEvent("show-toast", {
                detail: {
                  message: enabled
                    ? "Notificacions activades"
                    : "Notificacions desactivades",
                  color: "success",
                  duration: 3000,
                },
              })
            );
          } catch (errUnknown) {
            setNotifEnabled(!enabled);
            const e = errUnknown as unknown;
            let errMsg = "Error desconegut";
            if (typeof e === "string") errMsg = e;
            else if (
              typeof e === "object" &&
              e !== null &&
              "message" in e &&
              typeof (e as { message?: unknown }).message === "string"
            )
              errMsg = (e as { message?: string }).message || errMsg;

            window.dispatchEvent(
              new CustomEvent("show-toast", {
                detail: {
                  message: "Error actualitzant preferències: " + errMsg,
                  color: "danger",
                  duration: 5000,
                },
              })
            );
          } finally {
            setIsToggling(false);
          }
        }}
      />
    </IonItem>
  );
};

export default NotificationToggle;
