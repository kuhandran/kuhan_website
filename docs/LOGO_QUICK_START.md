# Logo Quick Reference

## Current Implementation

**Logo**: `/public/logo.svg` (1024x1024px)
**Display**: h-8 w-8 in white rounded container
**Status**: ✅ Optimized and working

## Quick Commands

### Generate optimized variants
```bash
node scripts/optimize-logo.js --variants
```

### Custom dimensions
```bash
node scripts/optimize-logo.js --width 200 --height 50
```

### Help
```bash
node scripts/optimize-logo.js --help
```

## Current Navbar Implementation

```tsx
// Logo displays in white container with hover effects
<img 
  src="/logo.svg"
  alt="Kuhandran Logo"
  className="h-8 w-8 object-contain"
/>
```

See [LOGO_OPTIMIZATION.md](./LOGO_OPTIMIZATION.md) for complete guide.

# Option 2: Keep square but smaller
node scripts/optimize-logo.js --width 200 --height 200

# Option 3: Generate all variants for flexibility
node scripts/optimize-logo.js --variants
```

## 🧪 Testing After Optimization

1. Run optimization script
2. Check your navbar: http://localhost:3000
3. Logo should display same size but with better scaling
4. No code changes needed - same `<img>` tag works

## 💡 Understanding the "41%" Request

If you want logo to be 41% of navbar width:

```tsx
// In Navbar.tsx - modify logo img tag:
<img 
  src="/logo.svg"
  alt="Kuhandran Logo"
  className="w-[41%] h-auto filter brightness-0 invert"
/>

// Or with max-width constraint:
<img 
  src="/logo.svg"
  alt="Kuhandran Logo"
  className="w-[41%] max-w-[200px] h-auto filter brightness-0 invert"
/>
```

## 📏 Size Reference

| Tailwind Class | Pixels | Use Case |
|---------------|--------|----------|
| `h-4` | 16px | Very small |
| `h-6` | 24px | Current (small) |
| `h-8` | 32px | Medium |
| `h-10` | 40px | Large |
| `h-12` | 48px | Extra large |

## 🔧 Script Options

- `--width <number>` - Target width in pixels
- `--height <number>` - Target height in pixels
- `--variants` - Generate sm/md/lg variants
- `--help` - Show help

## 📝 Example Workflow

```bash
# 1. Optimize logo
node scripts/optimize-logo.js --width 200 --height 50

# 2. Check in browser
# Navigate to http://localhost:3000

# 3. If satisfied, commit
git add public/logo.svg public/logo.backup.svg
git commit -m "Optimize logo to 200x50px with proper viewBox"
```

## 🎨 CSS Sizing After Optimization

The optimized SVG will scale better with:

```tsx
// Fixed height, proportional width
<img className="h-8 w-auto" />

// Fixed width, proportional height  
<img className="w-48 h-auto" />

// Percentage of container
<img className="w-[50%] h-auto" />

// Viewport-based
<img className="w-[41vw] max-w-[200px] h-auto" />
```

## ⚡ Why This Matters

**Before Optimization (1024x1024):**
- Large file size (~40-50 KB)
- No viewBox = poor responsive scaling
- Overkill for navbar use

**After Optimization (200x50):**
- Smaller file size (~15-20 KB)
- viewBox enabled = perfect scaling
- Proper dimensions for web use
- Professional aspect ratio

---

**Ready to optimize?** Run:
```bash
node scripts/optimize-logo.js
```

**Need help?** See full guide: [docs/LOGO_OPTIMIZATION.md](./LOGO_OPTIMIZATION.md)
