import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'html',

  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',

  use: {
    baseURL: 'http://localhost:3847',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@responsive/,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      grep: /@responsive/,
    },
  ],

  webServer: {
    command: 'npx tsx e2e/helpers/server.ts',
    port: 3847,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
