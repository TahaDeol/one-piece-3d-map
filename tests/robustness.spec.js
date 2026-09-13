import { test, expect } from '@playwright/test';

async function settled(page) {
    await expect(page.locator('#loadingScreen')).toBeHidden();
    await expect(page.locator('#counterCurrent')).toHaveText('173');
}

test('a Cesium CDN failure is reported instead of hanging on the loading screen', async ({ page }) => {
    await page.route('**/cesium.com/**', route => route.abort());
    await page.goto('/');
    await expect(page.locator('#loadingText')).toContainText("Couldn't load the map engine");
    await expect(page.locator('#loadingScreen')).toBeVisible();
});

test('a locations.json failure is reported in the counter box', async ({ page }) => {
    await page.route('**/data/locations.json', route => route.fulfill({ status: 500, body: 'oops' }));
    await page.goto('/');
    await expect(page.locator('#loadingScreen')).toBeHidden();
    await expect(page.locator('#locationCounter')).toContainText('Location data failed to load');
});

test('a malformed ?location= value does not abort init', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/?location=100%25');
    await settled(page);
    expect(errors).toEqual([]);
});

test('closing the panel keeps unrelated query params', async ({ page }) => {
    await page.goto('/?utm_source=test');
    await settled(page);
    await page.locator('#searchInput').fill('Water Seven');
    await page.locator('.searchResult').first().click();
    await expect(page.locator('#infoPanel')).toHaveClass(/visible/);
    expect(page.url()).toContain('utm_source=test');
    expect(page.url()).toContain('location=Water+Seven');

    await page.locator('#closePanel').click();
    await expect(page.locator('#infoPanel')).not.toHaveClass(/visible/);
    expect(page.url()).toContain('utm_source=test');
    expect(page.url()).not.toContain('location=');
});

test('desktop spoiler slider changes are mirrored to the mobile slider', async ({ page }) => {
    await page.goto('/');
    await settled(page);
    await page.locator('#spoilerSlider').evaluate(s => {
        s.value = 5;
        s.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('#spoilerArc')).toHaveText('Baratie Arc');
    await expect(page.locator('#mobileSpoilerSlider')).toHaveValue('5');
    await expect(page.locator('#mobileSpoilerArc')).toHaveText('Baratie Arc');

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#mobileSpoilerSlider')).toHaveValue('6');
});

test('hiding the route before the ship sprite loads does not throw', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/straw-hat-jolly-roger.png', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
    });
    await page.goto('/');
    await settled(page);
    await page.locator('#routeToggle').click();
    await page.waitForTimeout(100);
    await page.locator('#routeToggle').click();
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
});

test("Cesium's InfoBox and SelectionIndicator are not in the DOM", async ({ page }) => {
    await page.goto('/');
    await settled(page);
    await expect(page.locator('.cesium-infoBox')).toHaveCount(0);
    await expect(page.locator('.cesium-selection-wrapper')).toHaveCount(0);
});
