# Shell Script Review & Analysis

**Date:** January 2, 2026  
**Status:** ⚠️ NEEDS FIXES  
**Scripts Reviewed:** 4 shell scripts in `scripts/` folder

---

## Executive Summary

**Syntax Status:** ✅ All scripts have valid bash syntax  
**Functional Status:** ⚠️ Critical issues found in sync script  
**Recommendation:** Fix dependency checks and improve error handling

---

## Scripts Overview

### 1. `sync-public-folder.sh` ⚠️ CRITICAL ISSUES
**Purpose:** Sync public folder between kuhan_website and portfolio-data-api repos  
**Status:** Has hardcoded dependencies that may not exist

#### Issues Found:

1. **CRITICAL: Hardcoded API Directory**
   ```bash
   API_DIR="/Users/kuhandransamudrapandiyan/Projects/portfolio-data-api"
   ```
   - Hardcoded to specific user path
   - Will FAIL if portfolio-data-api doesn't exist
   - Will FAIL on different machines/usernames
   - No validation before attempting sync

2. **Missing Dependency Check**
   - Script tries to sync to a directory that may not exist
   - No graceful degradation
   - Could delete files if rsync fails silently

3. **Lack of Actual Testing**
   - `check_directories()` validates directories BUT only logs errors
   - No actual rsync test to verify permissions
   - No verification that rsync is installed

#### Fix Required:

```bash
# BEFORE (Current - will fail):
API_DIR="/Users/kuhandransamudrapandiyan/Projects/portfolio-data-api"

# AFTER (Flexible):
API_DIR="${API_DIR:-/Users/kuhandransamudrapandiyan/Projects/portfolio-data-api}"
# Or better: Use environment variable or prompt user
```

---

### 2. `setup-git-hooks.sh` ✓ GOOD
**Purpose:** Setup git hooks for automatic sync notifications  
**Status:** Well-written, proper error handling

#### Strengths:
- ✅ Uses `set -e` for error handling
- ✅ Proper hardcoded git hooks directory
- ✅ Makes scripts executable
- ✅ Provides feedback

#### Minor Issue:
- Uses hardcoded website directory (same as sync script)

---

### 3. `RUN_LIGHTHOUSE_LOCALLY.sh` ✓ GOOD
**Purpose:** Guide for running Lighthouse audits locally  
**Status:** Information script, no execution issues

#### Strengths:
- ✅ Pure informational (no execution)
- ✅ Clear instructions
- ✅ Good formatting

#### Note:
- Not actually executed, just displays instructions
- No validation needed

---

### 4. `convert-images.js` ⚠️ ASYNC ISSUE
**Purpose:** Convert PNG/JPG to WebP format  
**Status:** Potential timing issues

#### Issues Found:

1. **Async Handling Problem**
   ```javascript
   files.forEach((file) => {
     // Async operations but no await
     sharp(inputPath)
       .webp(...)
       .toFile(outputWebp)
       // ... no proper await/Promise handling
   });

   setTimeout(() => {
     // Hope everything finished by then
   }, files.length * 100);
   ```
   - Uses `forEach` with async operations (bad pattern)
   - `setTimeout` hack instead of proper Promise handling
   - Could fail if processing takes longer than timeout

2. **Missing Error Handling**
   - Individual errors caught but don't stop execution
   - No summary of what actually succeeded

#### Fix Required:
```javascript
// Use Promise.all or async/await
const results = await Promise.all(
  files.map(file => convertImage(file))
);
```

---

### 5. `sync-json.js` ✓ GOOD
**Purpose:** Download JSON files from CDN to local public/data/  
**Status:** Well-implemented

#### Strengths:
- ✅ Proper error handling with `.catch()`
- ✅ Uses Promise-based approach
- ✅ Good logging with colors
- ✅ Directory validation before operations
- ✅ Timeout handling for downloads
- ✅ File size reporting

---

## Actual Facts from README.md

From `scripts/README.md`:

```
npm run sync:status              # Show differences (safe, read-only)
npm run sync:website-to-api      # Sync FROM website TO api
npm run sync:api-to-website      # Sync FROM api TO website
npm run sync:bidirectional       # Merge both (api files have priority)
npm run sync:website-to-api-push      # Sync + auto-commit + push
```

**BUT**: These npm scripts are NOT defined in `package.json`!

#### Verification:
```bash
grep -E "sync:|hooks:" package.json
# Result: (empty - commands don't exist!)
```

**This means users will get errors when running these commands!**

---

## Issues Summary

