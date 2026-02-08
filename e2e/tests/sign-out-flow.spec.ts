import { test, expect } from '../fixtures/auth.fixture';
import { test as baseTest } from '@playwright/test';

test.describe('Sign Out Flow', () => {
  test('sign out shows login screen', async ({ authenticatedPage: page }) => {
    // Verify we're logged in
    await expect(page.getByTestId('board-status')).toHaveText('READY');

    // Click sign out
    await page.getByTestId('sign-out-button').click();

    // Should return to login screen
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('h1', { hasText: 'Quorum' })).toBeVisible();
  });

  test('sign out clears localStorage session', async ({ authenticatedPage: page }) => {
    // Send a message first
    await page.getByTestId('chat-input').fill('Test message before sign out');
    await page.getByTestId('send-button').click();
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });

    // Verify localStorage has session data
    const sessionBefore = await page.evaluate(() => localStorage.getItem('quorum_session'));
    expect(sessionBefore).toBeTruthy();

    // Sign out
    await page.getByTestId('sign-out-button').click();
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 10_000 });

    // Session should be cleared
    const sessionAfter = await page.evaluate(() => localStorage.getItem('quorum_session'));
    expect(sessionAfter).toBeNull();
  });
});

baseTest.describe('Auth Protection', () => {
  baseTest('cannot access app without auth', async ({ page }) => {
    // Clear any stored auth state
    await page.goto('/app.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should show login screen, not the app
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 15_000 });

    // Board status should NOT be visible (not authenticated)
    await expect(page.getByTestId('board-status')).not.toBeVisible();
  });
});
