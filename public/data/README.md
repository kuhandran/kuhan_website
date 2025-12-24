# Public Data Directory

This directory contains JSON configuration and data files that are statically served and used across the application.

## Files

### `errorMessages.json`
**Purpose**: Centralized error, warning, and informational messages used throughout the application.

**Structure**:
- `errors.common` - General application errors
- `errors.network` - Network/HTTP related errors
- `errors.validation` - Form validation messages
- `errors.file` - File upload and processing errors
- `errors.contact` - Contact form specific errors
- `errors.data` - Data loading and fetching errors
- `errors.chatbot` - Chatbot service errors
- `warnings.*` - Warning messages for various scenarios
- `info.*` - Informational messages
- `messages.*` - Success and error message templates

**Total Messages**: 45+ error/warning/info messages

**Usage**: Accessed via `getErrorMessageSync()` or `getErrorMessage()` from `src/lib/config/appConfig.ts`

### `defaultContentLabels.json`
**Purpose**: Default fallback UI labels and text used when dynamic content labels fail to load.

**Contents**:
- Navigation labels
- Section headers
- Button labels
- Form labels
- Error fallback text
- Chatbot default messages

**Usage**: Served as fallback when API returns no data; used in components as default labels.

## Error Messages Reference

### Import & Usage
```typescript
import { getErrorMessageSync } from '@/lib/config/appConfig';

// Get error message
const errorMsg = getErrorMessageSync('contact.validation.missingFields');

// With fallback value
const msg = getErrorMessageSync('key.path', 'Default message');
```

### Common Error Message Paths

**Contact Form Validation**:
- `contact.validation.missingFields` - All fields are required
- `contact.validation.invalidEmail` - Invalid email format
- `contact.file.invalidType` - Only PDF and DOCX files allowed
- `contact.file.invalidSize` - File size must be less than 5MB
- `contact.submission.failed` - Failed to send message
- `contact.submission.success` - Message sent successfully

**Data Loading Errors**:
- `data.contentLabels` - Failed to load content labels
- `data.achievements` - Error fetching achievements
- `data.education` - Error fetching education
- `data.experience` - Error fetching experience
- `data.projects` - Error fetching projects
- `data.skills` - Error fetching skills
- `data.httpError` - HTTP error occurred

**Network Errors**:
- `errors.network.connectionError` - Connection error
- `errors.network.timeout` - Request timeout
- `errors.network.notFound` - Resource not found

**Warnings** (Non-critical):
- `warnings.projectsData` - Failed to fetch projects data from CDN
- `warnings.skillsData` - Failed to fetch skills data from CDN
- `warnings.experienceData` - Failed to fetch experience data from CDN
- `warnings.educationData` - Failed to fetch education data from CDN
- `warnings.sectionNotFound` - Section type not found
- `warnings.componentNotFound` - Component type not found

**General Errors**:
- `errors.common.unknownError` - An unexpected error occurred
- `errors.common.tryAgain` - Please try again later

## How These Files Are Used

1. **Configuration Loading**: Files are loaded by `src/lib/config/appConfig.ts` during app initialization
2. **Error Handling**: `errorMessages.json` provides standardized error text for consistent UX
3. **Multi-Language Ready**: Structure supports easy translation by adding new language variants
4. **Performance**: Static JSON files are cached and preloaded for minimal runtime overhead

## Adding New Error Messages

1. Add new message to `errorMessages.json` following existing structure
2. Use dot notation for nesting: `errors.category.messageName`
3. Reference in code with `getErrorMessageSync('errors.category.messageName')`
4. Update this README with new message paths

## Static Asset Path

All files are served from:
- Development: `/public/data/` → `http://localhost:3000/data/`
- Production: `https://static.kuhandranchatbot.info/data/`

## Related Files

- See `src/lib/config/appConfig.ts` for configuration loading logic
- See `public/config/README.md` for URL configuration
- See `src/lib/data/README.md` for data module documentation
