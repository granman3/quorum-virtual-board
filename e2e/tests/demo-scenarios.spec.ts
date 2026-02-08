import { test, expect } from '../fixtures/auth.fixture';

test.describe('Demo Scenarios', () => {
  test('demo scenario buttons visible on empty state', async ({ authenticatedPage: page }) => {
    // Should see scenario buttons in empty state
    const scenarioButtons = page.locator('button', { hasText: /Series A|Enterprise|Articulate|International|AI Model/i });
    await expect(scenarioButtons.first()).toBeVisible({ timeout: 5_000 });

    // Should have exactly 5 scenarios
    const count = await scenarioButtons.count();
    expect(count).toBe(5);
  });

  test('clicking scenario submits the question', async ({ authenticatedPage: page }) => {
    // Click the first scenario button
    const firstScenario = page.locator('button', { hasText: /Series A/i });
    await expect(firstScenario).toBeVisible({ timeout: 5_000 });
    await firstScenario.click();

    // Board should start deliberating
    await expect(page.getByTestId('board-status')).toHaveText('DELIBERATING', { timeout: 10_000 });

    // Wait for responses to complete
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });
  });

  test('scenarios disappear after first message', async ({ authenticatedPage: page }) => {
    // Scenarios visible initially
    const scenarioButtons = page.locator('button', { hasText: /Series A|Enterprise|Articulate|International|AI Model/i });
    await expect(scenarioButtons.first()).toBeVisible({ timeout: 5_000 });

    // Submit a message
    await page.getByTestId('chat-input').fill('Test question');
    await page.getByTestId('send-button').click();

    // Scenarios should no longer be visible
    await expect(scenarioButtons.first()).not.toBeVisible({ timeout: 10_000 });
  });
});
