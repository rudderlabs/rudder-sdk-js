import { defineConfig, devices } from '@playwright/test';
import config from './config.js';

export default defineConfig({
  testDir: './tests',
  // Cookies are shared browser state, so the specs must not race each other
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,
  reporter: [['list']],
  use: {
    baseURL: config.pageUrl,
    trace: 'retain-on-failure',
    // Each spec starts from a clean jar so first-visit and repeat-visit cases stay honest
    storageState: undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node ./start-harness.js',
    url: config.pageUrl,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
