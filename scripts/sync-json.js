#!/usr/bin/env node

/**
 * Sync JSON files from CDN to local public/data/ folder
 * Usage: npm run sync-json
 * 
 * This script downloads all JSON files from static.kuhandranchatbot.info/data/
 * and saves them to public/data/ for development mode usage.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CDN_BASE_URL = 'https://static.kuhandranchatbot.info/data';
const LOCAL_DATA_DIR = path.join(__dirname, '..', 'public', 'data');

// List of JSON files to download
const JSON_FILES = [
  'projects.json',
  'experience.json',
  'skills.json',
  'education.json',
  'achievements.json',
  'contentLabels.json',
  'errorMessages.json'
];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

// Helper to log with colors
const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  debug: (msg) => console.log(`${colors.gray}  ${msg}${colors.reset}`)
};

// Create local data directory if it doesn't exist
function ensureDirectoryExists() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    log.success(`Created directory: ${LOCAL_DATA_DIR}`);
  }
}

// Download a single file from CDN
function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const url = `${CDN_BASE_URL}/${filename}`;
    const localPath = path.join(LOCAL_DATA_DIR, filename);

    log.debug(`Downloading: ${filename}`);

    https
      .get(url, (response) => {
        if (response.statusCode === 404) {
          log.warning(`File not found on CDN: ${filename}`);
          resolve({ filename, skipped: true });
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }

        const fileStream = fs.createWriteStream(localPath);

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(localPath);
          log.debug(`Saved: ${filename} (${formatBytes(stats.size)})`);
          resolve({ filename, success: true, size: stats.size });
        });

        fileStream.on('error', (err) => {
          fs.unlink(localPath, () => {}); // Delete on error
          reject(err);
        });
      })
      .on('error', reject);
  });
}

// Format bytes to human-readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Main sync function
async function syncJsonFiles() {
  console.log(`\n${colors.bright}📦 Syncing JSON files from CDN${colors.reset}\n`);
  log.info(`Source: ${CDN_BASE_URL}`);
  log.info(`Destination: ${LOCAL_DATA_DIR}\n`);

  ensureDirectoryExists();

  const results = [];
  let successCount = 0;
  let skipCount = 0;
  let totalSize = 0;

  for (const filename of JSON_FILES) {
    try {
      const result = await downloadFile(filename);
      results.push(result);

      if (result.skipped) {
        skipCount++;
      } else if (result.success) {
        successCount++;
        totalSize += result.size;
        log.success(`${filename} (${formatBytes(result.size)})`);
      }
    } catch (error) {
      log.error(`${filename} - ${error.message}`);
      results.push({ filename, error: error.message });
    }
  }

  // Summary
  console.log(`\n${colors.bright}Summary${colors.reset}`);
  console.log(
    `${colors.green}✓ Downloaded: ${successCount}${colors.reset} | ` +
    `${colors.yellow}⊘ Skipped: ${skipCount}${colors.reset} | ` +
    `Total: ${formatBytes(totalSize)}`
  );

  if (successCount > 0) {
    console.log(
      `\n${colors.green}${colors.bright}✓ Sync completed successfully!${colors.reset}`
    );
    log.info(`All files are ready for development mode (npm run dev)`);
    log.debug(`Using: http://localhost:3000/data/`);
  } else {
    console.log(
      `\n${colors.red}${colors.bright}✗ Sync failed - no files were downloaded${colors.reset}`
    );
    process.exit(1);
  }

  console.log('');
}

// Run the sync
syncJsonFiles().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
