import { auth, db } from '@/config/firebase';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { bug } from 'ionicons/icons';
import React from 'react';

const FirebaseDebug: React.FC = () => {
  const checkFirebaseConfig = () => {
    console.log('=== FIREBASE DEBUG ===');
    console.log('Auth config:', {
      currentUser: auth.currentUser,
      app: auth.app.name,
      settings: auth.settings
    });
    
    console.log('Firestore config:', {
      app: db.app.name,
      type: db.type
    });
    
    console.log('Environment variables:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
    });
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="card-title">
          <IonIcon icon={bug} />
          Firebase Debug
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <h3>Current User</h3>
              <p>{auth.currentUser?.email || 'No user'}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Project ID</h3>
              <p>{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}</p>
            </IonLabel>
          </IonItem>
        </IonList>
        
        <IonButton expand="block" onClick={checkFirebaseConfig}>
          Check Firebase Config
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default FirebaseDebug;