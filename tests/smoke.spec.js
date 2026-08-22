import { test, expect } from '@playwright/test';

test('map loads, search finds a location, opens the info panel', async ({ page }) => {
    await page.goto('/');

    // No artificial loading delay — should resolve quickly.
    await expect(page.locator('#loadingScreen')).toBeHidden({ timeout: 5000 });

    // The Cesium globe canvas should exist and be rendering.
    await expect(page.locator('#cesiumContainer canvas').first()).toBeVisible();

    // Search should find a known location.
    const searchInput = page.locator('#searchInput');
    await searchInput.fill('Water Seven');
    const result = page.locator('.searchResult').first();
    await expect(result).toBeVisible();
    await expect(result).toContainText('Water Seven');

    // Selecting it should fly there and open the info panel with the right title.
    await result.click();
    await expect(page.locator('#infoPanel')).toHaveClass(/visible/, { timeout: 5000 });
    await expect(page.locator('#panelName')).toHaveText('Water Seven');
});
