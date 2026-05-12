# Configuration & Files Proper Usage

## Server Status
✅ Development server running on `http://localhost:3000`

## Working Routes

### Dynamic Config Routes (with language support)
```
GET /api/config/{language}/{configType}
```

**Examples:**
- `http://localhost:3000/api/config/en/apiConfig` → Returns English API config
- `http://localhost:3000/api/config/es/pageLayout` → Returns Spanish page layout
- `http://localhost:3000/api/config/ta/urlConfig` → Returns Tamil URL config

**Supported Languages:** en, es, fr, de, hi, ta, ar-AE, id, my, si, th

**Supported Config Types:** apiConfig, pageLayout, urlConfig

---

### Service Worker
```
Static file: /files/sw.js
Registration: navigator.serviceWorker.register('/files/sw.js')
```

---

### Web App Manifest
```
GET /api/manifest/{language}
```

**Examples:**
- `http://localhost:3000/api/manifest/en` → English manifest
- `http://localhost:3000/api/manifest/es` → Spanish manifest

---

### Static Icons (from /public/files)
```
Icon files: /files/logo.svg, /files/apple-touch-icon.svg
Config files: /files/manifest.json (legacy - now generated dynamically)
Other: /files/sw.js, /files/robots.txt, /files/sitemap.xml
```

---

## Configuration Browser
Access the configuration browser to test all config routes:

```
http://localhost:3000/config
```

Features:
- Language dropdown (defaults to "en")
- Config type selector (apiConfig, pageLayout, urlConfig)
- Live fetch with URL preview
- JSON response display

---

## File Organization

### Public Static Files (`/public`)
```
/public/
├── files/                  # Static files served as-is
│   ├── sw.js             # Service worker
│   ├── logo.svg          # Logo icon
│   ├── apple-touch-icon.svg
│   ├── manifest.json     # Legacy (use /api/manifest/{lang} instead)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── ...
├── collections/          # Language-specific data
│   ├── en/config/
│   │   ├── apiConfig.json
│   │   ├── pageLayout.json
│   │   └── urlConfig.json
│   ├── es/config/
│   ├── fr/config/
│   ├── ... (other languages)
├── image/               # Images
└── ...
```

### Source Code Routes (`/src/app`)
```
/src/app/
├── api/
│   ├── config/[language]/[configType]/route.ts
│   │   ├─ Reads from: /public/collections/{language}/config/{configType}.json
│   │   ├─ Returns: JSON response with proper headers
│   │   └─ Fallback: DEFAULT_LANGUAGE if language not found
│   ├── manifest/[language]/route.ts
│   │   └─ Dynamically generates PWA manifest
│   └── ...
├── config/
│   ├── page.tsx         # Config browser UI
│   └── [configType]/route.ts  # Legacy redirect handler
└── ...
```

---

## Centralized Configuration

All domains, endpoints, and file names are defined in:
```typescript
/src/config/domains.ts
```

**Key exports:**
- `DOMAINS` - Base URLs for APIs
- `API_ENDPOINTS` - Endpoint builders
- `DATA_FILES` - File name constants
- `IMAGE_ASSETS` - Image file paths
- `SUPPORTED_LANGUAGES` - Language codes
- `getConfigRouteUrl(language, configType)` - Build config route URLs
- `getManifestUrl(language)` - Build manifest route URLs
- `getCollectionUrl(language, type, file)` - Build collection URLs

---

## Testing

### Test Config Routes
```bash
# English config
curl http://localhost:3000/api/config/en/apiConfig

# Spanish config
curl http://localhost:3000/api/config/es/pageLayout

# Tamil config with fallback
curl http://localhost:3000/api/config/ta/urlConfig
```

### Browser Navigation
1. Home: `http://localhost:3000`
2. Config Browser: `http://localhost:3000/config` (language dropdown defaults to "en")
3. API Test: Visit the browser and change language/config type to test

---

## Previous External API

The application previously used:
```
https://static.kuhandranchatbot.info/public/collections/{language}/config/{configType}
```

Now served locally via:
```
GET /api/config/{language}/{configType}
```

This allows:
- Faster local loading
- Language-aware responses
- Development offline support
- No external API dependency for core config

---

## Migration Notes

