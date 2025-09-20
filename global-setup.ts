import { scanDirectoryRecursive } from './validate-files';
import fs from 'fs';
import path from 'path';

export default async () => {
  console.log('🔍 Running file security validation...');

  const directoriesToScan = ['./data', './fixtures', './logs', './quarantine'];

  for (const dir of directoriesToScan) {
    const resolved = path.resolve(dir);
    if (!fs.existsSync(resolved)) {
      fs.mkdirSync(resolved, { recursive: true });
      console.warn(`📁 Created missing directory: ${resolved}`);
    }
  }

  // Scan only the allowed test data directories
  scanDirectoryRecursive('./data');
  scanDirectoryRecursive('./fixtures');
};
