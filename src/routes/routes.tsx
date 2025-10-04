import { lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';

// Lazy load components for code splitting
const Map = lazy(() => import('@pages/Map'));
const AddLocation = lazy(() => import('@pages/AddLocation'));
const LocationsList = lazy(() => import('@pages/LocationsList'));
const Profile = lazy(() => import('@pages/Profile'));

// Configuració de routes
const routesConfig = [
  {
    path: "/map",
    component: Map,
    exact: true,
  },
  {
    path: "/add-location",
    component: AddLocation,
    exact: true,
  },
  {
    path: "/locations",
    component: LocationsList,
    exact: true,
  },
  {
    path: "/profile",
    component: Profile,
    exact: false,
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

