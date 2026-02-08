import { test, expect } from '@playwright/test';
import { TEST_USER } from '../helpers/firebase-auth.helper';

test.describe('API Key Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.goto('/app.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for login screen and sign in
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill(TEST_USER.password);
    await page.getByTestId('email-submit').click();
  });

  test('modal appears after login when no API key', async ({ page }) => {
    await expect(page.getByTestId('api-key-input')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('API Key Required')).toBeVisible();
  });

  test('Activate Board disabled when input is empty', async ({ page }) => {
    await expect(page.getByTestId('api-key-input')).toBeVisible({ timeout: 15_000 });
    // Clear the input
    await page.getByTestId('api-key-input').fill('');
    await expect(page.getByTestId('activate-board-button')).toBeDisabled();
  });

  test('enter and save API key closes modal and shows board', async ({ page }) => {
    await expect(page.getByTestId('api-key-input')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('api-key-input').fill('AIzaFakeTestKey123456');
    await page.getByTestId('activate-board-button').click();

    // Modal should close
    await expect(page.getByTestId('api-key-input')).not.toBeVisible({ timeout: 5_000 });
    // Board should be ready
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 10_000 });
  });

  test('API Key sidebar button re-opens modal', async ({ page }) => {
    // First, complete initial API key setup
    await expect(page.getByTestId('api-key-input')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('api-key-input').fill('AIzaFakeTestKey123456');
    await page.getByTestId('activate-board-button').click();
    await expect(page.getByTestId('api-key-input')).not.toBeVisible({ timeout: 5_000 });

    // Click API Key button in sidebar
    await page.getByTestId('api-key-button').click();
    await expect(page.getByTestId('api-key-input')).toBeVisible();
  });
});
