const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'public', '_redirects');
const targetFile = path.join(__dirname, 'www', '_redirects');

try {
  // Ensure the www directory exists
  if (!fs.existsSync(path.dirname(targetFile))) {
    console.log('www directory does not exist. Make sure to run ionic build first.');
    process.exit(1);
  }

  // Copy the file
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✅ _redirects file copied to www folder successfully!');
} catch (error) {
  console.error('❌ Error copying _redirects file:', error.message);
  process.exit(1);
} 