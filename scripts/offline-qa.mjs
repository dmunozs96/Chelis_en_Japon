#!/usr/bin/env node
import { chromium } from 'playwright-core';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROUTES = ['/billetes','/viaje/2026-08-17','/herramienta/phrases','/herramienta/emergency'];
const browser = await chromium.launch({ executablePath: CHROME, headless:true });
const context = await browser.newContext({ viewport:{width:390,height:844}, serviceWorkers:'allow' });
const page = await context.newPage();

for (const route of ROUTES) await page.goto(`${BASE}${route}`, { waitUntil:'networkidle' });
await page.goto(`${BASE}/billetes`, { waitUntil:'networkidle' });
await page.waitForFunction(() => navigator.serviceWorker?.controller, null, { timeout:15000 });
await context.setOffline(true);

const results = [];
for (const route of ROUTES) {
  let ok = true;
  let detail = '';
  try {
    const response = await page.goto(`${BASE}${route}`, { waitUntil:'domcontentloaded', timeout:15000 });
    await page.waitForTimeout(800);
    const text = await page.locator('body').innerText();
    ok = Boolean(response) && !/No se pudo abrir la guía|Error:/i.test(text) && text.trim().length > 40;
    detail = `${response?.status() ?? 'sin respuesta'} · ${text.trim().length} caracteres`;
  } catch (error) {
    ok = false; detail = error.message;
  }
  results.push({ route, ok, detail });
  console.log(`${ok ? '✓' : '✗'} offline ${route} · ${detail}`);
}
await context.setOffline(false);
await browser.close();
await writeFile(path.join(ROOT,'V2.5_QA','v2.5.1','offline-report.json'),`${JSON.stringify(results,null,2)}\n`);
if (results.some((result) => !result.ok)) process.exitCode = 1;
