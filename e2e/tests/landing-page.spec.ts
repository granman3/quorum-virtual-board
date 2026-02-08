import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct title and hero content', async ({ page }) => {
    await expect(page).toHaveTitle(/Quorum/);
    await expect(page.locator('h1')).toContainText('Board of Directors');
    await expect(page.getByText('Four AI executives. One boardroom.')).toBeVisible();
  });

  test('navigation links scroll to sections', async ({ page }) => {
    // Click Features nav link
    await page.locator('nav a[href="#features"]').click();
    await expect(page.locator('#features')).toBeInViewport({ timeout: 3000 });

    // Click The Board nav link
    await page.locator('nav a[href="#board"]').click();
    await expect(page.locator('#board')).toBeInViewport({ timeout: 3000 });

    // Click How It Works
    await page.locator('nav a[href="#how-it-works"]').click();
    await expect(page.locator('#how-it-works')).toBeInViewport({ timeout: 3000 });

    // Click FAQ
    await page.locator('nav a[href="#faq"]').click();
    await expect(page.locator('#faq')).toBeInViewport({ timeout: 3000 });
  });

  test('FAQ accordion toggles open and closed', async ({ page }) => {
    // Scroll to FAQ section
    await page.locator('#faq').scrollIntoViewIfNeeded();

    const firstFaqButton = page.locator('.faq-item button').first();
    const firstFaqAnswer = page.locator('.faq-answer').first();

    // Initially closed
    await expect(firstFaqAnswer).not.toHaveClass(/open/);

    // Click to open
    await firstFaqButton.click();
    await expect(firstFaqAnswer).toHaveClass(/open/);

    // Click again to close
    await firstFaqButton.click();
    await expect(firstFaqAnswer).not.toHaveClass(/open/);
  });

  test('"Launch App" navigates to /app.html', async ({ page }) => {
    const launchButton = page.locator('nav a[href="/app.html"]');
    await expect(launchButton).toContainText('Launch App');
    await launchButton.click();
    await expect(page).toHaveURL(/app\.html/);
  });

  test('"Enter the Boardroom" navigates to /app.html', async ({ page }) => {
    const enterButton = page.locator('a[href="/app.html"]', { hasText: 'Enter the Boardroom' }).first();
    await expect(enterButton).toBeVisible();
    await enterButton.click();
    await expect(page).toHaveURL(/app\.html/);
  });

  test('all 4 board member cards are shown', async ({ page }) => {
    await page.locator('#board').scrollIntoViewIfNeeded();

    await expect(page.getByText("Marcus \"The Hawk\" Sterling")).toBeVisible();
    await expect(page.getByText("Elena \"The Visionary\" Vance")).toBeVisible();
    await expect(page.getByText("David \"The Architect\" Chen")).toBeVisible();
    await expect(page.getByText("Sarah \"The Shield\" O'Connor")).toBeVisible();
  });
});
