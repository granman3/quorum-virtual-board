import { test, expect } from '../fixtures/auth.fixture';

test.describe('Board Consultation', () => {
  test('word count updates as user types', async ({ authenticatedPage: page }) => {
    const chatInput = page.getByTestId('chat-input');
    await chatInput.fill('hello world');
    await expect(page.getByText('2 WORDS')).toBeVisible();

    await chatInput.fill('one two three four five');
    await expect(page.getByText('5 WORDS')).toBeVisible();
  });

  test('Quick Brief mode for <30 words, Full Report for 30+', async ({ authenticatedPage: page }) => {
    const chatInput = page.getByTestId('chat-input');

    // Short text → Quick Brief
    await chatInput.fill('Should we expand?');
    await expect(page.getByText('Quick Brief')).toBeVisible();

    // Long text → Full Report (30+ words)
    const longText = Array(35).fill('word').join(' ');
    await chatInput.fill(longText);
    await expect(page.getByText('Full Report')).toBeVisible();
  });

  test('submit question shows user message and all agent responses', async ({ authenticatedPage: page }) => {
    const chatInput = page.getByTestId('chat-input');
    await chatInput.fill('Should we raise a Series A?');
    await page.getByTestId('send-button').click();

    // User message should appear (use paragraph role to avoid matching breadcrumb)
    await expect(page.getByRole('paragraph').filter({ hasText: 'Should we raise a Series A?' })).toBeVisible();

    // Wait for board status to return to READY (all responses complete)
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });

    // All 4 agent responses + synthesis should be visible
    await expect(page.getByText('Financial Analysis')).toBeVisible();
    await expect(page.getByText('Growth Strategy Assessment')).toBeVisible();
    await expect(page.getByText('Technical Assessment')).toBeVisible();
    await expect(page.getByText('Legal & Compliance Review')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Board Resolution' })).toBeVisible();
  });

  test('board status shows DELIBERATING during consultation', async ({ authenticatedPage: page }) => {
    const chatInput = page.getByTestId('chat-input');
    await chatInput.fill('Quick question');

    // Set up a slow route to observe DELIBERATING state
    await page.unroute('**/generativelanguage.googleapis.com/**');
    let resolvers: (() => void)[] = [];
    await page.route('**/generativelanguage.googleapis.com/**', async (route) => {
      await new Promise<void>((resolve) => {
        resolvers.push(resolve);
        // Auto-resolve after 2s to prevent timeout
        setTimeout(resolve, 2000);
      });
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"candidates":[{"content":{"parts":[{"text":"Test response"}],"role":"model"},"finishReason":"STOP"}]}\n\n',
      });
    });

    await page.getByTestId('send-button').click();

    // Should show DELIBERATING while consulting
    await expect(page.getByTestId('board-status')).toHaveText('DELIBERATING', { timeout: 5_000 });

    // Resolve all pending routes
    resolvers.forEach(r => r());

    // Eventually returns to READY
    await expect(page.getByTestId('board-status')).toHaveText('READY', { timeout: 30_000 });
  });
});
