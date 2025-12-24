# Configuration Library (`src/lib/config`)

## Purpose
Centralized configuration loading, caching, and access for URLs, error messages, and component mappings.

## Files

### `appConfig.ts`
Core configuration management module.

**Main Functions**:

#### `initializeAppConfig()`
Initialize all configuration at app startup.
```typescript
// Call in src/app/layout.tsx during app initialization
await initializeAppConfig();
```

#### `getUrl(key: string): Promise<string>`
Async function to fetch a URL configuration.
```typescript
const contactUrl = await getUrl('CONTACT_ENDPOINT');
```

#### `getUrlSync(key: string): string`
Sync function to get URL (must initialize first).
```typescript
const contactUrl = getUrlSync('CONTACT_ENDPOINT');
```

#### `getErrorMessage(key: string): Promise<string>`
Async function to fetch error message.
```typescript
const msg = await getErrorMessage('contact.validation.missingFields');
```

#### `getErrorMessageSync(key: string, fallback?: string): string`
Sync function to get error message with optional fallback.
```typescript
const msg = getErrorMessageSync('contact.validation.missingFields', 'Error occurred');
```

**Features**:
- Automatic in-memory caching
- Promise deduplication (same request only loads once)
- Fallback data support
- Error handling with defaults

### `componentRegistry.ts`
Maps component type names to React component implementations.

**Purpose**: Enable dynamic component rendering based on configuration strings.

**Structure**:
```typescript
{
  'Button': ButtonComponent,
  'Card': CardComponent,
  'Badge': BadgeComponent,
  'SkillBar': SkillBarComponent,
  'ProjectCard': ProjectCardComponent,
  'TimelineItem': TimelineItemComponent,
  // ... more mappings
}
```

**Usage**:
```typescript
import { componentRegistry } from './componentRegistry';

const ComponentToRender = componentRegistry[componentType];
```

### `pageLayout.ts`
Page layout configuration and structure definitions.

**Purpose**: Define how pages are structured and rendered.

**Contains**:
- Page structure definitions
- Section ordering
- Layout configurations
- Responsive breakpoints

### `types.ts`
TypeScript type definitions for configuration.

**Types**:
- `AppConfig` - Overall app configuration structure
- `UrlConfig` - URL configuration type
- `ErrorMessages` - Error message structure
- Component and Section types
- Custom type definitions

## Configuration Files

These files are loaded from `public/` directory:

### `public/config/urlConfig.json`
Contains all application URLs and endpoints.

**Sections**:
- `services` - Service domains and paths
- `fullUrls` - Pre-built complete URLs
- `csp` - Content Security Policy domains
- `dns` - DNS preconnect domains

### `public/data/errorMessages.json`
Contains all error, warning, and info messages.

**Categories**:
- `errors.*` - Error messages
- `warnings.*` - Warning messages
- `info.*` - Informational messages
- `messages.*` - Message templates

### `public/data/defaultContentLabels.json`
Contains fallback UI labels and text.

## Code Examples

### `EXAMPLES.md`
Comprehensive code examples showing how to:
- Load URLs and error messages
- Use sync vs async access
- Handle errors
- Initialize configuration
- Access messages in components and API routes

## Best Practices

1. **Initialization**: Always call `initializeAppConfig()` at app startup
2. **Sync vs Async**: Use sync access post-initialization for better performance
3. **Error Messages**: Always provide fallback values in `getErrorMessageSync()`
4. **Caching**: Configuration is automatically cached in memory
5. **Multi-Language**: Structure supports adding language variants

## Related Files

- `src/lib/data/` - Data loading modules that use this config
- `public/config/` - URL configuration file directory
- `public/data/` - Error messages and labels directory
- Individual components that import `getErrorMessageSync()`

## Performance

- ✅ First load triggers JSON fetch
- ✅ Subsequent calls use in-memory cache
- ✅ Promise deduplication prevents multiple fetches
- ✅ Fallback data ensures app works offline
