# Path Aliases Configuration

## Overview
This project uses path aliases to simplify imports and avoid long relative paths like `../../../`. Instead of writing complex relative paths, you can use clean aliases starting with `@`.

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
// From a deep component
import { LocationData } from '../../../services/geolocationService';
import MapView from '../../components/MapView';
import { useAuth } from '../../../contexts/AuthContext';
```

### After (clean aliases)
```typescript
// Much cleaner and clearer
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

## Best Practices

1. **Use specific aliases when possible**:
   - ✅ `@services/geolocationService`
   - ✅ `@components/MapView`
   - ⚠️ `@/services/geolocationService` (works but less specific)

2. **Use `@/` for files in the root src directory**:
   - ✅ `@/App`
   - ✅ `@/contexts/AuthContext`

3. **Keep imports consistent across the project**:
   - Always use aliases instead of mixing relative and alias imports

## VS Code IntelliSense

VS Code will automatically provide autocomplete and path resolution for these aliases. If you experience issues:

1. Restart the TypeScript language server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
2. Ensure your `tsconfig.json` is properly configured
3. Check that your workspace is opened at the project root

## Benefits

- **Cleaner code**: No more `../../../` navigation
- **Easier refactoring**: Moving files doesn't break imports
- **Better readability**: Clear indication of what's being imported
- **IDE support**: Better autocomplete and navigation
- **Consistent structure**: Standardized import patterns across the project