import { Locator, Page } from '@playwright/test';
import { PageComponent } from './BasePage';

export class Header implements PageComponent {
  readonly rootLocator: Locator;
  readonly searchInput: Locator;
  readonly cartIcon: Locator;
  readonly accountMenu: Locator;
  readonly storeLocator: Locator;

  constructor(page: Page) {
    this.rootLocator = page.locator('header');
    this.searchInput = this.rootLocator.getByRole('searchbox');
    this.cartIcon = this.rootLocator.getByRole('link', { name: 'Cart' });
    this.accountMenu = this.rootLocator.getByRole('button', { name: 'Account' });
    this.storeLocator = this.rootLocator.getByRole('link', { name: 'Stores' });
  }

  async isVisible() {
    return await this.rootLocator.isVisible();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }
}

export class Footer implements PageComponent {
  readonly rootLocator: Locator;
  readonly links: Locator;
  readonly newsletter: Locator;

  constructor(page: Page) {
    this.rootLocator = page.locator('footer');
    this.links = this.rootLocator.getByRole('link');
    this.newsletter = this.rootLocator.getByRole('textbox', { name: 'Newsletter' });
  }

  async isVisible() {
    return await this.rootLocator.isVisible();
  }
}

export class LoadingSpinner implements PageComponent {
  readonly rootLocator: Locator;

  constructor(page: Page) {
    this.rootLocator = page.locator('.loading-spinner');
  }

  async isVisible() {
    return await this.rootLocator.isVisible();
  }

  async waitForHidden() {
    await this.rootLocator.waitFor({ state: 'hidden' });
  }
}

export class Toast implements PageComponent {
  readonly rootLocator: Locator;
  readonly message: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.rootLocator = page.locator('.toast');
    this.message = this.rootLocator.getByRole('alert');
    this.closeButton = this.rootLocator.getByRole('button', { name: 'Close' });
  }

  async isVisible() {
    return await this.rootLocator.isVisible();
  }

  async getMessageText() {
    return await this.message.textContent();
  }

  async dismiss() {
    if (await this.isVisible()) {
      await this.closeButton.click();
      await this.rootLocator.waitFor({ state: 'hidden' });
    }
  }
}