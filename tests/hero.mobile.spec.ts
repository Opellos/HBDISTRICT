import { test, expect } from '@playwright/test';
import path from 'path';

// #codex_justage: Playwright-Test für mobile Hero-Ausrichtung
const fileUrl = 'file://' + path.resolve(__dirname, '../index_build_ramp.html');

test('mobile hero spacing', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(fileUrl);

  const viewHeight = await page.evaluate(() => window.innerHeight);
  const paddingTop = await page.evaluate(() => {
    const el = document.getElementById('hero-section');
    return parseFloat(getComputedStyle(el!).paddingTop);
  });
  expect(paddingTop).toBeGreaterThanOrEqual(viewHeight * 0.25);

  const alignItems = await page.evaluate(() => {
    const el = document.querySelector('#hero-section .hb-hero');
    return getComputedStyle(el as HTMLElement).alignItems;
  });
  expect(alignItems).toBe('flex-start');

  const box = await page.locator('#hero-section .hb-hero').boundingBox();
  expect(box?.y ?? 0).toBeGreaterThanOrEqual(viewHeight * 0.25);

  await expect(page.locator('#hero-section')).toHaveScreenshot('hero-mobile.png');
});
