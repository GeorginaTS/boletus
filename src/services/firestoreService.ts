import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { CreateLocation, Location, UpdateLocation } from "../types/location";
import {
  CreateUserProfileData,
  UpdateUserProfileData,
  UserProfile,
} from "../types/user";

const USERS_COLLECTION = "users";
const LOCATIONS_COLLECTION = "locations";

export interface FirestoreService {
  // Crear perfil d'usuari
  createUserProfile: (
    uid: string,
    userData: CreateUserProfileData
  ) => Promise<UserProfile>;

  // Obtenir perfil d'usuari
  getUserProfile: (uid: string) => Promise<UserProfile | null>;

  // Actualitzar perfil d'usuari
  updateUserProfile: (
    uid: string,
    userData: UpdateUserProfileData
  ) => Promise<void>;

  // Verificar si existeix el perfil
  userProfileExists: (uid: string) => Promise<boolean>;

  // Buscar usuari per email
  getUserByEmail: (email: string) => Promise<UserProfile | null>;

  // Àlies per getUserProfile (per claredat)
  getUserById: (id: string) => Promise<UserProfile | null>;

  // Actualitzar ubicació de l'usuari
  updateUserLocation: (
    uid: string,
    latitude: number,
    longitude: number
  ) => Promise<void>;

  // === OPERACIONS DE LOCALITZACIONS ===

  // Crear nova localització
  createLocation: (locationData: CreateLocation) => Promise<Location>;

  // Obtenir localització per ID
  getLocation: (id: string) => Promise<Location | null>;

  // Obtenir totes les localitzacions
  getAllLocations: () => Promise<Location[]>;

  // Obtenir localitzacions d'un usuari específic
  getUserLocations: (userId: string) => Promise<Location[]>;

  // Actualitzar localització
  updateLocation: (id: string, locationData: UpdateLocation) => Promise<void>;

  // Eliminar localització
  deleteLocation: (id: string) => Promise<void>;

  // Obtenir localitzacions properes a una ubicació
  getNearbyLocations: (
    lat: number,
    lng: number,
    radiusKm?: number
  ) => Promise<Location[]>;
}

