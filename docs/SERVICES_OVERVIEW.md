# SERVICES OVERVIEW

## Introduction
Aquest document descriu els diferents serveis (`services`) creats al projecte, la seva funcionalitat principal i exemples d'ús.

---


## 1. AuthService
- **Fitxer:** `src/services/authService.ts`
- **Funcionalitats:**
  - Login amb email i contrasenya.
  - Login amb Google (OAuth).
  - Registre de nous usuaris.
  - Logout i gestió de la sessió.
  - Observador de l'estat d'autenticació (callback automàtic quan l'usuari entra/surt).
  - Obtenir l'usuari actual autenticat.
  - Integració amb notificacions push: sol·licita permís i guarda el token push quan l'usuari inicia sessió.
- **Exemple d'ús:**
  ```ts
  import { authService } from '@services/authService';
  await authService.login(email, password);
  authService.onAuthStateChange((user) => { /* ... */ });
  ```

---


## 2. FirestoreService
- **Fitxer:** `src/services/firestoreService.ts`
- **Funcionalitats:**
  - Crear, llegir, actualitzar i eliminar perfils d'usuari.
  - Gestió de la col·lecció d'ubicacions (afegir, modificar, eliminar, consultar ubicacions).
  - Consultes avançades amb filtres (per usuari, per data, per tipus de localització).
  - Gestió de timestamps, actualització en temps real i sincronització amb la base de dades.
- **Exemple d'ús:**
  ```ts
  import { firestoreService } from '@services/firestoreService';
  await firestoreService.createUserProfile(uid, data);
  const locations = await firestoreService.getUserLocations(uid);
  ```

---


## 3. GeocodingService
- **Fitxer:** `src/services/geocodingService.ts`
- **Funcionalitats:**
  - Geocodificació inversa: converteix coordenades (lat, lng) en adreça llegible (ciutat, província, país).
  - Consulta a Google Geocoding API amb gestió d'errors i validació de la API key.
  - Extracció de components d'adreça i formatació per mostrar a la interfície.
- **Exemple d'ús:**
  ```ts
  import { geocodingService } from '@services/geocodingService';
  const info = await geocodingService.getLocationInfo(lat, lng);
  // info.formattedAddress, info.city, info.country...
  ```

---


## 4. GeolocationService
- **Fitxer:** `src/services/geolocationService.ts`
- **Funcionalitats:**
  - Comprova i sol·licita permisos de geolocalització (Android/iOS/Web).
  - Obté la posició actual de l'usuari (latitud, longitud, precisió, timestamp).
  - Actualització en temps real de la posició si l'usuari es mou.
  - Gestió d'errors i missatges de permís denegat.
  - Conversió de dades de geolocalització per altres serveis (mapa, notificacions de proximitat).
- **Exemple d'ús:**
  ```ts
  import { geolocationService } from '@services/geolocationService';
  const position = await geolocationService.getCurrentPosition();
  const permissions = await geolocationService.checkPermissions();
  ```

---


## 5. GoogleMapsService
- **Fitxer:** `src/services/googleMapsService.ts`
- **Funcionalitats:**
  - Inicialització i configuració de Google Maps amb mapId personalitzat.
  - Gestió de marcadors avançats (`AdvancedMarkerElement`) i controls de mapa.
  - Optimització de càrrega: script únic, loading asíncron, callbacks dinàmics.
  - Integració amb ubicacions i perfils d'usuari (mostrar localitzacions al mapa).
  - Gestió d'esdeveniments i interacció amb la interfície (clics, zoom, tipus de mapa).
- **Exemple d'ús:**
  ```ts
  import { googleMapsService } from '@services/googleMapsService';
  googleMapsService.initMap(elementId, config);
  googleMapsService.addMarker(location);
  ```

---


## 6. NotificationService
- **Fitxer:** `src/services/notificationService.ts`
- **Funcionalitats:**
  - Sol·licitud i gestió de permisos de notificacions push (Android/iOS/Web).
  - Obtenció i registre del token FCM per cada usuari.
  - Configuració personalitzada de notificacions (nous llocs, alertes meteorològiques, temporada de bolets, etc.).
  - Gestió de missatges en primer pla i accions de notificació.
  - Sincronització amb Firestore per guardar preferències i tokens.
- **Exemple d'ús:**
  ```ts
  import { notificationService } from '@services/notificationService';
  await notificationService.requestAndSavePushToken(uid);
  notificationService.subscribeToTopic('weatherAlerts');
  ```

---


## 7. PhotoService
- **Fitxer:** `src/services/photoService.ts`
- **Funcionalitats:**
  - Redimensionament d'imatges abans de pujar-les (mantenint aspect ratio i qualitat).
  - Pujada d'imatges a Firebase Storage.
  - Obtenció de l'URL de descàrrega per mostrar la foto a l'app.
  - Gestió d'errors i validació de formats d'imatge.
- **Exemple d'ús:**
  ```ts
  import { photoService } from '@services/photoService';
  const result = await photoService.uploadPhoto(file);
  const url = await photoService.getPhotoUrl(result.fileName);
  ```

---


## 8. WeatherService
- **Fitxer:** `src/services/weatherService.ts`
- **Funcionalitats:**
  - Obtenció de dades meteorològiques actuals per coordenades (temperatura, humitat, condicions, etc.).
  - Consulta a OpenWeather API amb gestió de la API key i errors.
  - Formatació de dades per mostrar-les a la interfície (icones, text, unitats).
  - Possibilitat d'ampliar amb prediccions o alertes meteorològiques.
- **Exemple d'ús:**
  ```ts
  import { weatherService } from '@services/weatherService';
  const weather = await weatherService.getCurrentWeather(lat, lng);
  // weather.temperature, weather.icon, weather.description...
  ```

---

**Last updated:** October 25, 2025
