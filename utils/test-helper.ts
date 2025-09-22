import { Page, TestInfo, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class TestHelper {
  constructor(private page: Page, private testInfo: TestInfo) {}

  /**
   * Capture screenshot on failure with additional context
   */
  async captureFailure(error: Error, context: string = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(
      'test-results',
      'failures',
      `${this.testInfo.title}-${timestamp}.png`
    );

    // Ensure directory exists
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

    // Capture screenshot
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    // Log error context
    console.error(`
Test Failed: ${this.testInfo.title}
Error: ${error.message}
Context: ${context}
Screenshot: ${screenshotPath}
Stack: ${error.stack}
    `);
  }

  /**
   * Retry a flaky operation with exponential backoff
   */
  async retry<T>(
    operation: () => Promise<T>,
    options: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      context?: string;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      context = ''
    } = options;

    let lastError: Error | undefined;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (attempt === maxAttempts) break;

        console.warn(`
Retry attempt ${attempt}/${maxAttempts}
Operation: ${context}
Error: ${error.message}
        `);

        await this.page.waitForTimeout(delay);
        delay = Math.min(delay * 2, maxDelay);
      }
    }

    throw new Error(`
Operation failed after ${maxAttempts} attempts
Context: ${context}
Last error: ${lastError?.message}
    `);
  }

  /**
   * Enhanced expect with custom error messages
   */
  async expectWithContext(
    actual: any,
    expected: any,
    context: string,
    customMessage?: string
  ) {
    try {
      expect(actual).toBe(expected);
    } catch (error: any) {
      const message = customMessage || `
Context: ${context}
Expected: ${expected}
Actual: ${actual}
      `;
      throw new Error(message);
    }
  }
}