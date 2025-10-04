/**
 * Interface per representar una localització amb informació geoespacial
 * i metadades de gestió temporal
 */
export interface Location {
  /** ID únic de la localització (generat per Firestore) */
  id?: string;

  /** Nom identificatiu de la localització */
  name: string;

  /** Descripció detallada de la localització */
  description: string;

  /** Latitud de la coordenada geogràfica */
  lat: number;

  /** Longitud de la coordenada geogràfica */
  lng: number;

  /** Data de creació del registre de localització */
  createdAt: Date;

  /** Data de la darrera actualització del registre */
  updatedAt: Date;
}

/**
 * Type per crear una nova localització (sense les dates que s'assignen automàticament)
 */
export type CreateLocation = Omit<Location, "createdAt" | "updatedAt">;

/**
 * Type per actualitzar una localització (tots els camps opcionals excepte les dates)
 */
export type UpdateLocation = Partial<
  Omit<Location, "createdAt" | "updatedAt">
> & {
  updatedAt: Date;
};
