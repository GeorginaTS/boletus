import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuració de Firebase utilitzant variables d'entorn
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicialitza Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// Inicialitza Firebase Authentication i exporta per usar
export const auth = getAuth(app);
// Inicialitza Firestore i exporta per usar
export const db = getFirestore(app);
// Inicialitza Firebase Storage i exporta per usar
export const storage = getStorage(app);
export default app;
