import { defineConfig, devices } from '@playwright/test';
import { testPlanFilter } from 'allure-playwright/dist/testplan';
import * as os from 'os';


export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  grep: testPlanFilter(),
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        suiteTitle: false,
        outputFolder: "reports/allure-results",
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  timeout: 5 * 60 * 1000,
  use: {
    baseURL: 'https://enotes.pointschool.ru/',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
