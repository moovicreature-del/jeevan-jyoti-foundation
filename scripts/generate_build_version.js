// ============================================================================
// JEEVAN JYOTI FOUNDATION - BUILD VERSION GENERATOR
// Automatically generates version.json with unique build timestamp
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const versionData = {
  version: '1.0.' + Math.floor(Date.now() / 1000),
  builtAt: new Date().toISOString(),
  timestamp: Date.now(),
  appName: 'Jeevan Jyoti Foundation Ghazipur',
  appId: 'c0a3d86e-a3c1-416a-b499-cba37a5f6fe2'
};

const jsonString = JSON.stringify(versionData, null, 2);

// Write to public/
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'version.json'), jsonString, 'utf-8');

// Write to dist/ if it exists
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'version.json'), jsonString, 'utf-8');

  // Also ensure public/data/synced_app_data.json is mirrored into dist/data/
  const publicSynced = path.join(rootDir, 'public/data/synced_app_data.json');
  const distDataDir = path.join(distDir, 'data');
  if (fs.existsSync(publicSynced)) {
    if (!fs.existsSync(distDataDir)) {
      fs.mkdirSync(distDataDir, { recursive: true });
    }
    fs.copyFileSync(publicSynced, path.join(distDataDir, 'synced_app_data.json'));
  }
}

console.log('✅ Generated version.json:', versionData.version, 'at', versionData.builtAt);
