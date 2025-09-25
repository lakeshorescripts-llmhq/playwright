import { Page } from '@playwright/test';

export class RegistriesPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators for common elements on a registries page
    registriesPageTitle = () => this.page.getByText('Manage Your Existing Registry'); // Confirmed locator for page title
    createNewRegistryButton = () => this.page.locator('button:has-text("Create New Registry")'); // Assuming a button
    findRegistryInput = () => this.page.locator('input[placeholder="Enter Registry Name or ID"]'); // Assuming a search input
    findRegistryButton = () => this.page.locator('button:has-text("Find Registry")'); // Assuming a search button
    registryDetailsSection = () => this.page.locator('.registry-details'); // Assuming a section to display details

    // Methods for common actions
    async navigateTo() {
        await this.page.goto('/registries/'); // Assuming the base URL is configured in playwright.config.ts
    }

    async createNewRegistry(registryName: string, eventDate: string) {
        await this.createNewRegistryButton().click();
        // Assuming a form appears after clicking 'Create New Registry'
        await this.page.locator('input[name="registryName"]').fill(registryName);
        await this.page.locator('input[name="eventDate"]').fill(eventDate);
        await this.page.locator('button:has-text("Submit")').click(); // Assuming a submit button
    }

    async findRegistryAndVerify(searchQuery: string, expectedResults: string[]) {
        await this.findRegistryInput().fill(searchQuery);
        await this.findRegistryButton().click();
        // Wait for results to load
        await this.page.waitForSelector('.registry-results', { timeout: 5000 });

        const results = await this.page.$$eval('.registry-result-item', items =>
            items.map(item => item.textContent?.trim() || '')
        );

        if (expectedResults.length === 0) {
            if (results.length === 0) {
                console.log(`✅ No results found for "${searchQuery}" as expected.`);
            } else {
                throw new Error(`❌ Expected no results for "${searchQuery}", but found some.`);
            }
        } else {
            for (const expected of expectedResults) {
                if (!results.some(result => result.includes(expected))) {
                    throw new Error(`❌ Expected result "${expected}" not found for query "${searchQuery}".`);
                }
            }
            console.log(`✅ Results verified for "${searchQuery}".`);
        }
    }


}