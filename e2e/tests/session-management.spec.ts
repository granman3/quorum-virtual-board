import { test, expect } from '../fixtures/auth.fixture';

test.describe('Session Management', () => {
  test('messages persist across page reload', async ({ authenticatedPage: page }) => {
    // Send a message
    await page.getByTestId('chat-input').fill('What is our burn rate?');
    await page.getByTestId('send-button').click();

    // Wait for all responses
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });
    await expect(page.getByRole('paragraph').filter({ hasText: 'What is our burn rate?' })).toBeVisible();

    // Reload the page — messages should persist from localStorage
    await page.reload();

    // Wait for app to load
    await expect(page.getByTestId('board-status')).toBeVisible({ timeout: 15_000 });

    // Original user message should still be there
    await expect(page.getByRole('paragraph').filter({ hasText: 'What is our burn rate?' })).toBeVisible();
  });

  test('New Session clears messages and shows empty state', async ({ authenticatedPage: page }) => {
    // Send a message first
    await page.getByTestId('chat-input').fill('Test message for session');
    await page.getByTestId('send-button').click();
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });

    // New Session button should appear
    await expect(page.getByTestId('new-session-button')).toBeVisible();
    await page.getByTestId('new-session-button').click();

    // Messages should be cleared
    await expect(page.getByText('Test message for session')).not.toBeVisible();

    // Empty state with scenarios should reappear
    await expect(page.getByText('Quorum Executive Board')).toBeVisible({ timeout: 5_000 });
  });

  test('session topic appears in breadcrumb', async ({ authenticatedPage: page }) => {
    await page.getByTestId('chat-input').fill('What about international expansion plans');
    await page.getByTestId('send-button').click();

    // Topic should appear in the header breadcrumb (first ~6 words)
    await expect(page.locator('header').getByText(/What about international/)).toBeVisible({ timeout: 5_000 });
  });
});
