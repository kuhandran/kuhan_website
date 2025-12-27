import chokidar from 'chokidar';
import { exec } from 'child_process';

// Watch the public folder for changes
const watcher = chokidar.watch('./public', {
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
  persistent: true,
});

console.log('Watching for changes in the public folder...');

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed. Refreshing server...`);
  exec('touch .next/BUILD_ID', (err) => {
    if (err) {
      console.error('Error refreshing server:', err);
    } else {
      console.log('Server refreshed successfully.');
    }
  });
});