import AppTabBar from "@/components/AppTabBar";
// import DebugConsole from "@/components/DebugConsole";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useProximityNotification } from "@/hooks/useProximityNotification";
import { AppRoutes } from "@/routes/routes";
import AuthGuard from "@components/AuthGuard";
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Suspense, useEffect, useState } from "react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import "@ionic/react/css/palettes/dark.class.css";
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

import { IonToast } from "@ionic/react";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { toast, debugToast } = useProximityNotification(user?.uid || "");
  const [showToast, setShowToast] = useState(false);
  const [showDebugToast, setShowDebugToast] = useState(false);
  useEffect(() => {
    setShowToast(toast.show);
  }, [toast.show]);
  useEffect(() => {
    setShowDebugToast(debugToast.show);
  }, [debugToast.show]);
  return (
    <>
      <IonReactRouter>
        <AuthGuard>
          <IonTabs>
            <IonRouterOutlet>
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    <IonSpinner name="circular" />
                  </div>
                }
              >
                <AppRoutes />
              </Suspense>
            </IonRouterOutlet>
            <AppTabBar />
          </IonTabs>
        </AuthGuard>
      </IonReactRouter>
      <IonToast
        isOpen={showToast}
        message={toast.message}
        duration={toast.message.startsWith("Error") ? 10000 : 3500}
        color={toast.message.startsWith("Error") ? "danger" : "success"}
        onDidDismiss={() => setShowToast(false)}
      />
      <IonToast
        isOpen={showDebugToast}
        message={debugToast.message}
        duration={1500}
        color="primary"
        onDidDismiss={() => setShowDebugToast(false)}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      {/* <DebugConsole /> */}
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </IonApp>
  );
};

export default App;
