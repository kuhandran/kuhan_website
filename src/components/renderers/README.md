# Component Renderers

## Purpose
Custom rendering components that dynamically render content based on configuration, handling component and section resolution.

## Files

### `PageRenderer.tsx`
Renders the main page structure based on configuration.

**Functionality**:
- Renders multiple sections in sequence
- Passes props to each section
- Handles layout and spacing
- Manages section-level error handling

### `SectionRenderer.tsx`
Renders individual sections with proper styling and layout.

**Functionality**:
- Wraps section components with consistent styling
- Handles section background colors and animations
- Manages padding and spacing
- Provides section container structure

### `ElementRenderer.tsx`
Dynamically renders individual elements based on type.

**Functionality**:
- Maps element types to component implementations
- Uses `componentRegistry` for component lookups
- Handles missing components gracefully
- Passes element-specific props to components
- Uses error messages for missing component handling

**Supported Element Types**:
- Button, Card, Badge, Text, Image, etc.
- Custom elements via registry

**Error Handling**:
- Uses `getErrorMessageSync('warnings.componentNotFound')` for missing components
- Falls back to safe UI when component not found

### `CustomSectionRenderer.tsx`
Advanced section rendering with custom logic.

**Functionality**:
- Handles complex section layouts
- Manages conditional rendering
- Applies custom styling logic
- Processes section metadata

**Features**:
- Section-specific error handling
- Dynamic section resolution
- Custom layout algorithms
- Integration with component registry

## Component Registry

All renderers rely on `src/lib/config/componentRegistry.ts` which maps component names to actual React components.

```typescript
{
  Button: ButtonComponent,
  Card: CardComponent,
  Badge: BadgeComponent,
  // ... more mappings
}
```

## Error Handling

Uses `getErrorMessageSync()` for consistent error messages:
- `warnings.componentNotFound` - Component not in registry
- `warnings.sectionNotFound` - Section not found
- `data.defaultLabels` - Fallback label loading

## Related Files

- `src/lib/config/componentRegistry.ts` - Component mapping
- `src/lib/config/appConfig.ts` - Configuration loading
- `public/data/errorMessages.json` - Error messages
- Individual component files in `src/components/`
