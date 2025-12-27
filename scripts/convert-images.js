import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imageDir = 'public/image';
const outputDir = imageDir;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all PNG and JPG files
const files = fs.readdirSync(imageDir).filter(f => 
  /\.(png|jpg|jpeg)$/i.test(f)
);

console.log(`\n📦 Starting image conversion...\n`);
console.log(`Found ${files.length} images to convert\n`);

let converted = 0;
let skipped = 0;
let failed = 0;

files.forEach((file) => {
  const inputPath = path.join(imageDir, file);
  const outputWebp = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const filename = path.basename(file);

  // Skip if already converted
  if (fs.existsSync(outputWebp)) {
    console.log(`⏭️  SKIP: ${filename} (already converted)`);
    skipped++;
    return;
  }

  // Convert to WebP
  sharp(inputPath)
    .webp({ quality: 75, effort: 6 })
    .toFile(outputWebp)
    .then(info => {
      const originalSize = fs.statSync(inputPath).size / 1024;
      const newSize = info.size / 1024;
      const savings = ((1 - info.size / fs.statSync(inputPath).size) * 100).toFixed(1);
      
      console.log(`✅ ${filename}`);
      console.log(`   Original: ${originalSize.toFixed(1)} KiB`);
      console.log(`   WebP:     ${newSize.toFixed(1)} KiB`);
      console.log(`   Savings:  ${savings}%\n`);
      
      converted++;
    })
    .catch(err => {
      console.error(`❌ FAILED: ${filename}`);
      console.error(`   Error: ${err.message}\n`);
      failed++;
    });
});

// Wait for all conversions to complete
setTimeout(() => {
  console.log('\n' + '═'.repeat(60));
  console.log('🎉 IMAGE CONVERSION COMPLETE\n');
  console.log(`✅ Converted: ${converted}`);
  console.log(`⏭️  Skipped:   ${skipped}`);
  console.log(`❌ Failed:    ${failed}`);
  console.log('═'.repeat(60) + '\n');
  
  if (converted > 0) {
    console.log('📊 Next Steps:');
    console.log('   1. npm run build');
    console.log('   2. npm start');
    console.log('   3. Open http://localhost:3000');
    console.log('   4. Chrome DevTools → Lighthouse → Analyze\n');
  }
}, files.length * 100);
