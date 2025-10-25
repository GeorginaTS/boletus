# PATH ALIASES SETUP

## Overview
This project uses path aliases to simplify imports and avoid long relative paths like `../../../`. Use clean aliases starting with `@`.

## Available Aliases

| Alias           | Path               | Description                   |
| --------------- | ------------------ | ----------------------------- |
| `@/*`           | `src/*`            | Root source directory         |
| `@components/*` | `src/components/*` | React components              |
| `@services/*`   | `src/services/*`   | Service classes and utilities |
| `@pages/*`      | `src/pages/*`      | Page components               |
| `@styles/*`     | `src/styles/*`     | CSS and styling files         |
| `@theme/*`      | `src/theme/*`      | Theme variables and styling   |
| `@utils/*`      | `src/utils/*`      | Utility functions             |
| `@types/*`      | `src/types/*`      | TypeScript type definitions   |

## Usage Examples

### Before (relative paths)
```typescript
import { LocationData } from '../../../services/geolocationService';
import MapView from '../../components/MapView';
import { useAuth } from '../../../contexts/AuthContext';
```

### After (clean aliases)
```typescript
import { LocationData } from '@services/geolocationService';
import MapView from '@components/MapView';
import { useAuth } from '@/contexts/AuthContext';
```

## Configuration Files

### 1. `vite.config.ts`
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@services': path.resolve(__dirname, './src/services'),
    // ... other aliases
  }
}
```

### 2. `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      // ... other paths
    }
  }
}
```

---

**Last updated:** October 25, 2025
