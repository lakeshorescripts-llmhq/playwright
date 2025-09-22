import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';

export class BaseTest {
  protected homePage: HomePage;
  protected categoryPage: CategoryPage;

  constructor(protected page: any) {
    this.homePage = new HomePage(page);
    this.categoryPage = new CategoryPage(page);
  }

  async setup() {
    await this.page.context().clearCookies();
    await this.page.reload();
    await this.homePage.navigateTo();
    await this.homePage.closeConsentBanner();
    await expect(this.page.locator('#onetrust-group-container')).not.toBeVisible();
  }

  async teardown() {
    await this.page.context().clearCookies();
  }
}