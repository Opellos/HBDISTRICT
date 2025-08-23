import {chromium} from 'playwright';
import {mkdir} from 'fs/promises';
import path from 'path';

const viewports = [390, 1024, 1440];
const url = 'file://' + path.resolve('index_team.html');

await mkdir('screenshots', {recursive: true});

const browser = await chromium.launch();
const page = await browser.newPage();

for (const width of viewports) {
  await page.setViewportSize({width, height: 900});
  await page.goto(url);
  await page.screenshot({path: `screenshots/hero-${width}.png`});
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.screenshot({path: `screenshots/scroll-${width}.png`});
}

await browser.close();