| Script | Issue | Severity | Fix Needed |
|--------|-------|----------|-----------|
| sync-public-folder.sh | Hardcoded paths, no API validation | 🔴 CRITICAL | Update error checking |
| sync-public-folder.sh | npm scripts not defined | 🔴 CRITICAL | Add to package.json |
| convert-images.js | Async/await improper handling | 🟡 HIGH | Refactor to async/await |
| setup-git-hooks.sh | Hardcoded paths | 🟡 MEDIUM | Use environment vars |
| RUN_LIGHTHOUSE_LOCALLY.sh | (informational only) | ✅ NONE | None |
| sync-json.js | (well-implemented) | ✅ NONE | None |

---

## Recommended Fixes

### 1. Update package.json with npm scripts

```json
{
  "scripts": {
    "sync:status": "bash ./scripts/sync-public-folder.sh status",
    "sync:website-to-api": "bash ./scripts/sync-public-folder.sh website->api",
    "sync:api-to-website": "bash ./scripts/sync-public-folder.sh api->website",
    "sync:bidirectional": "bash ./scripts/sync-public-folder.sh bidirectional",
    "sync:website-to-api-push": "bash ./scripts/sync-public-folder.sh website->api --push",
    "sync:api-to-website-push": "bash ./scripts/sync-public-folder.sh api->website --push",
    "sync:bidirectional-push": "bash ./scripts/sync-public-folder.sh bidirectional --push",
    "hooks:setup": "bash ./scripts/setup-git-hooks.sh",
    "convert-images": "node ./scripts/convert-images.js"
  }
}
```

### 2. Fix sync-public-folder.sh directory checking

```bash
# Current (FAILS if API doesn't exist):
if [ ! -d "$API_DIR" ]; then
    log_error "API directory not found: $API_DIR"
    exit 1
fi

# Should allow graceful skipping:
if [ ! -d "$API_DIR" ]; then
    log_warning "API directory not found: $API_DIR"
    log_info "Skipping API sync (optional)"
    if [ "$SYNC_DIRECTION" != "status" ] && [ "$SYNC_DIRECTION" != "website->api" ]; then
        exit 1
    fi
fi
```

### 3. Fix convert-images.js async handling

```javascript
// Use async/await instead of forEach + setTimeout
async function convertImages() {
  const conversions = files.map(file => convertImage(file));
  const results = await Promise.all(conversions);
  
  // Then show summary
  showSummary(results);
}
```

### 4. Add environment variables support

```bash
# Allow override of hardcoded paths:
WEBSITE_DIR="${WEBSITE_DIR:-/Users/kuhandransamudrapandiyan/Projects/kuhan_website}"
API_DIR="${API_DIR:-/Users/kuhandransamudrapandiyan/Projects/portfolio-data-api}"
```

---

## Testing Checklist

Before considering scripts "production ready":

- [ ] `sync-public-folder.sh status` - Works without API directory
- [ ] `sync-public-folder.sh status` - Handles missing rsync gracefully
- [ ] npm run sync:status - Defined in package.json
- [ ] npm run sync:bidirectional - Defined in package.json
- [ ] setup-git-hooks.sh - Creates hooks without errors
- [ ] npm run hooks:setup - Defined in package.json
- [ ] convert-images.js - Completes all conversions before exiting
- [ ] npm run convert-images - Defined in package.json
- [ ] All scripts work on different user paths (not hardcoded)

---

## Current Status

### ✅ What's Working:
- `sync-json.js` - Well-implemented
- `RUN_LIGHTHOUSE_LOCALLY.sh` - Good documentation
- Bash syntax - All scripts are syntactically valid

### ⚠️ What Needs Fixes:
1. **npm scripts not in package.json** - Users can't run commands as documented
2. **Hardcoded paths** - Will fail on different machines
3. **Missing dependency validation** - portfolio-data-api may not exist
4. **Improper async handling** - convert-images.js could timeout

### 🔴 Critical Issues:
1. Users follow README but npm commands don't exist
2. Sync script will fail if API directory doesn't exist
3. No way to override hardcoded directories

---

## Recommendations

**Priority 1 (Do Now):**
1. Add npm scripts to package.json
2. Add environment variable support to sync-public-folder.sh
3. Improve error handling for missing directories

**Priority 2 (Do Soon):**
1. Fix convert-images.js async handling
2. Add rsync validation before attempting sync
3. Test scripts on different machines/users

**Priority 3 (Nice to Have):**
1. Add verbose/debug mode option
2. Create pre-flight checks script
3. Add unit tests for script logic

---

## Conclusion

Scripts have good structure and documentation, but have **critical functional issues** that prevent them from working in the documented way. The main problems are:

1. **Documentation vs. Reality Gap**: README says use npm scripts, but they're not defined
2. **Path Hardcoding**: Won't work on different machines
3. **Missing Dependency Checks**: Assumes portfolio-data-api exists

**Recommendation**: Before using these scripts in production, implement the fixes listed above.

---

**Review Date:** January 2, 2026  
**Reviewer:** Code Quality Audit  
**Status:** ⚠️ Needs fixes before production use
