import { AuthProvider } from '@/contexts/AuthContext';
import { AppRoutes, AppTabBar } from '@/routes/routes';
import AuthGuard from '@components/AuthGuard';
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Suspense } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <AuthGuard>
          <IonTabs>
            <IonRouterOutlet>
              <Suspense fallback={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <IonSpinner name="circular" />
                </div>
              }>
                <AppRoutes />
              </Suspense>
            </IonRouterOutlet>
            <AppTabBar />
          </IonTabs>
        </AuthGuard>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
