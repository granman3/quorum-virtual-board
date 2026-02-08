import { test, expect } from '../fixtures/auth.fixture';

test.describe('Multi-turn Conversation', () => {
  test('send follow-up shows both messages and two Board Resolutions', async ({ authenticatedPage: page }) => {
    // First message
    await page.getByTestId('chat-input').fill('Should we raise a Series A?');
    await page.getByTestId('send-button').click();
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });

    // Verify first round of responses
    await expect(page.getByRole('paragraph').filter({ hasText: 'Should we raise a Series A?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Board Resolution' })).toBeVisible();

    // Send follow-up
    await page.getByTestId('chat-input').fill('What about timing - should we wait for Q3?');
    await page.getByTestId('send-button').click();
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });

    // Both user messages should be visible
    await expect(page.getByRole('paragraph').filter({ hasText: 'Should we raise a Series A?' })).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'What about timing - should we wait for Q3?' })).toBeVisible();

    // Two Board Resolution headings (one per round)
    const resolutions = page.getByRole('heading', { name: 'Board Resolution' });
    await expect(resolutions).toHaveCount(2);
  });
});
