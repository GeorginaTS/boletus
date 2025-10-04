import { useCallback, useEffect, useState } from "react";
import {
  NotificationPayload,
  notificationService,
  NotificationSettings,
} from "../services/notificationService";

export interface UseNotificationsReturn {
  // Status
  isInitialized: boolean;
  hasPermission: boolean;
  loading: boolean;
  error: string | null;

  // Settings
  settings: NotificationSettings | null;

  // Actions
  initialize: (userId: string) => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  sendTestNotification: () => Promise<void>;
  cleanup: () => void;

  // Status info
  getStatus: () => {
    isInitialized: boolean;
    hasPermission: boolean;
    userId: string | null;
    platform: string;
  };
}

/**
 * Hook personalitzat per gestionar push notifications
 * Proporciona una interfície React per al notificationService
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  /**
   * Inicialitza el service de notificacions per a un usuari
   */
  const initialize = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      await notificationService.initialize(userId);

      // Actualitza l'estat
      const status = notificationService.getStatus();
      setIsInitialized(status.isInitialized);
      setHasPermission(status.hasPermission);

      // Carrega les configuracions
      const userSettings = await notificationService.getNotificationSettings();
      setSettings(userSettings);

      console.log("✅ useNotifications: Service initialized successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error initializing notifications";
      setError(errorMessage);
      console.error("❌ useNotifications: Initialization error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualitza les configuracions de notificacions
   */
  const updateSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      setLoading(true);
      setError(null);

      try {
        await notificationService.updateNotificationSettings(newSettings);

        // Recarrega les configuracions
        const updatedSettings =
          await notificationService.getNotificationSettings();
        setSettings(updatedSettings);

        console.log("✅ useNotifications: Settings updated successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error updating settings";
        setError(errorMessage);
        console.error("❌ useNotifications: Settings update error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Envia una notificació de prova
   */
  const sendTestNotification = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const testNotification: NotificationPayload = {
        title: "🍄 Mushroom Finder",
        body: "Aquesta és una notificació de prova! El sistema funciona correctament.",
        icon: "/favicon.png",
        data: {
          type: "test",
          timestamp: Date.now().toString(),
        },
      };

      await notificationService.sendLocalNotification(testNotification);
      console.log("✅ useNotifications: Test notification sent");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error sending test notification";
      setError(errorMessage);
      console.error("❌ useNotifications: Test notification error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Neteja el service i l'estat
   */
  const cleanup = useCallback(() => {
    notificationService.cleanup();
    setIsInitialized(false);
    setHasPermission(false);
    setSettings(null);
    setError(null);
    console.log("🧹 useNotifications: Cleaned up");
  }, []);

  /**
   * Obté l'estat actual del service
   */
  const getStatus = useCallback(() => {
    return notificationService.getStatus();
  }, []);

  /**
   * Comprova l'estat inicial quan es munta el component
   */
  useEffect(() => {
    const status = notificationService.getStatus();
    setIsInitialized(status.isInitialized);
    setHasPermission(status.hasPermission);

    if (status.isInitialized && status.userId) {
      // Carrega les configuracions si el service ja està inicialitzat
      notificationService
        .getNotificationSettings()
        .then(setSettings)
        .catch((err) => {
          console.error("❌ Error loading notification settings:", err);
          setError("Error loading settings");
        });
    }
  }, []);

  /**
   * Afegeix un listener per a notificacions rebudes
   */
  useEffect(() => {
    const handleNotification = (notification: NotificationPayload) => {
      console.log("📩 useNotifications: Notification received:", notification);

      // Aquí pots afegir lògica addicional per gestionar notificacions
      // Per exemple, mostrar un toast, actualitzar l'estat de l'app, etc.
    };

    // Subscriu al listener
    const unsubscribe =
      notificationService.addNotificationListener(handleNotification);

    // Neteja el listener quan es desmunta el component
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Neteja quan es desmunta el component
   */
  useEffect(() => {
    return () => {
      // No cridem cleanup automàticament perquè el service pot ser utilitzat per altres components
      // L'usuari ha de cridar cleanup manualment quan sigui necessari
    };
  }, []);

  return {
    // Status
    isInitialized,
    hasPermission,
    loading,
    error,

    // Settings
    settings,

    // Actions
    initialize,
    updateSettings,
    sendTestNotification,
    cleanup,
    getStatus,
  };
};

export default useNotifications;
