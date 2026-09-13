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

test('info panel close button hides the panel and clears the URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#loadingScreen')).toBeHidden({ timeout: 5000 });

    await page.locator('#searchInput').fill('Water Seven');
    await page.locator('.searchResult').first().click();
    await expect(page.locator('#infoPanel')).toHaveClass(/visible/, { timeout: 5000 });
    expect(page.url()).toContain('location=Water+Seven');

    await page.locator('#closePanel').click();
    await expect(page.locator('#infoPanel')).not.toHaveClass(/visible/);
    expect(page.url()).not.toContain('location=');
});

test('mobile filter checkboxes hide markers and stay in sync with desktop', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('#loadingScreen')).toBeHidden({ timeout: 5000 });
    // Markers are created after locations.json loads; wait for the counter to settle.
    await expect(page.locator('#counterCurrent')).toHaveText('173', { timeout: 5000 });

    await page.locator('#mobileMenuBtn').click();
    await page.locator('.mobileFilterCheck[data-group="sea"][value="East Blue"]').uncheck();

    const counter = page.locator('#counterCurrent');
    await expect(counter).not.toHaveText('173');
    await expect(page.locator('.filterCheck[data-group="sea"][value="East Blue"]')).not.toBeChecked();

    // Desktop → mobile mirroring too, so a resize never shows stale state.
    // The desktop box is display:none at this width, so fire the event directly.
    await page.locator('.filterCheck[data-group="type"][value="Island"]').evaluate(cb => {
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(page.locator('.mobileFilterCheck[data-group="type"][value="Island"]')).not.toBeChecked();
});

test('keyboard shortcuts ignore modifier chords', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#loadingScreen')).toBeHidden({ timeout: 5000 });

    const filterContent = page.locator('#filterContent');
    await expect(filterContent).toHaveClass(/hidden/);

    await page.keyboard.press('Meta+f');
    await page.keyboard.press('Control+f');
    await expect(filterContent).toHaveClass(/hidden/);

    await page.keyboard.press('f');
    await expect(filterContent).not.toHaveClass(/hidden/);
});
