#!/usr/bin/env node
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'V2.5_QA', 'v2.5.1');
const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROUTES = [
  ['home','/'],['trip','/viaje/2026-08-17'],['restaurants','/restaurantes'],
  ['more','/mas'],['tickets','/billetes'],['poi','/poi/fushimi-inari'],
  ['climate','/herramienta/climate'],['culture','/herramienta/culture'],
];
const VIEWPORTS = [{ width:320,height:844 },{ width:390,height:844 },{ width:430,height:932 }];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const results = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', colorScheme: 'dark' });
  for (const [name, route] of ROUTES) {
    const page = await context.newPage();
    if (route === '/') await page.addInitScript(() => sessionStorage.setItem('splash_shown','1'));
    const consoleErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);
    const audit = await page.evaluate(() => {
      const images = [...document.images];
      const brokenImages = images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src);
      const narrowTargets = [...document.querySelectorAll('button,a,[role="button"]')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return style.display !== 'none' && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
        }).slice(0, 12).map((element) => ({
          text: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 50),
          size: `${Math.round(element.getBoundingClientRect().width)}×${Math.round(element.getBoundingClientRect().height)}`,
        }));
      return {
        title: document.title,
        viewport: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        brokenImages,
        narrowTargets,
      };
    });
    await page.screenshot({ path:path.join(OUT,`${name}-${viewport.width}.png`), fullPage:true });
    results.push({ name, route, viewport: viewport.width, ...audit, consoleErrors });
    await page.close();
  }
  await context.close();
}
await browser.close();
await writeFile(path.join(OUT,'report.json'), `${JSON.stringify(results,null,2)}\n`);

const failures = results.filter((result) => result.overflow || result.brokenImages.length || result.consoleErrors.length);
for (const result of results) {
  console.log(`${failures.includes(result) ? '✗' : '✓'} ${result.name} ${result.viewport}px · overflow=${result.overflow} · images=${result.brokenImages.length} · console=${result.consoleErrors.length} · targets=${result.narrowTargets.length}`);
}
if (failures.length) process.exitCode = 1;
