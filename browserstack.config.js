require('dotenv').config();

module.exports = {
  server: 'https://hub-cloud.browserstack.com',
  username: process.env.BROWSERSTACK_USERNAME,
  password: process.env.BROWSERSTACK_ACCESS_KEY,

  capabilities: [
    {
      browser: 'playwright-webkit',
      os: 'ios',
      os_version: '16',
      device: 'iPhone 14',
      real_mobile: true,
      name: 'E2E Test - iPhone 14 Safari',
      build: 'Playwright Build 1',
      project: 'Playwright E2E Tests',
      'browserstack.local': false,
      'browserstack.localIdentifier': 'myTestTunnel',
      'browserstack.debug': true,
      'browserstack.networkLogs': true,
      'browserstack.console': 'info',
      'browserstack.baseURL': 'https://wwwtest.lakeshorelearning.com'
    },
    {
      browser: 'playwright-chromium',
      os: 'android',
      os_version: '13.0',
      device: 'Samsung Galaxy S22',
      real_mobile: true,
      name: 'E2E Test - Galaxy S22 Chrome',
      build: 'Playwright Build 1',
      project: 'Playwright E2E Tests',
      'browserstack.local': false,
      'browserstack.localIdentifier': 'myTestTunnel',
      'browserstack.debug': true,
      'browserstack.networkLogs': true,
      'browserstack.console': 'info',
      'browserstack.baseURL': 'https://wwwtest.lakeshorelearning.com'
    },
    {
      browser: 'playwright-chromium',
      os: 'Windows',
      os_version: '11',
      name: 'E2E Test - Windows Chrome',
      build: 'Playwright Build 1',
      project: 'Playwright E2E Tests',
      'browserstack.local': false,
      'browserstack.localIdentifier': 'myTestTunnel',
      'browserstack.debug': true,
      'browserstack.networkLogs': true,
      'browserstack.console': 'info',
      'browserstack.baseURL': 'https://wwwtest.lakeshorelearning.com'
    },
    {
      browser: 'playwright-webkit',
      os: 'OS X',
      os_version: 'Ventura',
      name: 'E2E Test - macOS Safari',
      build: 'Playwright Build 1',
      project: 'Playwright E2E Tests',
      'browserstack.local': false,
      'browserstack.localIdentifier': 'myTestTunnel',
      'browserstack.debug': true,
      'browserstack.networkLogs': true,
      'browserstack.console': 'info',
      'browserstack.baseURL': 'https://wwwtest.lakeshorelearning.com'
    }
  ],

  testObservability: {
    enabled: false
  }
};
