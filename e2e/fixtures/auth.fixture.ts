import { test as base, Page, expect } from '@playwright/test';
import { TEST_USER } from '../helpers/firebase-auth.helper';
import { MOCK_RESPONSES, createSSEResponse, AGENT_ORDER } from './mock-responses';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 1. Navigate to the app
    await page.goto('/app.html');

    // 2. Wait for login screen to appear
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 15_000 });

    // 3. Sign in with email/password
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill(TEST_USER.password);
    await page.getByTestId('email-submit').click();

    // 4. Wait for API key modal to appear (first-time login)
    await expect(page.getByTestId('api-key-input')).toBeVisible({ timeout: 15_000 });

    // 5. Enter a fake API key and activate
    await page.getByTestId('api-key-input').fill('AIzaFakeTestKey123456');
    await page.getByTestId('activate-board-button').click();

    // 6. Wait for the modal to close and board to be READY
    await expect(page.getByTestId('api-key-input')).not.toBeVisible({ timeout: 5_000 });
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 10_000 });

    // 7. Set up Gemini API route interception with mocked SSE responses
    let callCount = 0;
    await page.route('**/generativelanguage.googleapis.com/**', async (route) => {
      const agentKey = AGENT_ORDER[callCount % AGENT_ORDER.length];
      callCount++;
      const body = createSSEResponse(MOCK_RESPONSES[agentKey]);
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body,
      });
    });

    // 8. Provide the authenticated page
    await use(page);
  },
});

export { expect } from '@playwright/test';
