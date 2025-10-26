# Mushroom Finder: AI Coding Agent Instructions

## Project Overview

**Type:** Hybrid PWA & Mobile App (Ionic React + Vite + Capacitor)
**Purpose:** Discover, save, and share mushroom locations with map, photos, weather, and authentication.
**Major Integrations:** Firebase (Firestore, Auth, Storage, Hosting), Google Maps API, OpenWeather API, Capacitor Camera.
**PWA Features:** Offline support, installable, service worker, manifest, native-like experience.
**Notifications:** Proximity notifications when user is near a saved location (see NotificationSettings/NotificationToggle components).

## Architecture & Key Patterns

**Component Structure:**

- UI in `src/components/` (e.g., `MapView.tsx`, `PhotoManager.tsx`, `WeatherInfo.tsx`, `NotificationSettings.tsx`).
- Screens in `src/pages/` (lazy loaded via React.lazy).
- Routing in `src/routes/routes.tsx`.
- Contexts for global state in `src/contexts/` (Auth, Theme).
- Services in `src/services/` (API, Firebase, Maps, Weather, Photos).
- Types in `src/types/` (location, weather, user).
  **Data Flow:**
- User actions trigger service calls (Firestore, Storage, APIs).
- Location and weather data flow from services to components via props/context.
- Photos are uploaded to Firebase Storage under `locations/{locationId}.jpg`.
- Notifications are triggered by proximity logic in the app (see NotificationSettings/NotificationToggle).
  **Theming:**
- Dynamic theme switching via React Context and CSS variables (`src/theme/variables.css`).
- Use global CSS classes before adding component-specific styles.
  **Performance:**
- Code splitting via React.lazy, manual chunking, Terser minification, optimized caching (see Vite and Firebase configs).

## Developer Workflows

**Install:**

- `npm install` (after cloning)
- Copy `.env.example` to `.env` and fill API keys
  **Run Dev Server:** `npm run dev`
  **Build:** `npm run build` (web), `ionic build --prod` (production)
  **Mobile:**
- Android: `npx cap add android; npx cap sync android; npx cap open android`
- iOS: `npx cap add ios; npx cap sync ios; npx cap open ios`
  **Test:**
- Unit: `npm run test.unit` (Vitest)
- E2E: `npm run test.e2e` (Cypress)
  **Lint:** `npm run lint`
  **Deploy:** `firebase deploy --only hosting`
  **Release (Android):** `./build-release.ps1` (Windows), `./build-release.sh` (Linux/Mac)
  **Debug:** Use `FirebaseDebug.tsx` for inspecting Firebase state and Firestore.
  **Build Output:** See `dist/assets/` for chunked JS files (React, Firebase, vendor, pages, services, components).

## Conventions & Patterns

**TypeScript Strict:** All code is strictly typed; interfaces in `src/types/`.
**Global CSS First:** Use shared classes from `src/styles/globals.css` and `src/theme/variables.css`.
**Minimal Component CSS:** Only add unique styles per component.
**Dark Theme:** Use `.dark-theme` class, not media queries.
**Service Boundaries:** All external API logic in `src/services/`.
**Photo Management:** Use Capacitor Camera API and Firebase Storage; see `PhotoManager.tsx` and `photoService.ts`.
**Geolocation:** Use custom hook `useGeolocation.ts` for high-accuracy location.
**Authentication:** Use `AuthContext.tsx` and `authService.ts` for user/session management.
**Notifications:** Use NotificationSettings and NotificationToggle components for proximity alerts.
**Firestore:** Use strict schema for `users` and `locations` collections (see Example Patterns).
**Weather Scoring:** See `weatherService.ts` for mushroom condition scoring algorithm.

## Integration Points

**Firebase:**

- Config in `src/config/firebase.ts`, rules in `firestore.rules`, `storage.rules`.
- Hosting config in `firebase.json`.
- Firestore: `users` and `locations` collections, strict access rules.
- Storage: Photos under `locations/{locationId}.jpg`.
  **Google Maps:**
- API key in `.env`, logic in `googleMapsService.ts` and `MapView.tsx`.
- Advanced markers, auto-fit bounds, terrain toggle.
  **OpenWeather:**
- API key in `.env`, logic in `weatherService.ts`.
- Mushroom condition scoring, Catalan language, metric units.
  **Capacitor:**
- Native features (camera, haptics) via Capacitor plugins.
- Camera integration for photo capture and upload.
  **Notifications:**
- Proximity logic, local notifications, user settings.
  **PWA:**
- Service worker, manifest, offline support, installable.

## Testing & Debugging

**Unit tests:** In `src/` and `src/components/__tests__/`. Use [Vitest](https://vitest.dev/) for all unit tests. For mocking, use `vi.fn()` and `vi.spyOn()` from Vitest (not Jest). Example:

```typescript
import { vi } from 'vitest';
vi.fn();
vi.spyOn(obj, 'method').mockReturnValue(...);
```

**E2E tests:** In `cypress/e2e/`.
**Debug Console:** Use `FirebaseDebug.tsx` for inspecting Firebase state.
**Known Issues:** Location services require HTTPS in production; iOS needs Info.plist config; older Android devices may have reduced GPS accuracy.

## Example Patterns

**Location Data:**

```typescript
interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

**User Profile:**

```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  lastLocationUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Photo Upload:**

```typescript
// Photo upload with location-based naming
await uploadPhotoForLocation(locationId, photoDataUrl);
// Photo retrieval for display
const photoUrl = await getPhotoUrl(locationId);
```

**Weather Scoring:**

```typescript
// See weatherService.ts for scoring algorithm
// Humidity, temperature, precipitation, cloud coverage
// Score 60+ = Good conditions
```

**Notification Trigger:**

```typescript
// Proximity notification logic
if (distanceToLocation < 100) {
  showLocalNotification(location.name);
}
```

## References

See `README.md` for full setup, build, and deployment details.
See `docs/` for advanced guides (Google Play, geolocation, notifications, etc).

---

**Feedback:** Please review and suggest improvements for any unclear or missing sections. If you need more details on notifications, PWA, build output, or integration, ask for clarification.
