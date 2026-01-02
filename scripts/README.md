# Scripts Directory

This directory contains utility scripts for automating development and build tasks.

## Current Scripts

### `convert-images.js`
**Purpose**: Converts PNG and JPG images to optimized WebP format for better performance.

**Usage**:
```bash
node scripts/convert-images.js
```

**What It Does**:
- ✅ Scans `public/image` directory for PNG and JPG files
- ✅ Converts each image to WebP format
- ✅ Maintains original images (creates additional WebP versions)
- ✅ Logs conversion progress and results
- ✅ Skips already-converted images
- ✅ Handles errors gracefully

**Configuration**:
- Input directory: `public/image`
- Output directory: Same as input (adds `.webp` extension)
- Compression quality: Optimized for web

**Output Example**:
```
✅ Converted: profile.png → profile.webp (45% size reduction)
✅ Converted: project-1.jpg → project-1.webp (52% size reduction)
⏭️  Skipped: logo.webp (already converted)
❌ Failed: large-image.png (Error details shown)
```

**How Image Conversion Helps**:
1. **Smaller File Sizes**: WebP typically 25-35% smaller than PNG/JPG
2. **Faster Load Times**: Smaller images = faster page loads
3. **Better Performance Scores**: Improves Lighthouse performance metrics
4. **Modern Format**: Supported by all modern browsers (with JPG fallback)

---

### `RUN_LIGHTHOUSE_LOCALLY.sh`
**Purpose**: Manual guide for running Lighthouse performance audits locally.

**Usage**:
```bash
bash scripts/RUN_LIGHTHOUSE_LOCALLY.sh
```

**What It Does**:
- ✅ Displays step-by-step guide for running Lighthouse
- ✅ Shows expected performance benchmarks
- ✅ Explains optimization checks
- ✅ Lists expected scores and metrics

**Steps**:
1. Build production: `npm run build`
2. Start server: `npm start`
3. Open Chrome DevTools (F12)
4. Click Lighthouse tab
5. Run audit (wait ~5 minutes)
6. Compare against expected scores

---

## Removed Scripts

The following scripts have been removed due to project changes:

### `sync-public-folder.sh` (Removed)
- **Reason**: Referenced non-existent `portfolio-data-api` repository
- **Purpose**: Was used to sync `public/` folder between website and API repos
- **Status**: No longer needed for single-project setup
- **Related npm commands removed**: All `npm run sync:*` commands

### `setup-git-hooks.sh` (Removed)
- **Reason**: Git hooks not currently used
- **Purpose**: Was used to install pre-commit and post-merge hooks
- **Status**: Can be recreated if needed for workflow automation
- **Related npm commands removed**: `npm run hooks:setup`

---

## Best Practices

### Before Deployment

1. **Update JSON data**:
   ```bash
   npm run sync-json
   ```

2. **Convert images** (if new images added):
   ```bash
   node scripts/convert-images.js
   ```

3. **Build and test**:
   ```bash
   npm run build
   npm run prod
   ```

4. **Run Lighthouse audit**:
   ```bash
   bash scripts/RUN_LIGHTHOUSE_LOCALLY.sh
   ```

### Using Images in HTML

Use `<picture>` element with WebP and JPG fallback:
```html
<picture>
  <source srcSet="/images/profile.webp" type="image/webp" />
  <img src="/images/profile.jpg" alt="Profile" />
</picture>
```

Or with Next.js Image component (auto-optimized):
```tsx
import Image from 'next/image';

<Image src="/profile.jpg" alt="Profile" width={200} height={200} />
```

---

## Dependencies

- `sharp` - Image processing library (for convert-images.js)
- Node.js File System (`fs`)
- Node.js Path utilities (`path`)

---

## Future Scripts

Potential automation scripts to add:
- Image optimization (resize, compress)
- SEO meta-tag generation
- Advanced performance audit automation
- Multi-environment deployment scripts