- Old path: `/config/pageLayout.json` → New: `/api/config/en/pageLayout`
- Old path: `/config/apiConfig.json` → New: `/api/config/en/apiConfig`
- Old path: `/api/sw` → New: `/files/sw.js` (static file)
- Old path: `/manifest.json` → New: `/api/manifest/en` (dynamic)

All code has been updated to use the new routes through centralized helpers.
# Centralized Domain Configuration Guide

## 📍 Overview

All domains and base URLs are now centralized in a single configuration file: **[src/config/domains.ts](src/config/domains.ts)**

This ensures:
- ✅ Single source of truth for all URLs
- ✅ Easy to update domains globally
- ✅ Consistent URL construction across the application
- ✅ Better maintainability and reduced duplication

---

## 📋 File Structure

```
src/config/domains.ts
├── DOMAINS (base URLs)
│   ├── PRODUCTION_API
│   ├── CDN
│   ├── IP_API
│   └── getAppUrl()
├── API_ENDPOINTS (endpoint builders)
├── SUPPORTED_LANGUAGES
├── DATA_FILES (file name constants)
├── IMAGE_ASSETS (image path constants)
└── Helper Functions
```

---

## 🔧 How to Use

### 1. **Import the Configuration**

```typescript
import { DOMAINS, API_ENDPOINTS, IMAGE_ASSETS } from '@/config/domains';
```

### 2. **Use Domains (Base URLs)**

```typescript
// Get production API base URL
const apiBase = DOMAINS.PRODUCTION_API;
// → 'https://static.kuhandranchatbot.info'

// Get CDN base URL
const cdnBase = DOMAINS.CDN;
// → 'https://static.kuhandranchatbot.info'

// Get app URL (works on server and client)
const appUrl = DOMAINS.getAppUrl();
// → 'http://localhost:3000' (dev) or 'https://example.vercel.app' (prod)
```

### 3. **Use API Endpoints**

```typescript
// Production API collection
const url = API_ENDPOINTS.collections('en', 'data', 'experience');
// → 'https://static.kuhandranchatbot.info/public/collections/en/data/experience'

// CDN data
const url = API_ENDPOINTS.cdnData('skills');
// → 'https://static.kuhandranchatbot.info/public/collections/en/data/skills'

// CDN images
const url = API_ENDPOINTS.cdnImage('profile.webp');
// → 'https://static.kuhandranchatbot.info/image/profile.webp'

// Internal API routes
const url = API_ENDPOINTS.contentProxy('data');
// → '/api/content/data'

const url = API_ENDPOINTS.analyticsVisitor();
// → '/api/analytics/visitor'

// Local files
const url = API_ENDPOINTS.localConfig('urlConfig');
// → '/config/urlConfig.json'

const url = API_ENDPOINTS.localData('errorMessages');
// → '/data/errorMessages.json'

const url = API_ENDPOINTS.localImage('profile.png');
// → '/image/profile.png'
```

### 4. **Use Helper Functions**

```typescript
import { getCollectionUrl, getCdnImageUrl, getIpGeolocationUrl } from '@/config/domains';

// Get collection URL
const url = getCollectionUrl('en', 'data', 'experience');

// Get CDN image URL
const imageUrl = getCdnImageUrl('profile.webp');

// Get IP geolocation API URL
const ipApiUrl = getIpGeolocationUrl();
```

### 5. **Use Constants for Data Files**

```typescript
import { DATA_FILES, IMAGE_ASSETS } from '@/config/domains';

// Data files
const experienceFile = DATA_FILES.experience; // 'experience'
const projectsFile = DATA_FILES.projects;     // 'projects'

// Image assets
const profilePng = IMAGE_ASSETS.profile.png;    // 'profile.png'
const profileWebp = IMAGE_ASSETS.profile.webp;  // 'profile.webp'
const logo = IMAGE_ASSETS.logo;                 // 'logo.svg'
```

---

## 📝 Example: Complete Integration

### Before (Hardcoded URLs)
```typescript
const imageSrc = 'https://static.kuhandranchatbot.info/image/profile.webp';
const response = await fetch('https://ipapi.co/json/');
const apiUrl = 'https://static.kuhandranchatbot.info/public/collections/en/data/experience';
```

### After (Using Centralized Config)
```typescript
import { API_ENDPOINTS, IMAGE_ASSETS } from '@/config/domains';

const imageSrc = API_ENDPOINTS.cdnImage(IMAGE_ASSETS.profile.webp);
const response = await fetch(API_ENDPOINTS.ipGeolocation());
const apiUrl = API_ENDPOINTS.collections('en', 'data', 'experience');
```

