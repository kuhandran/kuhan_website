# Scripts Directory

This directory contains utility scripts for automating development and build tasks.

## Scripts

### `sync-public-folder.sh`
**Purpose**: Syncs the `public/` folder between your website and portfolio-data-api repositories with intelligent rsync.

**Usage**:
```bash
npm run sync:status              # Show differences (safe, read-only)
npm run sync:website-to-api      # Sync FROM website TO api
npm run sync:api-to-website      # Sync FROM api TO website
npm run sync:bidirectional       # Merge both (api files have priority)
npm run sync:website-to-api-push      # Sync + auto-commit + push
npm run sync:api-to-website-push      # Sync + auto-commit + push
npm run sync:bidirectional-push       # Sync + auto-commit + push

# Or run directly:
./scripts/sync-public-folder.sh status
./scripts/sync-public-folder.sh website->api [--push]
./scripts/sync-public-folder.sh api->website [--push]
./scripts/sync-public-folder.sh bidirectional [--push]
```

**What It Does**:
- ✅ Intelligently syncs `public/` folder using rsync
- ✅ Supports 4 sync modes: status, website→api, api→website, bidirectional
- ✅ Smart exclusions (.gitkeep, node_modules, .next)
- ✅ Optional auto-commit and push with `--push` flag
- ✅ Colored output with detailed logging
- ✅ Error handling and validation

**Sync Directions**:
- **website→api**: Website is primary source (copies all files, deletes api-only files)
- **api→website**: API is primary source (copies all files, deletes website-only files)
- **bidirectional**: Merges both repos (api files override, no deletions)
- **status**: Shows differences without making changes (safe preview)

**Features**:
- Colored output for easy reading
- File-by-file sync progress
- Automatic directory creation
- Git directory checking
- Timestamp-based commit messages
- Handles both main/master branches

**Configuration**:
- Website directory: `/Users/kuhandransamudrapandiyan/Projects/kuhan_website`
- API directory: `/Users/kuhandransamudrapandiyan/Projects/portfolio-data-api`

To change directories, edit lines 28-29 in `sync-public-folder.sh`

**Example Workflows**:

Daily Development:
```bash
# Morning: Check for changes
npm run sync:status

# Work on website...

# Evening: Sync to api
npm run sync:website-to-api-push
```

Pre-Deployment:
```bash
npm run sync:bidirectional-push
npm run build
npm run start
```

Scheduled Sync (via cron):
```bash
crontab -e
# Add: 0 23 * * * cd ~/Projects/kuhan_website && npm run sync:website-to-api-push
```

---

### `setup-git-hooks.sh`
**Purpose**: Automatically installs git hooks for sync notifications.

**Usage**:
```bash
npm run hooks:setup
# or
./scripts/setup-git-hooks.sh
```

**What It Does**:
- ✅ Installs pre-commit hook (checks for public folder changes before committing)
- ✅ Installs post-merge hook (notifies about public folder changes after merge)
- ✅ Makes hooks executable
- ✅ Shows installation summary

**Git Hooks Installed**:

1. **Pre-commit Hook**: Runs before each commit
   - Checks if public folder changes are being committed
   - Shows notification if changes detected
   - Doesn't block commit, just notifies

2. **Post-merge Hook**: Runs after git merge
   - Detects if public folder was modified in merge
   - Suggests running sync:status to check differences
   - Helpful for team workflows

**Benefits**:
- Never forget to sync again
- Automatic reminders on commits
- Team-aware sync notifications
- Zero configuration after setup

---

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
