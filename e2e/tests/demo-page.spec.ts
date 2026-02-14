import { test, expect } from '@playwright/test';

test.describe('Demo page', () => {
  test('should load demo page and show scenarios', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      console.log(`[${msg.type()}] ${msg.text()}`);
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });

    await page.goto('/demo.html');
    
    // Check if root element is present
    await expect(page.locator('#root')).toBeVisible();
    
    // Check if some demo content appears (scenario buttons)
    const scenarioButtons = page.locator('button', { hasText: /Series A|Enterprise|Articulate|International|AI Model/i });
    await expect(scenarioButtons.first()).toBeVisible({ timeout: 10000 });
    
    // Log any errors
    if (consoleMessages.length) {
      console.log('Console messages:', consoleMessages);
    }
  });
});