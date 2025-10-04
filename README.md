# 🍄 Mushroom Finder

A modern hybrid mobile application built with Ionic React and TypeScript for mushroom enthusiasts to discover, track, and share mushroom locations with an integrated Google Maps system and comprehensive location management.

## 🌟 Features

- **🗺️ Google Maps Integration**: Advanced mapping with Google Maps JavaScript API and custom mushroom markers
- **🍄 Mushroom Location Management**: Complete CRUD system for tracking mushroom spots with detailed information
- **� Interactive Markers**: Click-to-add locations with emoji mushroom markers (🍄) on the map
- **📱 Location List Management**: Comprehensive list view with swipe actions and map navigation
- **🔐 Firebase Authentication**: Secure user authentication and session management
- **💾 Firestore Database**: Real-time cloud storage for locations and user data
- **🚀 Production Ready**: Deployed to Firebase Hosting with optimized build performance
- **⚡ Code Splitting**: Lazy loading and manual chunking for optimal performance
- **📱 Cross-Platform**: Native mobile experience with web compatibility
- **🎨 Modern UI**: Clean Ionic design with intuitive navigation and responsive layout

## 🚀 Tech Stack

### Frontend

- **Framework**: [Ionic React](https://ionicframework.com/) v8.5.0
- **Language**: TypeScript v5.1.6
- **Build Tool**: Vite v5.4.20 with optimized chunking
- **Styling**: Ionic CSS with custom theming
- **Maps**: Google Maps JavaScript API with AdvancedMarkerElement
- **UI Icons**: Ionicons v7.4.0
- **Performance**: Code splitting with React.lazy and Suspense

### Backend & Cloud

- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore) v10.x
- **Authentication**: Firebase Auth v10.x
- **Hosting**: Firebase Hosting with SPA configuration
- **Deployment**: Firebase CLI with automated builds

### Mapping & Location

- **Maps**: Google Maps JavaScript API with custom mushroom markers
- **Advanced Markers**: Modern AdvancedMarkerElement with emoji icons (🍄)
- **Location Services**: Browser geolocation with Firebase persistence
- **Map Interactions**: Click-to-add locations and location-focused navigation

### Performance & Optimization

- **Code Splitting**: Dynamic imports with React.lazy for pages
- **Bundle Optimization**: Manual chunking (React, Firebase, Vendor, Pages)
- **Build Optimization**: Terser minification with console removal
- **Caching**: Optimized Firebase Hosting cache headers

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
│   │   ├── AuthGuard.tsx   # Route protection component
│   │   └── ExploreContainer.tsx # Template component
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx # Authentication state management
│   ├── pages/              # Main application screens (lazy loaded)
│   │   ├── Map.tsx         # Google Maps with mushroom markers
│   │   ├── AddLocation.tsx # Location creation form
│   │   ├── LocationsList.tsx # Location management list
│   │   ├── Profile.tsx     # User profile management
│   │   └── Login.tsx       # Authentication page
│   ├── routes/             # Application routing
│   │   └── routes.tsx      # Lazy-loaded route configuration
│   ├── services/           # API and external services
│   │   ├── firestoreService.ts # Complete Firestore CRUD operations
│   │   ├── googleMapsService.ts # Google Maps integration
│   │   └── authService.ts  # Firebase authentication
│   ├── types/              # TypeScript type definitions
│   │   ├── location.ts     # Location interfaces and types
│   │   └── user.ts         # User profile interfaces
│   ├── theme/              # Global styling and theming
│   │   └── variables.css   # Ionic CSS custom properties
│   └── config/             # Configuration files
│       └── firebase.ts     # Firebase initialization
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   └── favicon.png         # App icon
├── cypress/                # E2E testing configuration
├── firebase.json           # Firebase Hosting configuration
├── .firebaserc            # Firebase project configuration
├── vite.config.ts         # Optimized Vite configuration
└── dist/                  # Optimized build output (chunked)
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

3. **Firebase Configuration**
   Configure Firebase in `src/config/firebase.ts`:

   ```typescript
   // Firebase Configuration (required)
   const firebaseConfig = {
     apiKey: "your_firebase_api_key",
     authDomain: "your_project.firebaseapp.com",
     projectId: "your_project_id",
     storageBucket: "your_project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your_app_id"
   };
   ```

