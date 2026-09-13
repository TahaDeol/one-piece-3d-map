import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// vercel.json ships the policy as Report-Only. This test applies the very same
// policy as *enforcing* to the local build and exercises every code path that
// loads a resource, so a directive that's too tight fails CI before the header
// is ever flipped to enforcing in production.
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const csp = vercel.headers[0].headers.find(h => h.key === 'Content-Security-Policy-Report-Only').value;

// Cesium 1.114 probes eval support at startup inside try/catch (feature
// detection); blocking it is harmless, so it is the one expected violation.
// WebAssembly is different: Cesium instantiates modules unconditionally and an
// unhandled rejection results if it's blocked, hence 'wasm-unsafe-eval' in the
// policy (WASM compilation only, JavaScript eval stays blocked).
function isExpectedCesiumProbe(v) {
    return v.directive === 'script-src'
        && v.blocked === 'eval'
        && v.file.startsWith('https://cesium.com/');
}

test('the report-only CSP produces no unexpected violations when enforced', async ({ page }) => {
    const violations = [];
    await page.exposeFunction('__cspViolation', v => violations.push(v));
    await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', e => {
            window.__cspViolation({
                directive: e.violatedDirective,
                blocked: e.blockedURI,
                file: e.sourceFile,
                line: e.lineNumber,
            });
        });
    });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.route(url => url.pathname === '/', async route => {
        const response = await route.fetch();
        await route.fulfill({
            response,
            headers: { ...response.headers(), 'content-security-policy': csp },
        });
    });

    await page.goto('/');
    await expect(page.locator('#loadingScreen')).toBeHidden();
    await expect(page.locator('#counterCurrent')).toHaveText('173');

    // Route: polyline geometry is built in a Cesium web worker; sprite PNG.
    await page.locator('#routeToggle').click();
    await page.waitForTimeout(1500);
    await page.locator('#routeToggle').click();

    // Search + select: fly-to, info panel, history.replaceState.
    await page.locator('#searchInput').fill('Water Seven');
    await page.locator('.searchResult').first().click();
    await expect(page.locator('#infoPanel')).toHaveClass(/visible/);

    // Filters and hover picking.
    await page.locator('#filterToggle').click();
    await page.locator('#deselectAllBtn').click();
    await page.locator('#selectAllBtn').click();
    await page.mouse.move(600, 400);
    await page.mouse.move(620, 410);
    await page.waitForTimeout(3000); // let tiles/fonts/workers settle

    expect(violations.filter(v => !isExpectedCesiumProbe(v))).toEqual([]);
    expect(errors).toEqual([]);
});
