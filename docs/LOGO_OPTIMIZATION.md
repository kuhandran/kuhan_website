# Logo Optimization Guide

## Overview

Complete guide for optimizing and implementing the logo across the website with proper sizing and responsive behavior.

## Current Status

- **File**: `/public/logo.svg`
- **Dimensions**: 1024 x 1024 pixels (1:1 aspect ratio)
- **Usage**: Navbar, favicon, Open Graph images
- **Display**: Currently using `h-6 w-auto` (24px height, responsive width)

## Standard Web Logo Sizes

| Variant | Dimensions | Use Case | Aspect Ratio |
|---------|------------|----------|--------------|
| **Small** | 120 x 30px | Mobile navbar | 4:1 |
| **Medium** | 200 x 50px | Desktop navbar | 4:1 |
| **Large** | 300 x 75px | Hero sections | 4:1 |
| **Square** | 512 x 512px | Favicon, OG images | 1:1 |

## Using the Optimization Script

### Basic Usage

```bash
# Optimize to default dimensions (200x50px)
node scripts/optimize-logo.js

# Custom dimensions
node scripts/optimize-logo.js --width 300 --height 75

# Generate all size variants
node scripts/optimize-logo.js --variants
```

### What the Script Does

1. ✅ **Maintains aspect ratio** - Calculates proportional dimensions
2. ✅ **Adds viewBox** - Enables responsive SVG scaling
3. ✅ **Sets preserveAspectRatio** - Prevents distortion
4. ✅ **Creates backup** - Original saved as `logo.backup.svg`
5. ✅ **Generates variants** - Multiple sizes for different use cases
6. ✅ **Optimizes code** - Removes unnecessary whitespace

### Command Options

```bash
--width <number>    # Target width in pixels
--height <number>   # Target height in pixels
--variants          # Generate sm, md, lg variants
--help, -h          # Show help message
```

## Recommended Approach

### Option 1: Resize for 41% Viewport Width

Since you mentioned "41%", here's how to size for that:

```bash
# For 1920px desktop viewport: 41% = 787px
# Maintaining current 1:1 ratio:
node scripts/optimize-logo.js --width 200 --height 200

# For horizontal navbar logo (4:1 ratio):
node scripts/optimize-logo.js --width 787 --height 197
```

### Option 2: Standard Professional Sizing (Recommended)

```bash
# Generate all standard variants
node scripts/optimize-logo.js --variants

# This creates:
# - logo-sm.svg (120x30) for mobile
# - logo-md.svg (200x50) for desktop  
# - logo-lg.svg (300x75) for hero
```

### Option 3: Navbar-Optimized (Best for Current Use)

```bash
# Optimize for navbar use with 4:1 horizontal ratio
node scripts/optimize-logo.js --width 200 --height 50
```

## Implementation in Code

### Current Implementation (Navbar.tsx)

```tsx
// Direct path with responsive sizing
<img 
  src="/logo.svg"
  alt="Kuhandran Logo"
  className="h-6 w-auto filter brightness-0 invert"
/>
```

### After Optimization

The same code works better because the SVG now has:
- Proper viewBox for scaling
- Optimized dimensions
- Better aspect ratio

### Using Different Variants

```tsx
// Small (mobile)
<img src="/logo-sm.svg" alt="Logo" className="h-6 w-auto" />

// Medium (desktop) 
<img src="/logo-md.svg" alt="Logo" className="h-8 w-auto" />

// Large (hero)
<img src="/logo-lg.svg" alt="Logo" className="h-12 w-auto" />
```

## Responsive CSS Sizing

### Fixed Height, Auto Width (Recommended)

```css
/* Tailwind classes */
.logo-sm { @apply h-6 w-auto; }    /* 24px height */
.logo-md { @apply h-8 w-auto; }    /* 32px height */
.logo-lg { @apply h-12 w-auto; }   /* 48px height */

/* CSS */
.logo { height: 2rem; width: auto; }
```

### Fixed Width, Auto Height

```css
/* For horizontal layouts */
.logo { width: 12rem; height: auto; }  /* 192px */
```

### Viewport-Based Sizing (41% example)

```css
/* Logo scales with viewport */
.logo {
  width: 41vw;
  max-width: 200px;  /* Limit on large screens */
  height: auto;
}
```

## SVG Best Practices

### 1. Always Use viewBox

```xml
<svg viewBox="0 0 1024 1024" width="200" height="50">
  <!-- Content scales to fit 200x50 while maintaining 1024:1024 ratio -->
</svg>
```

### 2. Set preserveAspectRatio

```xml
<svg preserveAspectRatio="xMidYMid meet">
  <!-- Centers and scales to fit without distortion -->
</svg>
```

### 3. Responsive Width

```tsx
// SVG adapts to container
<div className="w-48">
  <img src="/logo.svg" className="w-full h-auto" />
</div>
```

## Testing Different Sizes

### Browser DevTools

1. Open DevTools (F12)
2. Right-click logo → Inspect
3. Try different Tailwind classes:
   - `h-4` (16px) - Very small
   - `h-6` (24px) - Small (current)
   - `h-8` (32px) - Medium
   - `h-10` (40px) - Large
   - `h-12` (48px) - Extra large

### Viewport Width Testing

```tsx
// Test 41% viewport width
<img 
  src="/logo.svg" 
  className="w-[41vw] max-w-[200px] h-auto"
  alt="Logo" 
/>
```

## File Size Optimization

The script maintains quality while reducing file size:

- **Before**: ~40-50 KB (1024x1024)
- **After**: ~15-20 KB (200x50)
- **Benefit**: Faster loading, better performance

## Migration Steps

1. **Backup current logo**
   ```bash
   cp public/logo.svg public/logo-original.svg
   ```

2. **Run optimization**
   ```bash
   node scripts/optimize-logo.js --width 200 --height 50
   ```

3. **Test in development**
   ```bash
   npm run dev
   # Check navbar, favicon, OG images
   ```

4. **Verify in browser**
   - Check logo displays correctly
   - Test mobile responsive
   - Verify no distortion

5. **Deploy**
   ```bash
   git add public/logo.svg
   git commit -m "Optimize logo.svg to 200x50px with proper viewBox"
   ```

## Troubleshooting

### Logo appears stretched

```bash
# Recalculate with proper aspect ratio
node scripts/optimize-logo.js --width 200  # Height calculated automatically
```

### Logo too small/large

```tsx
// Adjust Tailwind classes in Navbar.tsx
<img className="h-8 w-auto" /> // Increase from h-6
```

### Need square logo for favicon

```bash
# Keep original for favicon use
node scripts/optimize-logo.js --width 512 --height 512
mv public/logo.svg public/logo-favicon.svg
```

## Recommended Final Configuration

```bash
# Generate optimized variants
node scripts/optimize-logo.js --variants

# Use in code:
# - logo-sm.svg for mobile (120x30)
# - logo-md.svg for desktop navbar (200x50)  
# - logo-lg.svg for hero sections (300x75)
# - logo-original.svg for favicon/OG (1024x1024)
```

## Next Steps

1. Run optimization script with desired dimensions
2. Update navbar implementation if using variants
3. Test responsive behavior across devices
4. Commit optimized logo to repository
5. Deploy and verify in production

---

**Need help?** Check the script output or run:
```bash
node scripts/optimize-logo.js --help
```
