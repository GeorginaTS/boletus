import { Capacitor } from "@capacitor/core";
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from "@capacitor/push-notifications";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  getMessaging,
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
} from "firebase/messaging";
import app, { db } from "../config/firebase";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string | number | boolean>;
  icon?: string;
  badge?: number;
  sound?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  newLocations: boolean;
  nearbyDiscoveries: boolean;
  mushroomSeason: boolean;
  weatherAlerts: boolean;
}

export interface UserNotificationData {
  fcmToken?: string;
  settings: NotificationSettings;
  lastTokenUpdate: Date;
  deviceType: "web" | "ios" | "android";
}

class NotificationService {
  private messaging: Messaging | null = null;
  private currentUserId: string | null = null;
  private isInitialized = false;
  private notificationListeners: ((
    notification: NotificationPayload
  ) => void)[] = [];

  constructor() {
    if (Capacitor.isNativePlatform()) {
      this.initializeNativeNotifications();
    } else {
      this.initializeWebNotifications();
    }
  }

  /**
   * Initialize the notification service for a specific user
   */
  async initialize(userId: string): Promise<void> {
    this.currentUserId = userId;

    try {
      if (Capacitor.isNativePlatform()) {
        await this.setupNativeNotifications();
      } else {
        await this.setupWebNotifications();
      }

      this.isInitialized = true;
      console.log("✅ Notification service initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing notification service:", error);
      throw error;
    }
  }

