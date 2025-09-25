import { Page, expect } from '@playwright/test';
import { CategoryRole } from '../types/category';
import path from 'path/win32';
import fs from 'fs';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Methods for common actions
  async navigateTo() {
    console.log('🌐 Navigate to BASEURL');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.goto('/'); // Assuming the base URL is configured in playwright.config.ts
  }

  async clickGiftCards() {
    await this.page.getByLabel('Gift Cards').click();
  }

  async focusSearchField() {
    console.log('🔍 Focusing search field');
    await this.page.waitForLoadState('domcontentloaded');
    const searchField1 = this.page.getByTestId('search-product-input');
    const searchField2 = this.page.getByRole('textbox', { name: 'Search:' });
    
    if (await searchField1.isVisible()) {
      await searchField1.focus();
      await searchField1.click();
    }
    else if (await searchField2.isVisible()) {
      await searchField2.focus();
      await searchField2.click();
    }
    else {
      throw new Error('No search field is visible');
    }
  }

  async navigateToFurnitureTab() {
    console.log('🌐 Navigate to Furniture Tab');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.goto('/'); // Assuming the base URL is configured in playwright.config.ts
    await this.page.getByRole('link', { name: 'Lakeshore Furniture' }).click();
  }

  async clickSearchButtonFT() {
    console.log('Click furniture tab search button')
    await this.page.getByRole('list').filter({ hasText: 'Account 0 Cart Connect with' }).getByLabel('open search panel').click();
  }

  async navigateHP() {
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.goto('/');
      await expect(this.page).toHaveTitle(/Lakeshore/);
    } catch (error) {
      console.error('Error in navigateHP:', error);
      await this.page.screenshot({ path: 'navigateHP_error.png' });
      throw error;
    }
  }


  async navigateToCTL() {
    console.log('🌐 Navigating to the Clear the List page...');
    await this.page.goto('/clear-the-list/', { waitUntil: 'load' });
  }

  async acceptCookies() {
    console.log('🍪 Checking for Accept Cookies button...');
    await this.page.waitForLoadState('load');
    const acceptButton = this.page.getByRole('button', { name: 'Accept Cookies' });
    try {
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        console.log('✅ Accept Cookies button clicked.');
      } else {
        console.log('ℹ️ Accept Cookies button not visible, continuing...');
      }
    } catch {
      console.log('⚠️ Accept Cookies button not found, continuing...');
    }
  }

  async closeConsentBanner() {
    const customizeButton = this.page.getByRole('button', { name: 'Customize, Opens the' });
    const xButton = this.page.getByRole('button', { name: 'Close' }).last();
  
    await this.page.waitForTimeout(2000);
    // Wait for banner to appear (if it does)
    if (await customizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('🍪 Cookie banner detected. Clicking X to close consent banner...');
      // Wait for button to be enabled and click
      await expect(xButton).toBeEnabled();
      await xButton.click();

      // Wait for banner to disappear
      await expect(customizeButton).toBeHidden({ timeout: 10000 });
      console.log('✅ Cookie banner dismissed.');
    } else {
    console.log('🚫 No cookie banner found. Skipping...');
    }
  }



    

  async mobileClickNavButton() {
    console.log('📱 Clicking on mobile navigation button...');
    await this.page.waitForLoadState('load');
    await this.page.getByRole('button', { name: 'Open Navigation Menu' }).click();
    await this.page.locator('.open-menu').first().click(); // tap Shop All
    await this.page.locator('#mp-menu a', { hasText: /^Active Play$/ }).click(); // tap Active Play
    await this.page.locator('#mp-menu [id="Active Play"]').getByRole('link', { name: 'Shop All' }).click(); // tap Shop All
  }

  async clickLakeshoreFurnitureTab(){
    console.log('🪑 Clicking on "Lakeshore Furniture" tab...');
    await this.page.waitForLoadState('load');
    await this.page.getByRole('link', { name: 'Lakeshore Furniture' }).click();
    await expect(this.page).toHaveURL(/furniture/);
  }

  async hoverFurnitureTypes() {
    console.log('🛍 Hovering over "Furniture Types" in furniture tab main navigation menu...');
    await this.page.waitForLoadState('load');
    await this.page.getByRole('tab', { name: 'Furniture Types' }).getByRole('link').hover();
    await expect(this.page.getByRole('heading', { name: 'Furniture Types' })).toBeVisible();
  }

  async selectCategory(categoryName: Record<string, string>) {
    console.log(`📦 Clicking on "${categoryName.name}" category...`);
    await this.page.waitForLoadState('load');
    await this.page.click(`text=${categoryName.name}`);
    //await this.page.getByText('link', { name: categoryName, exact: true }).click();
    //await expect(this.page.getByRole('heading', { name: categoryName })).toBeVisible();
    //await expect(this.page).toHaveURL(new RegExp(`/category/${categoryName.toLowerCase().replace(/ /g, '-')}/`));
  }

  async selectSubCategory(subCategoryName: string){
    console.log(`📦 Selecting sub-category: ${subCategoryName}`);
    await this.page.waitForLoadState('load');
    await this.page.click(`text=${subCategoryName}`);
  }

  async performSearch(searchInput: string) {
    console.log(`🔍 Searching for: ${searchInput}`);
    await this.page.waitForLoadState('load');
    const searchFieldKO = this.page.getByRole('textbox', { name: 'Search:' });
    const searchFieldReact = this.page.getByTestId('search-product-input');
    if (await searchFieldKO.isVisible()) {
      await searchFieldKO.click();
      await this.page.waitForTimeout(1000);
      await searchFieldKO.fill(searchInput);
      await searchFieldKO.press('Enter');
      //await searchButtonKO.click();
    } else if (await searchFieldReact.isVisible()) {
      await searchFieldReact.click();
      await this.page.waitForTimeout(1000);
      await searchFieldReact.fill(searchInput);
      await searchFieldReact.press('Enter');
      //await searchButtonReact.click();
    } else {
      console.error('❌ Neither search field was visible.');
      throw new Error('Neither locator matched any visible element.');
    }
  }


  async inputSearchTerm(searchInput: string) {
    console.log(`🔍 Searching for: ${searchInput}`);
    await this.page.waitForLoadState('load');
    const searchFieldKO = this.page.getByRole('textbox', { name: 'Search:' });
    const searchFieldReact = this.page.getByTestId('search-product-input');
    if (await searchFieldKO.isVisible())  {
      await searchFieldKO.click(); //additional click for Furniture tab to display search panel
      await searchFieldKO.fill(searchInput, {timeout: 1000});
    } else if (await searchFieldReact.isVisible()) {
      await searchFieldReact.click();
      await searchFieldReact.fill(searchInput, {timeout: 1000});
    }
  }

  async clickSearchButton() {
    await this.page.waitForLoadState('load');
    const searchFieldKO = this.page.getByRole('textbox', { name: 'Search:' });
    const searchFieldReact = this.page.getByTestId('search-product-input');
    if (await searchFieldKO.isVisible()) {
      await searchFieldKO.press('Enter');
    } else if (await searchFieldReact.isVisible()) {
      await searchFieldReact.press('Enter');
    }
  }

  async pressEnterKey() {
    await this.page.waitForTimeout(1000);
    const searchFieldKO = this.page.getByRole('textbox', { name: 'Search:' });
    const searchFieldReact = this.page.getByTestId('search-product-input');
    if (await searchFieldKO.isVisible()) {
      await searchFieldKO.press('Enter');
    }
    else
      await searchFieldReact.press('Enter');
  }


  async clickStoresLinkFromHeader() {
    await this.page.waitForLoadState('load');
    await this.page.getByRole('link', { name: 'Stores' }).nth(0).click();
    await expect(this.page).toHaveURL(/stores\/locator/);
  }

  async clickQuickOrderLinkFromHeader(){
    await this.page.waitForLoadState('load');
    await this.page.getByRole('link', { name: 'Quick Order' }).click();
    await expect(this.page).toHaveURL(/quick-order/);
  }

  async signInFromHeader() {
    await this.page.goto('/', { waitUntil: 'load' });
    const accountIcon = this.page.getByTestId('signin-icon-link').nth(0);
    await expect(accountIcon).toBeVisible({ timeout: 15000 });
    await accountIcon.hover();
    const signInButton = this.page.getByRole('button', { name: 'Sign In', exact: true });
    await signInButton.click();
  }

  async enterSignInCredentials(auth: Record<string, string>) {
    await this.page.waitForLoadState('load');
    await expect(this.page.getByTestId('submit-button-signin')).toBeVisible();
    await this.page.getByTestId('input-signin-email').fill(auth.email);
    await this.page.getByTestId('input-signin-password').fill(auth.password);
    await this.page.getByTestId('submit-button-signin').click();
  }

  async createAccount() {
    console.log('🧪 Preparing to create a new account...');
    //await this.page.waitForLoadState('load');
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const newUserEmail = `qa-${timestamp}@llmhq.com`;
    const newUserPassword = 'aA#1234567';

    const storagePath = path.resolve('storage');
    const statePath = path.join(storagePath, 'state.json');
    const userInfoPath = path.join(storagePath, 'user.json');

    // Ensure storage folder exists
    // if (!fs.existsSync(storagePath)) {
    //   fs.mkdirSync(storagePath);
    // }
  
    // console.log('🧪 Creating a new account...');
  
    // // Check for existing state
    // if (fs.existsSync(statePath) && fs.statSync(statePath).size > 0) {
    //   try {
    //     const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    //     console.log('🔄 Existing state found. Proceeding...');
    //   } catch (error) {
    //     console.warn('⚠️ Failed to parse state.json. Skipping cookie clearing.');
    //   }
    // } else {
    //   // Create an empty state.json if it does exist
    //   if (fs.existsSync(statePath)) {
    //     fs.writeFileSync(statePath, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    //     console.log('📝 Created empty state.json.');

    //   } else {
    //     console.warn('⚠️ state.json is empty. Skipping cookie clearing.');
    //   }
    // }

    const accountIcon = this.page.getByTestId('signin-icon-link').nth(0);
    await expect(accountIcon).toBeVisible({ timeout: 15000 });
    await accountIcon.hover();
    await this.page.getByRole('button', { name: 'Create Account', exact: true }).click();
    await this.page.getByTestId('first-name-account').fill('new');
    await this.page.getByTestId('last-name-account').fill('user');
    await this.page.getByTestId('email-account').fill(newUserEmail);
    await this.page.getByTestId('input-pass-create').fill(newUserPassword);
    await this.page.getByTestId('phone-number-account').fill('1234567890');
    await this.page.getByTestId('postal-code-account').fill('90895');
    await this.page.locator('label').filter({ hasText: 'Classroom/Organization' }).locator('div').click();
    await this.page.getByTestId('keep-signed-in-account').check();
    await this.page.getByTestId('submit-button-create').click();
    await expect(this.page).toHaveURL('/my-account/');
    await expect(this.page.getByRole('main')).toContainText('Welcome, new! VIP Sign Out');
    await this.page.context().storageState({ path: statePath });
    fs.writeFileSync(userInfoPath, JSON.stringify({ email: newUserEmail, password: newUserPassword }, null, 2));
    console.log(`✅ Account created: ${newUserEmail}`);
  }
  
  async clickOrdersLink(){
    console.log('📦 Clicking on "Orders" link from header...');
    await this.page.waitForLoadState('load');
    const accountIcon = this.page.locator("//a[@id='signin-popover']/span[@class='signin-icon f-enabled']");
    await expect(accountIcon).toBeVisible({ timeout: 15000 });
    await accountIcon.hover();
    const ordersLink = this.page.getByRole('link', { name: 'Orders' });
    await expect(ordersLink).toBeVisible();
    await ordersLink.click();
    await expect(this.page).toHaveURL(/order-history/);
  }

    async clickListsLinkFromHeader(){
    console.log('📝 Clicking on "Lists" link from header...');
    await this.page.waitForLoadState('load');
    const listsLink = this.page.getByRole('link', { name: 'Lists' }).nth(0);
    await expect(listsLink).toBeVisible();
    await listsLink.click();
  }

  async hoverShopAll() {
    console.log('🛍 Hovering over "Shop All" in main navigation menu...');
    await this.page.waitForLoadState('load');
    await this.page.hover('text=Shop All');
  }

  async hoverMainNavLink(mainNavCategory: { role: CategoryRole, name: string }) {
    console.log(`🛍 Hovering over "${mainNavCategory.name}" in main navigation menu...`);
    await this.page.waitForLoadState('load');
    await this.page.getByRole(mainNavCategory.role, { name: mainNavCategory.name }).first().hover();
  }

  async selectCategoryLink(categoryName: { role: CategoryRole, name: string  }) {
    console.log(`📦 Clicking on "${categoryName.name}" category...`);
    await this.page.waitForLoadState('load');
    await this.page.getByRole(categoryName.role, { name: categoryName.name }).first().click();
    //await expect(this.page).toHaveURL(new RegExp(`/${categoryName.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}/`));
  }

  async signOutFromHeader(){
    console.log('🚪 Signing out from header...');
    await this.page.waitForLoadState('load');
    const accountIcon = this.page.locator("//a[@id='signin-popover']/span[@class='signin-icon f-enabled']");
    await expect(accountIcon).toBeVisible({ timeout: 15000 });
    await accountIcon.hover();
    await this.page.getByLabel('Sign Out').click();
  }

}
