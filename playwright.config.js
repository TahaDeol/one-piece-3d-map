import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: './tests',
    // Every test context downloads the 1.4 MB Cesium bundle afresh, which is
    // slow on a two-core CI runner, so CI runs serially with retries and a
    // longer assertion timeout. Locally the defaults keep the suite fast.
    workers: isCI ? 1 : undefined,
    retries: isCI ? 2 : 0,
    timeout: isCI ? 90000 : 30000,
    expect: { timeout: isCI ? 20000 : 5000 },
    reporter: isCI
        ? [['list'], ['github'], ['html', { open: 'never' }]]
        : 'list',
    webServer: {
        command: 'npx serve . -l 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: !isCI,
        timeout: 30000,
    },
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure',
    },
});
