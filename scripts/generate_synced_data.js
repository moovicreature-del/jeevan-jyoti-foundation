// ============================================================================
// JEEVAN JYOTI FOUNDATION - SYNCED APP DATA GENERATOR
// Ensures current data is preserved in code files so git push updates live links
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicDataDir = path.join(rootDir, 'public/data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const targetPath = path.join(publicDataDir, 'synced_app_data.json');

// If already exists with admin customizations, don't overwrite with defaults unless missing
if (!fs.existsSync(targetPath)) {
  const defaultSyncedData = {
    syncedAt: new Date().toISOString(),
    version: '1.0.0',
    syncedBy: 'System Auto-Sync',
    note: 'यह फ़ाइल एडमिन में किए गए सभी बदलावों को GitHub और लाइव लिंक के साथ स्वचालित रूप से सिंक रखती है।',
    paymentSettings: {
      upiId: 'jeevanjyoti.gzp@sbi',
      upiPayeeName: 'JEEVAN JYOTI FOUNDATION',
      bankAccountName: 'JEEVAN JYOTI FOUNDATION',
      bankAccountNumber: '718720110000323',
      bankIfsc: 'BKID0007187',
      bankName: 'BANK OF INDIA',
      bankBranch: 'Daudpur, Mohammadabad, Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)',
      panNumber: 'AAEAJ3141Q',
      urn10A: 'AAEAJ3141QE20231',
      nitiAayogUid: 'UP/2018/0207700',
      contactPhone: '+91-8052361666',
      contactEmail: 'jeevanjyotifoundationgzp@gmail.com',
      payuDonationUrl: 'https://u.payu.in/fJwCvOSIlICb'
    }
  };
  fs.writeFileSync(targetPath, JSON.stringify(defaultSyncedData, null, 2), 'utf-8');
  console.log('✅ Created initial public/data/synced_app_data.json');
}

// Copy to dist/data if dist exists
const distDataDir = path.join(rootDir, 'dist/data');
if (fs.existsSync(path.join(rootDir, 'dist'))) {
  if (!fs.existsSync(distDataDir)) {
    fs.mkdirSync(distDataDir, { recursive: true });
  }
  if (fs.existsSync(targetPath)) {
    fs.copyFileSync(targetPath, path.join(distDataDir, 'synced_app_data.json'));
  }
}
