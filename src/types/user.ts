export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  lastLocationUpdate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  pushToken?: string;
}

export interface CreateUserProfileData {
  displayName: string;
  email: string;
  city?: string;
  country?: string;
  photoURL?: string;
  pushToken?: string;
}

export interface UpdateUserProfileData {
  displayName?: string;
  city?: string;
  country?: string;
  photoURL?: string;
  pushToken?: string;
}
