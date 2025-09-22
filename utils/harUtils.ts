import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves and ensures the directory for a HAR file.
 * @param {string} filename - The HAR file name.
 * @returns {string} - The full path to the HAR file.
 */
export function getHarPath(filename: string): string {
  const harPath = path.resolve(__dirname, `../../har/${filename}`);
  fs.mkdirSync(path.dirname(harPath), { recursive: true });
  return harPath;
}

