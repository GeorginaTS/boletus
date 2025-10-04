# 🍄 Mushroom Finder

A modern hybrid mobile application built with Ionic React and TypeScript for mushroom enthusiasts to discover, track, and share mushroom locations with an integrated mapping system and user geolocation features.

## 🌟 Features

- **🗺️ Interactive Mapping**: Full-screen Leaflet maps with user location tracking
- **📍 Geolocation Services**: Real-time GPS coordinates with high accuracy positioning
- **👤 User Profiles**: Complete user management with authentication via Firebase
- **🔐 Authentication**: Secure login and registration system
- **💾 Data Persistence**: Cloud storage with Firestore for user profiles and locations
- **📱 Cross-Platform**: Native mobile experience with web compatibility
- **🎨 Nature-Inspired Theme**: Custom design with forest and earth tones
- **🌓 Dark Mode Support**: Adaptive theming for all lighting conditions

## 🚀 Tech Stack

### Frontend

- **Framework**: [Ionic React](https://ionicframework.com/) v8.5.0
- **Language**: TypeScript
- **Build Tool**: Vite v5.4.20
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.x with custom nature theme
- **Maps**: [Leaflet](https://leafletjs.com/) v1.9.4
- **UI Icons**: Ionicons v7.4.0

### Backend & Cloud

- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Cloud Storage

### Mapping & Location

- **Maps**: Google Maps JavaScript API with optimized async loading
- **Geolocation**: @capacitor/geolocation v7.1.5 with web fallback
- **Location Storage**: Automatic saving to Firebase Firestore

### Mobile Development

- **Hybrid Framework**: [Capacitor](https://capacitorjs.com/) v7.4.3
- **Native Features**: Haptics, Status Bar, Keyboard integration

### Development Tools

- **Testing**: Cypress (E2E), Vitest (Unit), Testing Library
- **Linting**: ESLint with TypeScript support
- **Code Quality**: TypeScript v5.1.6 with strict configuration

## 📁 Project Structure

```text
mushroom-finder/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthGuard.tsx   # Route protection
│   │   ├── MapView.tsx     # Leaflet map component
│   │   └── UserProfileForm.tsx
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication state management
│   ├── hooks/              # Custom React hooks
│   │   ├── useGeolocation.ts    # Geolocation management
│   │   └── useLocationStorage.ts # Location persistence
│   ├── pages/              # Main application screens
│   │   ├── Login.tsx       # Authentication
│   │   ├── Profile.tsx     # User profile management
│   │   ├── Map.tsx         # Full-screen mapping
│   │   └── Tab1.tsx, Tab2.tsx, Tab3.tsx
│   ├── services/           # API and external services
│   │   ├── authService.ts      # Firebase authentication
│   │   ├── firestoreService.ts # Database operations
│   │   └── geolocationService.ts # Location services
│   ├── theme/              # Global styling and theming
│   │   └── variables.css   # CSS custom properties and utilities
│   ├── types/              # TypeScript type definitions
│   │   └── user.ts         # User profile interfaces
│   └── config/             # Configuration files
│       └── firebase.ts     # Firebase initialization
├── public/                 # Static assets
├── cypress/                # E2E testing configuration
├── docs/                   # Project documentation
│   └── copilot-instructions.md # Development guidelines
└── dist/                   # Build output
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- Google Maps API key with Maps JavaScript API enabled
- (Optional) Android Studio or Xcode for native development

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/GeorginaTS/boletus.git
   cd mushroom-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy `.env.example` to `.env` and configure your API keys:
   ```typescript
   # Google Maps API Key (required)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Firebase Configuration (required)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase configs
   export const db = getFirestore(app);
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

### 🗺️ Google Maps Setup

1. **Get API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
2. **Enable APIs**: Enable "Maps JavaScript API" for your project
3. **Set Restrictions**: Configure API key restrictions for security
4. **Add to Environment**: Set `VITE_GOOGLE_MAPS_API_KEY` in your `.env` file

> **Note**: This project uses Tailwind CSS v3.4.x with CommonJS configuration files (`tailwind.config.cjs` and `postcss.config.cjs`) to ensure compatibility with ES modules.

## 📱 Building for Mobile

### Android Build

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

### iOS Build

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## 🧪 Testing

### Unit Tests

```bash
npm run test.unit
```

### End-to-End Tests

```bash
npm run test.e2e
```

### Linting

```bash
npm run lint
```

## 🎨 Theming & Styling

The application uses a hybrid theming system combining Tailwind CSS with Ionic's design system:

- **Tailwind CSS**: Primary styling framework with custom nature-themed configuration
- **CSS Custom Properties**: Centralized design tokens in `src/theme/variables.css`
- **Custom Components**: Tailwind-based components in `src/styles/tailwind.css`
- **Nature-Inspired Palette**: Forest greens, earth browns, and mushroom tones
- **Responsive Design**: Mobile-first approach using Tailwind's responsive utilities
- **Dark Mode**: Automatic theme switching with both Tailwind and Ionic support

### Key Style Classes

#### Tailwind Custom Components

- `.btn-forest`, `.btn-earth`, `.btn-mushroom` - Nature-themed buttons
- `.card-nature`, `.data-card` - Custom card components
- `.input-nature` - Form inputs with nature theme
- `.data-value-highlight`, `.location-marker` - Data display utilities

#### Tailwind Utilities (Primary)

- `bg-primary-500`, `text-primary-600` - Custom color palette
- `bg-forest`, `text-earth`, `bg-mushroom` - Theme-specific colors
- `flex`, `grid`, `p-4`, `rounded-lg` - Layout and spacing
- `sm:`, `md:`, `lg:` - Responsive design utilities

#### Ionic Classes (Secondary)

- `.container`, `.container-sm`, `.container-lg` - Layout containers
- `.btn-primary`, `.btn-secondary`, `.btn-danger` - Ionic button variants
- `.data-display`, `.data-value`, `.data-timestamp` - Data presentation
- `.location-card`, `.nature-card` - Specialized card components

## 🗺️ Geolocation Features

### Core Functionality

- **High-Accuracy Positioning**: Enhanced GPS precision for outdoor use
- **Web Compatibility**: Fallback support for browser-based geolocation
- **Automatic Storage**: Real-time location persistence to user profiles
- **Visual Feedback**: Interactive maps with accuracy circles and markers

### Location Services Architecture

```typescript
// Geolocation Hook Usage
const { location, loading, error, getCurrentLocation } = useGeolocation(true);

// Manual location refresh
const handleLocationUpdate = useCallback(() => {
  getCurrentLocation();
}, [getCurrentLocation]);
```

## 🔐 Authentication & User Management

### Features

- Email/password authentication via Firebase Auth
- User profile creation and management
- Protected routes with AuthGuard component
- Persistent session management
- Profile data synchronization with Firestore

### User Profile Schema

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

## 📊 Database Structure

### Firestore Collections

- **users**: User profiles with location data
- **locations**: Mushroom finding spots (future feature)
- **findings**: User mushroom discoveries (future feature)

## 🚀 Deployment

### Web Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### PWA Features

- Service worker support
- Offline capability
- App manifest for home screen installation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding guidelines in `docs/copilot-instructions.md`
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Use global CSS classes from `variables.css` before creating component-specific styles
- Follow TypeScript strict typing conventions
- Write unit tests for new functionality
- Maintain the nature-inspired design theme

## 🐛 Known Issues

- Location services require HTTPS in production for web deployment
- iOS requires location permissions configuration in Info.plist
- Some older Android devices may have reduced GPS accuracy

## 🔮 Roadmap

- [ ] Mushroom species database integration
- [ ] Photo upload for mushroom findings
- [ ] Social features for sharing discoveries
- [ ] Offline map caching
- [ ] Weather integration for optimal foraging conditions
- [ ] Advanced filtering and search capabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ionic Framework](https://ionicframework.com/) for the excellent hybrid development platform
- [Firebase](https://firebase.google.com/) for backend services
- [Leaflet](https://leafletjs.com/) for beautiful interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- Nature photographers for inspiring the visual design

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `docs/` folder

---

Happy Mushroom Hunting! 🍄🌲
