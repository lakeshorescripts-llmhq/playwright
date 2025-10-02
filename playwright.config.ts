import { defineConfig, expect, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();



export default defineConfig({
  testDir: './tests',
  timeout: process.env.CI ? 60000 : 30000, // Longer timeout in CI
  fullyParallel: true, // Enable parallel execution
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0, // More retries in CI
  workers: process.env.CI ? 4 : 2, // Adjust based on environment
  
  
  globalSetup: './global-setup', // ✅ fixed


  snapshotDir: './screenshots', // Custom folder for screenshots

  reporter: [
    ['list'],
    ['html', { 
      outputFolder: 'playwright-report', 
      open: 'on-failure',
    }],
    ['json', { 
      outputFile: 'test-results/test-results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results/junit-results.xml' 
    }]
  ],

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
    baseURL: process.env.BASE_URL || '',

    
  
    
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
    extraHTTPHeaders: {
      'react-pdp-2': 'false',
    },
   },

   
  projects: [
    // Desktop browsers
    {
      name: 'Chrome Desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--disable-gpu', '--no-sandbox', '--disable-web-security']
        }
      },
    },
    /*
    {
      name: 'Firefox Desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Safari Desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    // Tablet devices
    {
      name: 'iPad Pro',
      use: {
        ...devices['iPad Pro 11'],
        contextOptions: {
          reducedMotion: 'reduce',
        }
      },
    },
    // Mobile devices
    {
      name: 'iPhone',
      use: {
        ...devices['iPhone 13'],
        contextOptions: {
          reducedMotion: 'reduce',
        }
      },
    },
    {
      name: 'Pixel',
      use: {
        ...devices['Pixel 5'],
        contextOptions: {
          reducedMotion: 'reduce',
        }
      },
    }
    */
  ],

});