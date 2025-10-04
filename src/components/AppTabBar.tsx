import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react';
import { addCircle, list, map, person } from 'ionicons/icons';
import React from 'react';
import './AppTabBar.css';

// Configuració dels tabs del menú
const tabsConfig = [
  {
    path: "/map",
    label: "Mapa",
    icon: map,
    tabId: "map",
  },
  {
    path: "/add-location",
    label: "Afegir lloc",
    icon: addCircle,
    tabId: "add-location",
  },
  {
    path: "/locations",
    label: "Localitzacions",
    icon: list,
    tabId: "locations",
  },
  {
    path: "/profile",
    label: "Perfil",
    icon: person,
    tabId: "profile",
  },
];

const AppTabBar: React.FC = () => (
  <IonTabBar slot="bottom" className="app-tab-bar">
    {tabsConfig.map((tab) => (
      <IonTabButton 
        key={tab.tabId} 
        tab={tab.tabId} 
        href={tab.path}
        className="app-tab-button"
      >
        <IonIcon aria-hidden="true" icon={tab.icon} />
        <IonLabel>{tab.label}</IonLabel>
      </IonTabButton>
    ))}
  </IonTabBar>
);

export default AppTabBar;