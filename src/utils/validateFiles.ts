import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface FileValidationOptions {
  maxSizeMB: number;
  allowedExtensions: string[];
  restrictedPaths: string[];
  blockedExtensions: string[];
  scanForSecrets: boolean;
}

class FileValidator {
  private options: FileValidationOptions;

  constructor(options: FileValidationOptions) {
    this.options = options;
  }

  async validateFile(filePath: string): Promise<boolean> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Check restricted paths
      if (this.isInRestrictedPath(filePath)) {
        throw new Error(`File is in a restricted path: ${filePath}`);
      }

      // Check file extension
      const ext = path.extname(filePath).toLowerCase();
      if (!this.options.allowedExtensions.includes(ext)) {
        throw new Error(`Invalid file extension: ${ext}`);
      }

      if (this.options.blockedExtensions.includes(ext)) {
        throw new Error(`Blocked file extension: ${ext}`);
      }

      // Check file size
      const stats = fs.statSync(filePath);
      const fileSizeMB = stats.size / (1024 * 1024);
      if (fileSizeMB > this.options.maxSizeMB) {
        throw new Error(`File size exceeds ${this.options.maxSizeMB}MB`);
      }

      // Scan for secrets if enabled
      if (this.options.scanForSecrets) {
        const hasSecrets = await this.scanForSecrets(filePath);
        if (hasSecrets) {
          throw new Error('Potential secrets found in file');
        }
      }

      return true;
    } catch (error) {
      console.error(`Validation failed for ${filePath}:`, error);
      return false;
    }
  }

  private isInRestrictedPath(filePath: string): boolean {
    return this.options.restrictedPaths.some(restrictedPath =>
      filePath.startsWith(restrictedPath)
    );
  }

  private async scanForSecrets(filePath: string): Promise<boolean> {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const patterns = [
      /api[_-]?key[_-]?([0-9a-zA-Z]{32})/i,
      /password\s*=\s*['"][^'"]+['"]/i,
      /secret\s*=\s*['"][^'"]+['"]/i,
      /access[_-]?token[_-]?=\s*['"][^'"]+['"]/i,
      /aws[_-]?key[_-]?=\s*['"][^'"]+['"]/i,
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
    ];

    return patterns.some(pattern => pattern.test(content));
  }

  static hashFile(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }
}

export async function validateFiles(directory: string, options: FileValidationOptions) {
  const validator = new FileValidator(options);
  const results = new Map<string, boolean>();

  async function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        results.set(fullPath, await validator.validateFile(fullPath));
      }
    }
  }

  await processDirectory(directory);
  return results;
}