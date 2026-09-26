import { defineConfig, devices } from '@playwright/test';

// One project per viewport from the Track 1 plan. A test runs in the
// project whose tag (@320, @390, ...) is in its title.
export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'https://whipscribe.com' },
  projects: [
    {
      name: 'mobile-320',
      grep: /@320/,
      use: { ...devices['Pixel 7'], viewport: { width: 320, height: 568 } },
    },
    { name: 'mobile-390', grep: /@390/, use: { ...devices['iPhone 14'] } },
    { name: 'mobile-412', grep: /@412/, use: { ...devices['Pixel 7'] } },
    { name: 'desktop-1280', grep: /@1280/, use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'desktop-1440', grep: /@1440/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
