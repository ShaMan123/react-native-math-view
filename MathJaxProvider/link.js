
const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const assetsDir = path.resolve(__dirname, '../android/src/main/assets');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);
fs.copyFileSync(path.resolve(sourceDir, 'index.html'), path.resolve(assetsDir, 'index.html'));
if (!fs.existsSync(path.resolve(assetsDir, 'dist'))) fs.mkdirSync(path.resolve(assetsDir, 'dist'));
fs.copyFileSync(path.resolve(sourceDir, 'dist/bundle.js'), path.resolve(assetsDir, 'dist/bundle.js'));

console.log('linked successfully');