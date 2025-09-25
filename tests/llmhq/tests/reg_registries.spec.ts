import { test, expect } from '@playwright/test';
import { RegistriesPage } from '../pages/RegistriesPage';
import { HomePage } from '../pages/HomePage'; // Example alternative path if needed

test.describe('Registries Page Regression Tests', () => {

    

    let home: HomePage;
    let registriesPage: RegistriesPage;

    test.beforeEach(async ({ pxage }) => {
        home = new HomePage(page);
        registriesPage = new RegistriesPage(page);
        await home.closeConsentBanner();
        await registriesPage.navigateTo();
        
    });


    test('should navigate to the Registries page successfully', async () => {
        await expect(registriesPage.registriesPageTitle()).toBeVisible();
        await expect(registriesPage.page).toHaveURL(/.*registries/);
        
    });

    test('should allow creating a new registry', async () => {
        const registryName = `Test Registry ${Date.now()}`;
        const eventDate = '12/25/2025'; // Example date

        await registriesPage.createNewRegistry(registryName, eventDate);

        // Assuming some success message or redirection after creation
        await expect(registriesPage.page.locator('text=Registry created successfully')).toBeVisible();
        // Further assertions could be added to verify the registry details are displayed
    });

    test('should allow finding an existing registry', async () => {
        // This test assumes a registry already exists or is created as part of setup
        // For a real scenario, you might create a registry in a beforeEach or use a known test registry ID
        const existingRegistryQuery = 'playwright test'; // Placeholder

        await registriesPage.findRegistryAndVerify(existingRegistryQuery, [existingRegistryQuery]);

        await expect(registriesPage.registryDetailsSection()).toBeVisible();
        await expect(registriesPage.registryDetailsSection()).toContainText(existingRegistryQuery);
    });

    test('should display error for invalid registry creation', async () => {
        // Attempt to create a registry with invalid data (e.g., missing required fields)
        await registriesPage.createNewRegistry('', ''); // Empty name and date

        // Assuming an error message appears
        await expect(registriesPage.page.locator('text=Please fill out all required fields')).toBeVisible();
    });

    test('should display message for non-existent registry search', async () => {
        const nonExistentQuery = 'NonExistentRegistry123';
        await registriesPage.findRegistryAndVerify(nonExistentQuery, []);

        // Assuming a "no results" message appears
        await expect(registriesPage.page.locator('text=No registries found')).toBeVisible();
    });
});