4. **Google Maps Setup**
   Add your Google Maps API key to the HTML head in `index.html`:

   ```html
   <script async defer
     src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker">
   </script>
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

### 🗺️ Google Maps API Setup

1. **Get API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
2. **Enable APIs**: Enable "Maps JavaScript API" and "Advanced Markers API"
3. **Set Restrictions**: Configure API key restrictions for security
4. **Add to HTML**: Add the script tag with your API key to `index.html`

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
- **Custom Components**: Tailwind-based components in `src/styles/globals.css`
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

### Automatic Zoom & Bounds

- **Smart Map Fitting**: Automatically adjusts zoom to include user location and all saved locations
- **Dynamic Bounds Calculation**: Uses Google Maps LatLngBounds for optimal viewing
- **User-Centric Zoom**: Prioritizes user's current position in view calculations
- **Responsive Adjustment**: Adapts to different screen sizes and location densities

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
- **locations**: Mushroom finding spots with coordinates, descriptions, and metadata
- **findings**: User mushroom discoveries (future feature)

### Firebase Storage Structure

- **locations/**: Photo storage organized by location ID
  - `{locationId}.jpg`: Individual location photos with optimized compression
- **Security Rules**: Authenticated access with proper CORS configuration
- **File Management**: Automatic cleanup and size optimization

## 🚀 Deployment

### Firebase Hosting (Production)

The application is deployed to Firebase Hosting with optimized performance:

**Live Application**: [https://boletus-eb305.web.app](https://boletus-eb305.web.app)

```bash
# Build optimized production version
ionic build --prod

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Build Optimization Features

- **Code Splitting**: Pages loaded dynamically with React.lazy()
- **Manual Chunking**: Separated vendor libraries (React, Firebase, Google Maps)
- **Terser Minification**: Compressed JavaScript with console.log removal
- **Optimized Caching**: Firebase Hosting cache headers for static assets

### Build Output Analysis

```bash
# Production build creates optimized chunks:
dist/assets/react-*.js        (~256kB) # React & React DOM
dist/assets/firebase-*.js     (~495kB) # Firebase services  
dist/assets/vendor-*.js       (~500kB) # Third-party libraries
dist/assets/pages-*.js        (~15kB)  # Application pages (lazy loaded)
dist/assets/services-*.js     (~17kB)  # Application services
dist/assets/components-*.js   (~5kB)   # UI components
```

### Firebase Configuration

- **Hosting**: Single Page Application (SPA) configuration
- **Rewrites**: Client-side routing support for Ionic React
- **Cache Headers**: Optimized for static assets and dynamic content
- **Build Directory**: `dist` (Vite build output)

### PWA Features

- Service worker support
- Offline capability  
- App manifest for home screen installation
- Progressive loading with code splitting

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

## 🍄 Location Management System

### Core Features

- **Interactive Map**: Click anywhere on the map to add new mushroom locations
- **Mushroom Markers**: Custom emoji markers (🍄) for visual location identification
- **Location Details**: Name, description, coordinates, and timestamps for each location
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Real-time Sync**: Instant synchronization with Firebase Firestore
- **List Management**: Comprehensive location list with swipe-to-delete actions
- **Map Navigation**: Jump directly to locations from the list view

### Location Data Structure

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

### Photo Service Integration

```typescript
// Photo upload with location-based naming
await uploadPhotoForLocation(locationId, photoDataUrl);

// Photo retrieval for display
const photoUrl = await getPhotoUrl(locationId);
```

### User Interface

- **Map Page**: Google Maps with click-to-add functionality, automatic zoom, and user location tracking
- **Add Location Page**: Form-based location creation with camera photo capture and validation
- **Locations List Page**: ModularLocationCard components with visible action buttons
- **Photo Integration**: Camera capture, preview, and automatic upload functionality
- **Enhanced UX**: Always-visible actions, improved loading states, and intuitive navigation
- **Responsive Design**: Optimized for both mobile and desktop experiences

### Technical Implementation

- **Google Maps Integration**: Advanced markers with custom styling and automatic bounds fitting
- **Firestore Service**: Comprehensive database operations with error handling
- **Firebase Storage**: Cloud photo storage with location-based file organization
- **Camera Integration**: Native camera functionality via Capacitor API
- **Real-time Updates**: Live synchronization across all application instances
- **Performance Optimization**: Lazy loading, efficient data fetching, and component modularity

## � Photo Integration System

### Camera Functionality

- **Native Camera Integration**: Uses Capacitor Camera API for high-quality photo capture
- **Web Camera Support**: PWA Elements integration for browser compatibility
- **Instant Photo Preview**: Immediate preview after capture with retake option
- **Firebase Storage Integration**: Secure cloud storage with location-based naming
- **Automatic Upload**: Photos uploaded after successful location creation
- **Smart File Management**: Location ID-based naming system (`locations/{locationId}.jpg`)

### Photo Capture Workflow

```typescript
// Camera capture with Capacitor
const photo = await Camera.getPhoto({
  quality: 80,
  allowEditing: false,
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Camera,
  saveToGallery: true
});
```

### Firebase Storage Configuration

- **Security Rules**: Authenticated user access with proper CORS headers
- **Optimized Uploads**: Image compression and efficient data transfer
- **Location-Based Organization**: Systematic file structure for easy management
- **Auto-scaling**: Handles multiple concurrent uploads efficiently

