import { test, expect } from '../fixtures/auth.fixture';

test.describe('Responsive Layout @responsive', () => {
  test('sidebar hidden by default on mobile', async ({ authenticatedPage: page }) => {
    // On mobile viewport, the sidebar should be off-screen (translated left)
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('hamburger menu opens and closes sidebar', async ({ authenticatedPage: page }) => {
    // Sidebar toggle should be visible on mobile
    const toggle = page.getByTestId('sidebar-toggle');
    await expect(toggle).toBeVisible();

    // Click to open sidebar
    await toggle.click();
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/translate-x-0/, { timeout: 3_000 });

    // Sidebar content should be visible
    await expect(page.getByText('Board of Directors')).toBeVisible();

    // Close via overlay click
    const overlay = page.locator('.fixed.inset-0.bg-black\\/50');
    if (await overlay.isVisible()) {
      await overlay.click();
      await expect(sidebar).toHaveClass(/-translate-x-full/, { timeout: 3_000 });
    }
  });
});