class FirestoreUserService implements FirestoreService {
  async createUserProfile(
    uid: string,
    userData: CreateUserProfileData
  ): Promise<UserProfile> {
    // Validació de dades
    if (!uid || !userData.email || !userData.displayName) {
      throw new Error("UID, email i displayName són obligatoris");
    }

    try {
      console.log("Creant perfil per UID:", uid, "amb dades:", userData);
      const userRef = doc(db, USERS_COLLECTION, uid);

      const userProfile: Omit<UserProfile, "uid"> = {
        ...userData,
        createdAt: serverTimestamp() as unknown as Date,
        updatedAt: serverTimestamp() as unknown as Date,
      };

      await setDoc(userRef, userProfile);

      // Retornar el perfil creat amb l'uid
      return {
        uid,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error creant perfil d'usuari:", {
        error,
        code: firestoreError?.code,
        message: firestoreError?.message,
        uid,
        userData,
      });

      // Errors específics de Firestore
      if (firestoreError?.code === "permission-denied") {
        throw new Error(
          "No tens permisos per crear el perfil. Comprova les regles de Firestore."
        );
      } else if (firestoreError?.code === "unauthenticated") {
        throw new Error("Has d'estar autenticat per crear un perfil.");
      } else if (firestoreError?.code === "invalid-argument") {
        throw new Error("Dades invàlides per crear el perfil.");
      }

      throw new Error(
        `Error creant perfil: ${firestoreError?.message || "Error desconegut"}`
      );
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          uid,
          ...data,
          // Convertir Timestamps de Firestore a Date
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : data.updatedAt,
          lastLocationUpdate:
            data.lastLocationUpdate instanceof Timestamp
              ? data.lastLocationUpdate.toDate()
              : data.lastLocationUpdate,
        } as UserProfile;
      }

      return null;
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error obtenint perfil d'usuari:", {
        error,
        code: firestoreError?.code,
        message: firestoreError?.message,
        uid,
      });

      if (firestoreError?.code === "permission-denied") {
        throw new Error("No tens permisos per llegir el perfil.");
      }

      throw new Error(
        `Error obtenint perfil: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async updateUserProfile(
    uid: string,
    userData: UpdateUserProfileData
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);

      const updateData = {
        ...userData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error("Error actualitzant perfil d'usuari:", error);
      throw new Error("No s'ha pogut actualitzar el perfil d'usuari");
    }
  }

  async userProfileExists(uid: string): Promise<boolean> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error("Error verificant existència del perfil:", error);
      return false;
    }
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          uid: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : data.updatedAt,
          lastLocationUpdate:
            data.lastLocationUpdate instanceof Timestamp
              ? data.lastLocationUpdate.toDate()
              : data.lastLocationUpdate,
        } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Error buscant usuari per email:", error);
      throw new Error("No s'ha pogut buscar l'usuari");
    }
  }

  // Àlies per getUserProfile (per claredat en el nom)
  async getUserById(id: string): Promise<UserProfile | null> {
    return this.getUserProfile(id);
  }

  // Actualitzar ubicació de l'usuari
  async updateUserLocation(
    uid: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    try {
      console.log(`📍 Actualitzant ubicació de l'usuari ${uid}:`, {
        latitude,
        longitude,
      });

      const userDoc = doc(db, USERS_COLLECTION, uid);

      await updateDoc(userDoc, {
        latitude,
        longitude,
        lastLocationUpdate: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Ubicació actualitzada amb èxit a Firestore");
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("❌ Error actualitzant ubicació de l'usuari:", {
        error,
        code: firestoreError?.code,
        message: firestoreError?.message,
        uid,
        latitude,
        longitude,
      });

      // Errors específics
      if (firestoreError?.code === "permission-denied") {
        throw new Error("No tens permisos per actualitzar la ubicació.");
      } else if (firestoreError?.code === "not-found") {
        throw new Error("El perfil de l'usuari no existeix.");
      } else if (firestoreError?.code === "unauthenticated") {
        throw new Error("Has d'estar autenticat per actualitzar la ubicació.");
      }

      throw new Error(
        `Error actualitzant ubicació: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  // === OPERACIONS DE LOCALITZACIONS ===

  async createLocation(locationData: CreateLocation): Promise<Location> {
    try {
      console.log("Creant nova localització:", locationData);

      const locationsRef = collection(db, LOCATIONS_COLLECTION);

      const newLocation = {
        ...locationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(locationsRef, newLocation);

      // Retornar la localització creada
      return {
        id: docRef.id,
        ...locationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Location;
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error creant localització:", {
        error,
        code: firestoreError?.code,
        message: firestoreError?.message,
        locationData,
      });

      throw new Error(
        `Error creant localització: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async getLocation(id: string): Promise<Location | null> {
    try {
      const locationRef = doc(db, LOCATIONS_COLLECTION, id);
      const locationSnap = await getDoc(locationRef);

      if (locationSnap.exists()) {
        const data = locationSnap.data();
        return {
          id: locationSnap.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : data.updatedAt,
        } as Location;
      }

      return null;
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error obtenint localització:", error);
      throw new Error(
        `Error obtenint localització: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async getAllLocations(): Promise<Location[]> {
    try {
      const locationsRef = collection(db, LOCATIONS_COLLECTION);
      const querySnapshot = await getDocs(locationsRef);

      const locations: Location[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locations.push({
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : data.updatedAt,
        } as Location);
      });

      return locations;
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error obtenint localitzacions:", error);
      throw new Error(
        `Error obtenint localitzacions: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async getUserLocations(userId: string): Promise<Location[]> {
    try {
      const locationsRef = collection(db, LOCATIONS_COLLECTION);
      const q = query(locationsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const locations: Location[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locations.push({
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : data.updatedAt,
        } as Location);
      });

      console.log(
        `Obtingudes ${locations.length} localitzacions per l'usuari ${userId}`
      );
      return locations;
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error obtenint localitzacions de l'usuari:", error);
      throw new Error(
        `Error obtenint localitzacions de l'usuari: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async updateLocation(
    id: string,
    locationData: UpdateLocation
  ): Promise<void> {
    try {
      const locationRef = doc(db, LOCATIONS_COLLECTION, id);

      const updateData = {
        ...locationData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(locationRef, updateData);
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error actualitzant localització:", error);
      throw new Error(
        `Error actualitzant localització: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async deleteLocation(id: string): Promise<void> {
    try {
      const locationRef = doc(db, LOCATIONS_COLLECTION, id);
      await deleteDoc(locationRef);
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error eliminant localització:", error);
      throw new Error(
        `Error eliminant localització: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  async getNearbyLocations(
    lat: number,
    lng: number,
    radiusKm: number = 10
  ): Promise<Location[]> {
    try {
      // Nota: Aquesta és una implementació simple. Per una funcionalitat més avançada
      // es podria utilitzar GeoFirestore o implementar queries geoespacials més complexes
      const allLocations = await this.getAllLocations();

      return allLocations.filter((location) => {
        const distance = this.calculateDistance(
          lat,
          lng,
          location.lat,
          location.lng
        );
        return distance <= radiusKm;
      });
    } catch (error: unknown) {
      const firestoreError = error as { code?: string; message?: string };
      console.error("Error obtenint localitzacions properes:", error);
      throw new Error(
        `Error obtenint localitzacions properes: ${
          firestoreError?.message || "Error desconegut"
        }`
      );
    }
  }

  // Mètodes auxiliars
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Radi de la Terra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "permission-denied":
        return "No tens permisos per accedir a aquestes dades";
      case "unavailable":
        return "Servei no disponible. Torna-ho a provar més tard";
      case "not-found":
        return "Usuari no trobat";
      default:
        return "Error del servei: " + errorCode;
    }
  }
}

// Instància singleton del servei
export const firestoreService = new FirestoreUserService();
export default firestoreService;
