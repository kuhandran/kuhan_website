# Scripts Directory

This directory contains utility scripts for automating development and build tasks.

## Scripts

### `sync-json.js`
**Purpose**: Downloads all JSON files from CDN and saves to local `public/data/` folder for development.

**Usage**:
```bash
npm run sync-json
# or
node scripts/sync-json.js
```

**What It Does**:
- ✅ Downloads all JSON files from `https://static.kuhandranchatbot.info/data/`
- ✅ Saves to local `public/data/` directory
- ✅ Shows download progress with file sizes
- ✅ Handles missing files gracefully
- ✅ Complete in seconds

**Benefits**:
- Always have latest production data locally
- Fast iteration in development (no network delay)
- Test content before uploading to CDN
- Color-coded output for easy reading

**Files Downloaded**:
- `projects.json` - Project and case study data
- `experience.json` - Professional experience
- `skills.json` - Technical skills
- `education.json` - Educational background
- `achievements.json` - Awards and certifications
- `contentLabels.json` - UI text and labels

### `convert-images.js`
**Purpose**: Converts PNG and JPG images to optimized WebP format for better performance.

**Usage**:
```bash
npm run convert-images
# or
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

## How Image Conversion Helps

1. **Smaller File Sizes**: WebP typically 25-35% smaller than PNG/JPG
2. **Faster Load Times**: Smaller images = faster page loads
3. **Better Performance Scores**: Improves Lighthouse performance metrics
4. **Modern Format**: Supported by all modern browsers (with JPG fallback)

## Running Scripts in Package.json

Add to `package.json` scripts section:
```json
{
  "scripts": {
    "convert-images": "node scripts/convert-images.js"
  }
}
```

## Best Practices

1. **Run Before Deployment**: Convert images before production build
2. **Commit WebP Files**: Include generated WebP files in version control
3. **Keep Originals**: Maintain original PNG/JPG for future edits
4. **HTML Usage**: Use `<picture>` element with WebP and JPG fallback:

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

## Future Scripts

Potential automation scripts to add:
- Image optimization (resize, compress)
- SEO meta-tag generation
- Performance audit automation
- Deployment scripts

## Dependencies

- `sharp` - Image processing library
- Node.js File System (`fs`)
- Node.js Path utilities (`path`)
