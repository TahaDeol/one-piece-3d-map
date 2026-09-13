import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

async function settled(page) {
    await expect(page.locator('#loadingScreen')).toBeHidden({ timeout: 5000 });
    await expect(page.locator('#counterCurrent')).toHaveText('173', { timeout: 5000 });
}

async function seriousViolations(page) {
    await page.addScriptTag({ content: axeSource });
    return page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] });
        return result.violations
            .filter(v => v.impact === 'serious' || v.impact === 'critical')
            .map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`);
    });
}

test('desktop layout has no serious or critical axe violations', async ({ page }) => {
    await page.goto('/');
    await settled(page);
    await page.locator('#filterToggle').click();
    expect(await seriousViolations(page)).toEqual([]);
});

test('mobile drawer has no serious or critical axe violations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await settled(page);
    await page.locator('#mobileMenuBtn').click();
    await expect(page.locator('#mobileMenuBtn')).toHaveAttribute('aria-expanded', 'true');
    expect(await seriousViolations(page)).toEqual([]);
});

test('toggles expose their state and Escape closes everything', async ({ page }) => {
    await page.goto('/');
    await settled(page);

    const filterToggle = page.locator('#filterToggle');
    await filterToggle.click();
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#filterContent')).toBeVisible();

    const routeToggle = page.locator('#routeToggle');
    await routeToggle.click();
    await expect(routeToggle).toHaveAttribute('aria-pressed', 'true');
    await routeToggle.click();
    await expect(routeToggle).toHaveAttribute('aria-pressed', 'false');

    await page.locator('#searchInput').fill('Water Seven');
    await page.locator('.searchResult').first().click();
    await expect(page.locator('#infoPanel')).toHaveClass(/visible/, { timeout: 5000 });

    await page.locator('#searchInput').fill('Wa');
    await expect(page.locator('#searchDropdown')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#searchDropdown')).toBeHidden();
    await expect(page.locator('#filterContent')).toBeHidden();
    await expect(filterToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#infoPanel')).not.toHaveClass(/visible/);
});

test('the hidden info panel keeps its close button out of the Tab order', async ({ page }) => {
    await page.goto('/');
    await settled(page);
    // visibility:hidden while closed, so it is neither visible nor focusable.
    await expect(page.locator('#closePanel')).toBeHidden();
});