### Photo Display Features

- **Dynamic Loading**: Photos loaded automatically in LocationCard components
- **Loading States**: Smooth loading indicators during photo retrieval
- **Error Handling**: Graceful fallback when photos are unavailable
- **Performance Optimization**: Efficient caching and memory management

## 🎛️ Component Architecture

### LocationCard Component

A standalone, reusable component for displaying location information:

- **Modular Design**: Self-contained component with internal photo loading
- **Data Props**: Clean interface accepting location data objects
- **Visible Actions**: Always-visible action buttons for better UX
- **Photo Integration**: Automatic photo loading from Firebase Storage
- **Responsive Layout**: Optimized for mobile and desktop views

```typescript
interface LocationCardProps {
  location: {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    createdAt: Date;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewOnMap: (id: string) => void;
}
```

### UI/UX Improvements

- **Always-Visible Actions**: Replaced swipe gestures with prominent action buttons
- **Clear Visual Hierarchy**: Improved spacing and typography for better readability
- **Enhanced Loading States**: Fixed loading indicators to prevent UI blocking
- **Intuitive Navigation**: Direct map navigation from location cards
- **Better Touch Targets**: Larger, more accessible button areas

## 🗺️ Enhanced Map Features

### Automatic Zoom Functionality

- **Smart Bounds Calculation**: Automatically fits user location and all saved locations
- **Dynamic Zoom Levels**: Adjusts zoom based on location spread
- **User Location Priority**: Ensures user's current position is always visible
- **Smooth Transitions**: Animated zoom and pan for better user experience
- **Fallback Handling**: Graceful degradation when location services unavailable

### Map Optimization

```typescript
// Automatic bounds fitting
const bounds = new google.maps.LatLngBounds();
bounds.extend(userLocation);
locations.forEach(location => bounds.extend(location));
map.fitBounds(bounds);
```

## 🚀 Recent Performance Enhancements

### Loading State Optimization

- **Fixed Loading Indicators**: Resolved issues with persistent loading spinners
- **Conditional Rendering**: Proper component lifecycle management
- **State Management**: Improved loading state handling across components
- **User Feedback**: Clear loading indicators with appropriate timing

### Technical Improvements

- **PWA Elements Integration**: Added to main.tsx for camera functionality
- **Firebase Storage Rules**: Proper security configuration with CORS support
- **Component Modularity**: Better separation of concerns and reusability
- **Error Handling**: Enhanced error management throughout the application

## �🔮 Roadmap

- [x] ~~Photo upload for mushroom findings with image storage~~ ✅ **Completed**
- [x] ~~Component architecture improvements~~ ✅ **Completed**
- [x] ~~Camera integration with native functionality~~ ✅ **Completed**
- [x] ~~UI/UX enhancements for better user experience~~ ✅ **Completed**
- [ ] Mushroom species database and identification features
- [ ] Weather integration for optimal foraging conditions
- [ ] Offline map caching and location storage
- [ ] Social features for sharing discoveries with community
- [ ] Advanced filtering and search capabilities
- [ ] GPS track recording for foraging routes
- [ ] Push notifications for nearby discoveries

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚡ Performance Optimizations

### Build Optimizations

- **Code Splitting**: Dynamic imports with React.lazy() for all pages
- **Manual Chunking**: Strategic separation of vendor libraries
- **Bundle Analysis**: Optimized chunk sizes under warning thresholds
- **Minification**: Terser optimization with production-ready output

### Loading Performance

- **Lazy Loading**: Pages load only when accessed
- **Suspense Loading**: Smooth loading states with spinner feedback  
- **Efficient Caching**: Firebase Hosting optimized cache headers
- **Reduced Bundle Size**: Separated chunks for better cache utilization

### Runtime Performance

- **Google Maps Optimization**: Efficient marker management and API usage
- **Firestore Optimization**: Batched operations and real-time listeners
- **React Optimization**: Proper component lifecycle and state management

## 🙏 Acknowledgments

- [Ionic Framework](https://ionicframework.com/) for the excellent hybrid development platform
- [Firebase](https://firebase.google.com/) for comprehensive backend services, hosting, and storage
- [Google Maps](https://developers.google.com/maps) for advanced mapping capabilities and automatic zoom features
- [Capacitor](https://capacitorjs.com/) for native camera integration and cross-platform functionality
- [PWA Elements](https://github.com/ionic-team/pwa-elements) for web camera support and compatibility
- [Vite](https://vitejs.dev/) for fast build tooling and optimization features
- [React](https://reactjs.org/) for the robust component architecture
- Nature photographers and mushroom enthusiasts for inspiring the application concept

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `docs/` folder

---

Happy Mushroom Hunting! 🍄🌲
