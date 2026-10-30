// ============================================================================
// JEEVAN JYOTI FOUNDATION - BUILD VERSION & GITHUB DATA SYNC GENERATOR
// Automatically generates version.json and synchronizes synced_app_data.json
// Ensures GitHub pushes instantly update client browser caches
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const nowIso = new Date().toISOString();
const versionTag = '1.0.' + Math.floor(Date.now() / 1000);

const versionData = {
  version: versionTag,
  builtAt: nowIso,
  timestamp: Date.now(),
  appName: 'Jeevan Jyoti Foundation Ghazipur',
  appId: 'c0a3d86e-a3c1-416a-b499-cba37a5f6fe2'
};

const jsonString = JSON.stringify(versionData, null, 2);

// 1. Write version.json to public/
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'version.json'), jsonString, 'utf-8');

// 2. Synchronize public/data/synced_app_data.json with latest timestamp and version
const publicDataDir = path.join(rootDir, 'public/data');
const publicSyncedJsonPath = path.join(publicDataDir, 'synced_app_data.json');

if (fs.existsSync(publicSyncedJsonPath)) {
  try {
    const syncedContent = JSON.parse(fs.readFileSync(publicSyncedJsonPath, 'utf-8'));
    syncedContent.syncedAt = nowIso;
    syncedContent.version = versionTag;

    // Ensure branding fields are clean if deleted
    if (syncedContent.homeContent) {
      if (syncedContent.homeContent.appLogoUrl && syncedContent.homeContent.appLogoUrl.includes('ngo_logo')) {
        syncedContent.homeContent.appLogoUrl = '';
      }
      if (syncedContent.homeContent.appThumbnailUrl && syncedContent.homeContent.appThumbnailUrl.includes('ngo_logo')) {
        syncedContent.homeContent.appThumbnailUrl = '';
      }
      if (syncedContent.homeContent.logoUrl) {
        delete syncedContent.homeContent.logoUrl;
      }
      if (syncedContent.homeContent.thumbnailUrl) {
        delete syncedContent.homeContent.thumbnailUrl;
      }
    }

    fs.writeFileSync(publicSyncedJsonPath, JSON.stringify(syncedContent, null, 2), 'utf-8');
    console.log('✅ Synchronized public/data/synced_app_data.json with timestamp:', nowIso);
  } catch (err) {
    console.warn('⚠️ Could not update public/data/synced_app_data.json:', err.message);
  }
}

// 3. Mirror all files to dist/ if dist exists
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'version.json'), jsonString, 'utf-8');

  // Copy synced_app_data.json to dist/data/
  const distDataDir = path.join(distDir, 'data');
  if (!fs.existsSync(distDataDir)) {
    fs.mkdirSync(distDataDir, { recursive: true });
  }
  if (fs.existsSync(publicSyncedJsonPath)) {
    fs.copyFileSync(publicSyncedJsonPath, path.join(distDataDir, 'synced_app_data.json'));
  }

  // Ensure public/uploads is fully mirrored to dist/uploads
  const publicUploads = path.join(rootDir, 'public/uploads');
  const distUploads = path.join(distDir, 'uploads');
  if (fs.existsSync(publicUploads)) {
    if (!fs.existsSync(distUploads)) {
      fs.mkdirSync(distUploads, { recursive: true });
    }
    const files = fs.readdirSync(publicUploads);
    for (const f of files) {
      try {
        const srcFile = path.join(publicUploads, f);
        const destFile = path.join(distUploads, f);
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
        }
      } catch {}
    }
  }

  // Ensure public/manager_secretary.webp is in dist/
  const managerWebp = path.join(rootDir, 'public/manager_secretary.webp');
  if (fs.existsSync(managerWebp)) {
    try {
      fs.copyFileSync(managerWebp, path.join(distDir, 'manager_secretary.webp'));
    } catch {}
  }
}

console.log('✅ Generated version.json:', versionData.version, 'at', versionData.builtAt);
