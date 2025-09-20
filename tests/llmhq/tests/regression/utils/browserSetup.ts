import { chromium, BrowserContextOptions, Browser } from '@playwright/test';
import UserAgent from 'user-agents';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sets up a Playwright browser context with optional HAR recording or replay.
 * @param {string} [harPath] - Path to the HAR file.
 * @param {boolean} [shouldRecordHar=false] - Whether to record HAR or replay it.
 * @returns {Promise<{ browser: Browser, context: any }>}
 */
export async function setupBrowserContext(harPath?: string, shouldRecordHar = false) {
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-web-security',
      '--disable-infobars',
      '--disable-extensions',
      '--start-maximized',
      '--window-size=1280,720'
    ]
  });

  const userAgent = new UserAgent({ deviceCategory: 'desktop' });

  const contextOptions: BrowserContextOptions = {
    userAgent: userAgent.toString(),
    viewport: { width: 1280, height: 720 }
  };

  if (shouldRecordHar && harPath) {
    contextOptions.recordHar = { path: harPath };
  }

  const context = await browser.newContext(contextOptions);

  if (!shouldRecordHar && harPath && fs.existsSync(harPath)) {
    await context.routeFromHAR(harPath, { update: false });
  }

  return { browser, context };
}
