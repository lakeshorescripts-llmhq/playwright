import { defineConfig, expect, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();



export default defineConfig({
  testDir: './tests',
    timeout: 30000,
  // Optional: run projects sequentially or parallel
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  //retries: 1,
  workers: process.env.CI ? 4 : undefined,
  //workers: 3,
  
  
  globalSetup: './global-setup', // ✅ fixed


  snapshotDir: './screenshots', // Custom folder for screenshots

  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'on-failure' }]],

  /*
  reporter: [
  ['html', { open: 'on-failure' }],
  ['prettier-playwright-msteams-report', {
    webhookUrl: 'https://your-valid-webhook-url',
    webhookType: 'msteams',
    title: 'Playwright Test Results',
    notifyOnSuccess: true,
    enableEmoji: true,
    linkToResultsUrl: 'https://ci.example.com/results',
    linkToResultsText: 'View CI Results',
    linkTextOnFailure: 'View Failure Details',
    linkUrlOnFailure: 'https://ci.example.com/failures',
    mentionOnFailure: ['qa.lead@example.com'],
    mentionOnFailureText: '{mentions} please check the failed tests!',
    debug: false,
    quiet: false,
    }],
  ],
  */


  expect: {
      timeout: 30000, // 30 seconds for all expect calls
    },

  use: {
    //baseURL: 'https://qa.llmhq.com/',
    baseURL: 'https://wwwtest.lakeshorelearning.com',
    //baseURL: 'https://prodsupport.llmhq.com/',
    
    httpCredentials: {
      username: process.env.PLAYWRIGHT_USERNAME || '',
      password: process.env.PLAYWRIGHT_PASSWORD || ''
    },

    

    headless: true,
    viewport: { width: 1280, height: 720 },
    
    ignoreHTTPSErrors: process.env.BROWSERSTACK ? false : true,
    // Or explicitly for BrowserStack
    ...(process.env.BROWSERSTACK && {
    ignoreHTTPSErrors: false
    }),
    
    //ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    launchOptions: {
      slowMo: 500,
      timeout: 30000,
    },
    
    // Persisting authentication state
    //storageState: 'storage/state.json',
    
    // to display PDP1.0 on UAT
    // extraHTTPHeaders: {
    //   'react-pdp-2': 'false',
    // },
   },

   
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'WebKit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

});