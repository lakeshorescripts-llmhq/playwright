import { Page, Locator, expect } from '@playwright/test';

export interface PageComponent {
  rootLocator: Locator;
  isVisible(): Promise<boolean>;
}

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a locator to be visible with custom timeout
   */
  async waitForVisible(locator: Locator, timeout?: number) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click an element and wait for navigation
   */
  async clickAndWaitForNavigation(locator: Locator) {
    await Promise.all([
      this.page.waitForNavigation(),
      locator.click()
    ]);
  }

  /**
   * Get text content with retry
   */
  async getTextContent(locator: Locator, timeout = 5000): Promise<string | null> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return await locator.textContent();
    } catch (error) {
      return null;
    }
  }

  /**
   * Fill input field with retry mechanism
   */
  async fillInput(locator: Locator, value: string, options = { force: false }) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value, options);
    const actualValue = await locator.inputValue();
    if (actualValue !== value) {
      await locator.clear();
      await locator.fill(value, options);
    }
  }

  /**
   * Take screenshot of specific element
   */
  async screenshotElement(locator: Locator, name: string) {
    await locator.screenshot({
      path: `./screenshots/${name}-${Date.now()}.png`
    });
  }
}