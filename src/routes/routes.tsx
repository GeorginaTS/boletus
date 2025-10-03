import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react';
import { addCircle, map, person } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import AddLocation from '../pages/AddLocation';
import Map from '../pages/Map';
import Profile from '../pages/Profile';

// Configuració de routes
const routesConfig = [
  {
    path: "/map",
    component: Map,
    exact: true,
    label: "Mapa",
    icon: map,
    tabId: "map",
  },
  {
    path: "/add-location",
    component: AddLocation,
    exact: true,
    label: "Afegir lloc",
    icon: addCircle,
    tabId: "add-location",
  },
  {
    path: "/profile",
    component: Profile,
    exact: false,
    label: "Perfil",
    icon: person,
    tabId: "profile",
  },
];

const defaultRoute = "/map";

// Component de routes
export const AppRoutes: React.FC = () => (
  <>
    {routesConfig.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    ))}
    <Route exact path="/">
      <Redirect to={defaultRoute} />
    </Route>
  </>
);

// Component de TabBar
export const AppTabBar: React.FC = () => (
  <IonTabBar slot="bottom">
    {routesConfig.map((route) => (
      <IonTabButton key={route.tabId} tab={route.tabId} href={route.path}>
        <IonIcon aria-hidden="true" icon={route.icon} />
        <IonLabel>{route.label}</IonLabel>
      </IonTabButton>
    ))}
  </IonTabBar>
);