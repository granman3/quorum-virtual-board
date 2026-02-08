import { test, expect } from '@playwright/test';
import { TEST_USER } from '../helpers/firebase-auth.helper';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app.html');
    // Wait for login screen
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 15_000 });
  });

  test('login screen shows Quorum branding', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Quorum' })).toBeVisible();
    await expect(page.getByText('Virtual Board of Directors')).toBeVisible();
  });

  test('toggle between sign-in and sign-up modes', async ({ page }) => {
    // Initially in sign-in mode
    await expect(page.getByTestId('email-submit')).toHaveText('Sign In');
    await expect(page.getByTestId('auth-toggle')).toContainText("Don't have an account? Sign Up");

    // Toggle to sign-up
    await page.getByTestId('auth-toggle').click();
    await expect(page.getByTestId('email-submit')).toHaveText('Create Account');
    await expect(page.getByTestId('displayname-input')).toBeVisible();
    await expect(page.getByTestId('auth-toggle')).toContainText('Already have an account? Sign In');

    // Toggle back to sign-in
    await page.getByTestId('auth-toggle').click();
    await expect(page.getByTestId('email-submit')).toHaveText('Sign In');
    await expect(page.getByTestId('displayname-input')).not.toBeVisible();
  });

  test('sign in with existing email/password', async ({ page }) => {
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill(TEST_USER.password);
    await page.getByTestId('email-submit').click();

    // Should leave the login screen — either API key modal or board appears
    // Login screen email input should disappear once authenticated
    await expect(page.getByTestId('api-key-input')).toBeVisible({ timeout: 15_000 });
  });

  test('wrong password shows error', async ({ page }) => {
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill('WrongPassword999');
    await page.getByTestId('email-submit').click();

    await expect(page.getByTestId('auth-error')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('auth-error')).toContainText(/incorrect|failed|wrong/i);
  });

  test('invalid email shows error', async ({ page }) => {
    await page.getByTestId('email-input').fill('not-a-real-email@bad');
    await page.getByTestId('password-input').fill('SomePassword123');
    await page.getByTestId('email-submit').click();

    await expect(page.getByTestId('auth-error')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('auth-error')).toContainText(/email|invalid|failed/i);
  });
});