---

## 🔄 Updated Files

The following files have been updated to use the centralized domain configuration:

1. **[src/lib/config/dataConfig.ts](src/lib/config/dataConfig.ts)**
   - Uses `getCollectionUrl()` instead of hardcoded URLs
   - Uses `DOMAINS.PRODUCTION_API` for API base

2. **[src/lib/data/contentLabels.ts](src/lib/data/contentLabels.ts)**
   - Uses `API_ENDPOINTS.cdnData()` for CDN URLs
   - Uses `API_ENDPOINTS.localData()` for fallback URLs

3. **[src/lib/analytics/visitorAnalytics.ts](src/lib/analytics/visitorAnalytics.ts)**
   - Uses `API_ENDPOINTS.ipGeolocation()` for IP API
   - Uses `API_ENDPOINTS.analyticsVisitor()` for analytics endpoint

4. **[src/lib/config/appConfig.ts](src/lib/config/appConfig.ts)**
   - Uses `API_ENDPOINTS.localConfig()` for config files
   - Uses `API_ENDPOINTS.localData()` for data files

5. **[src/components/sections/About.tsx](src/components/sections/About.tsx)**
   - Uses `API_ENDPOINTS.cdnImage()` and `IMAGE_ASSETS` for profile images

6. **[src/app/api/content/[type]/route.ts](src/app/api/content/[type]/route.ts)**
   - Uses `getCollectionUrl()` for API calls
   - Uses `DOMAINS.getAppUrl()` for dynamic host URLs

---

## 🚀 Adding New Domains

To add a new domain or API endpoint:

1. **Add to `DOMAINS` object** (if it's a base URL):
```typescript
export const DOMAINS = {
  // ... existing
  NEW_SERVICE: 'https://api.newservice.com',
} as const;
```

2. **Add helper endpoint** (if it's an API endpoint):
```typescript
export const API_ENDPOINTS = {
  // ... existing
  newServiceEndpoint: (param: string) =>
    `${DOMAINS.NEW_SERVICE}/api/${param}`,
} as const;
```

3. **Add helper function** (if needed):
```typescript
export function getNewServiceUrl(param: string): string {
  return API_ENDPOINTS.newServiceEndpoint(param);
}
```

---

## ✅ Supported Languages

All data endpoints support these language codes:

```typescript
export const SUPPORTED_LANGUAGES = [
  'en',    // English
  'es',    // Spanish
  'fr',    // French
  'de',    // German
  'hi',    // Hindi
  'ta',    // Tamil
  'ar-AE', // Arabic - UAE
  'id',    // Indonesian
  'my',    // Burmese
  'si',    // Sinhala
  'th',    // Thai
] as const;
```

---

## 📚 API Endpoints Reference

### Production API
```
Base: https://static.kuhandranchatbot.info/public

Data Collections:
GET /collections/{language}/data/{file}
  - experience
  - projects
  - skills.json
  - education.json
  - achievements.json
  - contentLabels.json

Config Collections:
GET /collections/{language}/config/{file}.json
  - apiConfig.json
  - pageLayout.json
  - urlConfig.json
```

### CDN (Static Content)
```
Base: https://static.kuhandranchatbot.info

Data:
GET /data/{file}.json

Config:
GET /config/{file}.json

Images:
GET /image/{imagePath}
```

### Internal API Routes
```
POST /api/analytics/visitor
GET /api/content/{type}?language={lang}&file={file}
```

### Third-Party APIs
```
IP Geolocation:
GET https://ipapi.co/json/
```

---

## 🔍 Finding All Uses

To find all places still using hardcoded URLs:

```bash
grep -r "https://" src/ --include="*.ts" --include="*.tsx" | grep -v "domains.ts"
```

This helps identify any remaining hardcoded URLs that should use the centralized config.

---

## 💡 Benefits

| Benefit | Description |
|---------|-------------|
| **Single Source of Truth** | All URLs defined in one place |
| **Easy Updates** | Change a domain once, reflects everywhere |
| **Type Safety** | TypeScript const types prevent typos |
| **Consistency** | Standardized URL construction |
| **Maintainability** | Clear organization of all external services |
| **Testability** | Easy to mock URLs for testing |
| **Documentation** | Comments explain each endpoint |

