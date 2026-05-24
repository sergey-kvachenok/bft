import { chromium } from 'playwright';

const browser = await chromium.launch();

// Mobile portrait
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight - 40));
  await page.waitForTimeout(200);
  const tile = page.locator('section[aria-label] button').first();
  await tile.click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: '/tmp/bft-popup-mobile.png' });
  await ctx.close();
}

// Desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight - 40));
  await page.waitForTimeout(200);
  const tile = page.locator('section[aria-label] button').first();
  await tile.click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: '/tmp/bft-popup-desktop.png' });
  await ctx.close();
}

await browser.close();
console.log('Screenshots: /tmp/bft-popup-mobile.png, /tmp/bft-popup-desktop.png');
