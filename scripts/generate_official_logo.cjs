const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ============================================================================
// OFFICIAL JEEVAN JYOTI FOUNDATION GHAZIPUR LOGO & SEAL SYNC
// Keeps all static PWA icons, favicon and logo synchronized with authentic assets
// ============================================================================

async function run() {
  const rootDir = path.join(__dirname, '..');
  const uploadsLogo = path.join(rootDir, 'public/uploads/ngo_logo.png');
  const uploadsSeal = path.join(rootDir, 'public/uploads/official_seal.png');

  if (!fs.existsSync(uploadsLogo) || !fs.existsSync(uploadsSeal)) {
    console.log('Uploads not found, skipping sync.');
    return;
  }

  const logo = sharp(uploadsLogo);
  const seal = sharp(uploadsSeal);

  // Targets to sync in public/
  await logo.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/pwa-icon-512.png'));
  await logo.clone().resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/pwa-icon-192.png'));
  await logo.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/pwa-icon-maskable-512.png'));
  await logo.clone().resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/pwa-icon-maskable-192.png'));
  await logo.clone().resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/apple-touch-icon.png'));
  await logo.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/default-pwa-icon-512.png'));
  await logo.clone().resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/default-pwa-icon-192.png'));
  await logo.clone().resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(rootDir, 'public/default-apple-touch-icon.png'));
  await logo.clone().toFile(path.join(rootDir, 'public/logo.png'));
  await seal.clone().toFile(path.join(rootDir, 'public/official-seal.png'));

  // Also sync to dist if dist exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    await logo.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(distDir, 'pwa-icon-512.png'));
    await logo.clone().resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(distDir, 'pwa-icon-192.png'));
    await logo.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(distDir, 'pwa-icon-maskable-512.png'));
    await logo.clone().resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(distDir, 'pwa-icon-maskable-192.png'));
    await logo.clone().resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(distDir, 'apple-touch-icon.png'));
    await logo.clone().toFile(path.join(distDir, 'logo.png'));
    await seal.clone().toFile(path.join(distDir, 'official-seal.png'));

    if (fs.existsSync(path.join(rootDir, 'public/manifest.json'))) {
      fs.copyFileSync(path.join(rootDir, 'public/manifest.json'), path.join(distDir, 'manifest.json'));
    }
    if (fs.existsSync(path.join(rootDir, 'public/manifest.webmanifest'))) {
      fs.copyFileSync(path.join(rootDir, 'public/manifest.webmanifest'), path.join(distDir, 'manifest.webmanifest'));
    }
    if (fs.existsSync(path.join(rootDir, 'public/sw.js'))) {
      fs.copyFileSync(path.join(rootDir, 'public/sw.js'), path.join(distDir, 'sw.js'));
    }
  }

  console.log('✅ ALL ICONS AND MANIFEST SYNCHRONIZED WITH AUTHENTIC NGO LOGO AND OFFICIAL SEAL!');
}

run().catch(console.error);
