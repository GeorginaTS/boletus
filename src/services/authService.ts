import { auth } from "@/config/firebase";
import {
  AuthError,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { notificationService } from "./notificationService";

export interface AuthService {
  // Mètodes d'autenticació
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;

  // Observador de l'estat d'autenticació
  onAuthStateChange: (callback: (user: User | null) => void) => () => void;

  // Obtenir l'usuari actual
  getCurrentUser: () => User | null;
}

class FirebaseAuthService implements AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Demana permís i guarda el token push si l'usuari accepta
      if (user?.uid) {
        await notificationService.requestAndSavePushToken(user.uid);
      }
      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      if (user?.uid) {
        await notificationService.requestAndSavePushToken(user.uid);
      }
      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user?.uid) {
        await notificationService.requestAndSavePushToken(user.uid);
      }
      return user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No existeix cap usuari amb aquest email";
      case "auth/wrong-password":
        return "Contrasenya incorrecta";
      case "auth/email-already-in-use":
        return "Aquest email ja està registrat";
      case "auth/weak-password":
        return "La contrasenya és massa feble";
      case "auth/invalid-email":
        return "Email invàlid";
      case "auth/too-many-requests":
        return "Massa intents fallits. Prova més tard";
      case "auth/popup-closed-by-user":
        return "Finestra d'autenticació tancada";
      case "auth/popup-blocked":
        return "Finestra d'autenticació bloquejada pel navegador";
      case "auth/cancelled-popup-request":
        return "Petició d'autenticació cancel·lada";
      case "auth/account-exists-with-different-credential":
        return "Ja existeix un compte amb aquest email amb un mètode diferent";
      default:
        return "Error d'autenticació: " + errorCode;
    }
  }
}

// Instància singleton del servei
export const authService = new FirebaseAuthService();
export default authService;
