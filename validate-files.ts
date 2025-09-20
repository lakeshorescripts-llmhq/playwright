import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface FileSecurityConfig {
  allowedExtensions: string[];
  restrictedPaths: string[];
  maxFileSizeMB: number;
  scanForSecrets: boolean;
  blockExecutableFiles: boolean;
  auditLogging: boolean;
  quarantineOnViolation: boolean;
  allowedDirectories: string[];
  requireChecksumValidation: boolean;
}

interface MCPConfig {
  fileSecurity: FileSecurityConfig;
}

const mcp: MCPConfig = JSON.parse(fs.readFileSync('./mcp.json', 'utf-8'));
const security = mcp.fileSecurity;

const secretPatterns: RegExp[] = [
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z\-_]{35}/,
  /-----BEGIN PRIVATE KEY-----/
];

function logAudit(message: string): void {
  if (security.auditLogging) {
    fs.appendFileSync('./logs/file-access.log', `[${new Date().toISOString()}] ${message}\n`);
  }
}

function quarantine(filePath: string, reason: string): void {
  if (security.quarantineOnViolation) {
    const dest = path.join('./quarantine', path.basename(filePath));
    fs.renameSync(filePath, dest);
    logAudit(`Quarantined ${filePath} due to: ${reason}`);
  }
}

function validateFile(filePath: string): void {
  try {
    const resolvedPath = path.resolve(filePath);
    const ext = path.extname(filePath);
    const stats = fs.statSync(filePath);

    if (!security.allowedExtensions.includes(ext)) {
      quarantine(filePath, `Disallowed extension: ${ext}`);
      throw new Error(`Disallowed extension: ${ext}`);
    }

    const blockedExts = ['.exe', '.sh', '.bat', '.cmd', '.msi'];
    if (security.blockExecutableFiles && blockedExts.includes(ext)) {
      quarantine(filePath, `Executable file blocked: ${ext}`);
      throw new Error(`Executable file blocked: ${ext}`);
    }

    const maxBytes = security.maxFileSizeMB * 1024 * 1024;
    if (stats.size > maxBytes) {
      quarantine(filePath, `File too large: ${stats.size} bytes`);
      throw new Error(`File too large: ${stats.size} bytes`);
    }

    for (const restricted of security.restrictedPaths) {
      if (resolvedPath.includes(path.resolve(restricted))) {
        quarantine(filePath, `Access to restricted path: ${restricted}`);
        throw new Error(`Access to restricted path: ${restricted}`);
      }
    }

    const allowedDirs = security.allowedDirectories.map(d => path.resolve(d));
    if (!allowedDirs.some(dir => resolvedPath.startsWith(dir))) {
      quarantine(filePath, `File not in allowed directory`);
      throw new Error(`File not in allowed directory`);
    }

    if (security.scanForSecrets) {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          quarantine(filePath, `Secret pattern detected`);
          throw new Error(`Secret pattern detected`);
        }
      }
    }

    if (security.requireChecksumValidation) {
      const hash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
      logAudit(`Checksum for ${filePath}: ${hash}`);
    }

    logAudit(`✅ File passed security check: ${filePath}`);
    console.log(`✅ File passed security check: ${filePath}`);
  } catch (err: any) {
    console.error(`❌ ${filePath}: ${err.message}`);
  }
}

export function scanDirectoryRecursive(dirPath: string): void {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectoryRecursive(fullPath);
    } else {
      validateFile(fullPath);
    }
  });
}
