import {
  CreateUserProfileData,
  UpdateUserProfileData,
  UserProfile,
} from "@/types/user";
import authService from "@services/authService";
import firestoreService from "@services/firestoreService";
import { notificationService } from "@services/notificationService";
import { User } from "firebase/auth";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUserProfile: (userData: CreateUserProfileData) => Promise<void>;
  updateUserProfile: (userData: UpdateUserProfileData) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscriure's als canvis d'estat d'autenticació
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await authService.login(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await authService.register(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUserProfile(null); // Netejar perfil d'usuari

      // Netejar service de notificacions
      notificationService.cleanup();
      console.log("✨ Notifications cleaned up on logout");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Funcions per gestionar el perfil d'usuari
  const createUserProfile = async (
    userData: CreateUserProfileData
  ): Promise<void> => {
    if (!user) throw new Error("No hi ha usuari autenticat");

    setLoading(true);
    try {
      const profile = await firestoreService.createUserProfile(
        user.uid,
        userData
      );
      setUserProfile(profile);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateUserProfile = async (
    userData: UpdateUserProfileData
  ): Promise<void> => {
    if (!user) throw new Error("No hi ha usuari autenticat");

    setLoading(true);
    try {
      await firestoreService.updateUserProfile(user.uid, userData);
      await refreshUserProfile();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const refreshUserProfile = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const profile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error refrescant perfil d'usuari:", error);
      setUserProfile(null);
    }
  }, [user]);

  // Carregar perfil d'usuari quan canvia l'usuari autenticat
  useEffect(() => {
    if (user && !userProfile) {
      refreshUserProfile();
    } else if (!user) {
      setUserProfile(null);
    }
  }, [user, userProfile, refreshUserProfile]);

  // Inicialitzar notificacions quan l'usuari està autenticat
  useEffect(() => {
    if (user && userProfile) {
      // Inicialitzar service de notificacions
      notificationService
        .initialize(user.uid)
        .then(() => {
          console.log("✨ Notifications initialized for user:", user.uid);
        })
        .catch((error) => {
          console.error("❌ Error initializing notifications:", error);
        });
    }
  }, [user, userProfile]);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    createUserProfile,
    updateUserProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
