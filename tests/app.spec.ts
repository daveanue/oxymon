import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

let electronApp: ElectronApplication;
let window: Page;

test.beforeAll(async () => {
    // Launch Electron app
    electronApp = await electron.launch({
        args: ['packages/main/dist/index.js'],
    });

    // Get the first window
    window = await electronApp.firstWindow();
});

test.afterAll(async () => {
    await electronApp.close();
});

test('application launches successfully', async () => {
    // Verify the window is created
    expect(window).toBeTruthy();

    // Verify window title
    const title = await window.title();
    expect(title).toBeTruthy();
});

test('window has expected properties', async () => {
    // Check if window is visible
    const isVisible = await window.isVisible('body');
    expect(isVisible).toBe(true);
});
