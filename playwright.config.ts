import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'todo-chromium',
      testMatch: '**/todo-app.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://demo.playwright.dev' },
    },
    {
      name: 'todo-firefox',
      testMatch: '**/todo-app.spec.ts',
      use: { ...devices['Desktop Firefox'], baseURL: 'https://demo.playwright.dev' },
    },
    {
      name: 'todo-webkit',
      testMatch: '**/todo-app.spec.ts',
      use: { ...devices['Desktop Safari'], baseURL: 'https://demo.playwright.dev' },
    },
    {
      name: 'json-api',
      testMatch: '**/json-api.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://jsonplaceholder.typicode.com' },
    },
  ],
});