  /**
   * Initialize native notifications (iOS/Android)
   */
  private async initializeNativeNotifications(): Promise<void> {
    // Request permission
    await PushNotifications.requestPermissions();

    // Register for push notifications
    await PushNotifications.register();

    // Listen for registration
    PushNotifications.addListener("registration", async (token: Token) => {
      console.log("📱 Push registration success, token: ", token.value);
      if (this.currentUserId) {
        await this.saveNotificationToken(token.value, "native");
      }
    });

    // Listen for registration errors
    PushNotifications.addListener("registrationError", (error: unknown) => {
      console.error("❌ Error on registration: ", error);
    });

    // Listen for push notifications
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        console.log("📩 Push received: ", notification);
        this.handleNotificationReceived({
          title: notification.title || "",
          body: notification.body || "",
          data: notification.data,
        });
      }
    );

    // Listen for notification actions
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        console.log("🔔 Push action performed: ", notification);
        this.handleNotificationAction(notification);
      }
    );
  }

  /**
   * Initialize web notifications (PWA)
   */
  private async initializeWebNotifications(): Promise<void> {
    if (!("serviceWorker" in navigator)) {
      console.warn("⚠️ Service Worker not supported");
      return;
    }

    // Initialize Firebase Messaging
    this.messaging = getMessaging(app);

    // Listen for foreground messages
    onMessage(this.messaging, (payload: MessagePayload) => {
      console.log("📩 Foreground message received: ", payload);
      this.handleNotificationReceived({
        title: payload.notification?.title || "",
        body: payload.notification?.body || "",
        data: payload.data,
        icon: payload.notification?.icon,
      });
    });
  }

  /**
   * Setup native notifications after user login
   */
  private async setupNativeNotifications(): Promise<void> {
    const permissionStatus = await PushNotifications.checkPermissions();

    if (permissionStatus.receive === "granted") {
      await PushNotifications.register();
    } else {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === "granted") {
        await PushNotifications.register();
      } else {
        console.warn("⚠️ Push notification permission denied");
      }
    }
  }

  /**
   * Setup web notifications after user login
   */
  private async setupWebNotifications(): Promise<void> {
    if (!this.messaging) return;

    try {
      // Request permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // Get FCM token
        const token = await getToken(this.messaging, {
          vapidKey: process.env.VITE_FIREBASE_VAPID_KEY,
        });

        console.log("🌐 FCM Token: ", token);
        await this.saveNotificationToken(token, "web");
      } else {
        console.warn("⚠️ Notification permission denied");
      }
    } catch (error) {
      console.error("❌ Error getting FCM token:", error);
      throw error;
    }
  }

  /**
   * Save notification token to Firestore
   */
  private async saveNotificationToken(
    token: string,
    deviceType: "web" | "native"
  ): Promise<void> {
    if (!this.currentUserId) return;

    try {
      const userNotificationRef = doc(
        db,
        "userNotifications",
        this.currentUserId
      );
      const existingDoc = await getDoc(userNotificationRef);

      const deviceTypeMap: { [key: string]: "web" | "ios" | "android" } = {
        web: "web",
        native: Capacitor.getPlatform() === "ios" ? "ios" : "android",
      };

      const notificationData: UserNotificationData = {
        fcmToken: token,
        settings: existingDoc.exists()
          ? existingDoc.data().settings
          : this.getDefaultSettings(),
        lastTokenUpdate: new Date(),
        deviceType: deviceTypeMap[deviceType],
      };

      await setDoc(userNotificationRef, notificationData, { merge: true });
      console.log("✅ Notification token saved successfully");
    } catch (error) {
      console.error("❌ Error saving notification token:", error);
      throw error;
    }
  }

  /**
   * Get default notification settings
   */
  private getDefaultSettings(): NotificationSettings {
    return {
      enabled: true,
      newLocations: true,
      nearbyDiscoveries: true,
      mushroomSeason: false,
      weatherAlerts: false,
    };
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<void> {
    if (!this.currentUserId) {
      throw new Error("User not authenticated");
    }

    try {
      const userNotificationRef = doc(
        db,
        "userNotifications",
        this.currentUserId
      );
      await updateDoc(userNotificationRef, {
        settings: { ...(await this.getNotificationSettings()), ...settings },
      });
      console.log("✅ Notification settings updated");
    } catch (error) {
      console.error("❌ Error updating notification settings:", error);
      throw error;
    }
  }

  /**
   * Get current notification settings
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    if (!this.currentUserId) {
      return this.getDefaultSettings();
    }

    try {
      const userNotificationRef = doc(
        db,
        "userNotifications",
        this.currentUserId
      );
      const docSnap = await getDoc(userNotificationRef);

      if (docSnap.exists()) {
        return docSnap.data().settings || this.getDefaultSettings();
      } else {
        return this.getDefaultSettings();
      }
    } catch (error) {
      console.error("❌ Error getting notification settings:", error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Send a local notification (for testing or immediate feedback)
   */
  async sendLocalNotification(
    notification: NotificationPayload
  ): Promise<void> {
    if (!this.isNotificationPermissionGranted()) {
      console.warn("⚠️ Notification permission not granted");
      return;
    }

    if (Capacitor.isNativePlatform()) {
      // For native platforms, we would typically use Local Notifications plugin
      console.log("📱 Would send native local notification:", notification);
    } else {
      // For web, use Web Notifications API
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || "/favicon.png",
          badge: notification.badge?.toString(),
          data: notification.data,
        });
      }
    }
  }

  /**
   * Check if notification permission is granted
   */
  private isNotificationPermissionGranted(): boolean {
    if (Capacitor.isNativePlatform()) {
      // For native, we'll assume permission is granted if service is initialized
      return this.isInitialized;
    } else {
      return Notification.permission === "granted";
    }
  }

  /**
   * Handle received notifications
   */
  private handleNotificationReceived(notification: NotificationPayload): void {
    console.log("📩 Notification received:", notification);

    // Notify all listeners
    this.notificationListeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error("❌ Error in notification listener:", error);
      }
    });

    // Show local notification if app is in foreground
    if (document.visibilityState === "visible") {
      this.sendLocalNotification(notification);
    }
  }

  /**
   * Handle notification actions (when user taps notification)
   */
  private handleNotificationAction(actionPerformed: ActionPerformed): void {
    const { notification, actionId } = actionPerformed;
    console.log("🔔 Notification action:", actionId, notification);

    // Handle different action types
    switch (actionId) {
      case "tap":
        // Default tap action - open app
        break;
      case "view_location":
        // Navigate to specific location
        if (notification.data?.locationId) {
          // You can emit a custom event or use a router here
          window.dispatchEvent(
            new CustomEvent("navigateToLocation", {
              detail: { locationId: notification.data.locationId },
            })
          );
        }
        break;
      default:
        console.log("Unknown notification action:", actionId);
    }
  }

  /**
   * Add notification listener
   */
  addNotificationListener(
    listener: (notification: NotificationPayload) => void
  ): () => void {
    this.notificationListeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.notificationListeners.indexOf(listener);
      if (index > -1) {
        this.notificationListeners.splice(index, 1);
      }
    };
  }

  /**
   * Remove all listeners and cleanup
   */
  cleanup(): void {
    this.notificationListeners = [];
    this.currentUserId = null;
    this.isInitialized = false;
    console.log("🧹 Notification service cleaned up");
  }

  /**
   * Get notification status
   */
  getStatus(): {
    isInitialized: boolean;
    hasPermission: boolean;
    userId: string | null;
    platform: string;
  } {
    return {
      isInitialized: this.isInitialized,
      hasPermission: this.isNotificationPermissionGranted(),
      userId: this.currentUserId,
      platform: Capacitor.getPlatform(),
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
