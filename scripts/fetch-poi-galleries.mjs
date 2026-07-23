#!/usr/bin/env node
/**
 * Crea galerías verificables para ocho POIs prioritarios usando la búsqueda de
 * Wikimedia Commons. El manifest conserva autor, licencia y ficha original.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'client', 'public', 'poi-galleries');
const UA = 'ChelisEnJapon/2.5.1 (guia de viaje personal; contacto: dmunoz@iseazy.com)';
const TARGETS = {
  sensoji: 'Sensoji temple Tokyo',
  'fushimi-inari': 'Fushimi Inari shrine Kyoto',
  kiyomizudera: 'Kiyomizu dera Kyoto',
  arashiyama: 'Arashiyama bamboo Kyoto',
  kinkakuji: 'Kinkakuji Golden Pavilion Kyoto',
  'genbaku-dome': 'Hiroshima Atomic Bomb Dome',
  dotonbori: 'Dotonbori canal Osaka night',
  'osaka-castle': 'intitle:"Osaka Castle" exterior keep',
};
const onlyArg = process.argv.find((arg) => arg.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;

const strip = (value = '') => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': UA } });
    if (response.status === 429) { await sleep(attempt * 4000); continue; }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  }
  throw new Error('HTTP 429 persistente');
}

async function search(query) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search',
    gsrsearch: query, gsrnamespace: '6', gsrlimit: '8',
    prop: 'imageinfo', iiprop: 'url|mime|extmetadata', iiurlwidth: '1280',
  });
  const data = await (await request(url)).json();
  return Object.values(data.query?.pages ?? {})
    .map((page) => page.imageinfo?.[0])
    .filter((image) => image && image.mime?.startsWith('image/') && !/svg|gif/i.test(image.mime))
    .slice(0, 3);
}

await mkdir(OUT, { recursive: true });
let previous = { galleries: {} };
try { previous = JSON.parse(await readFile(path.join(OUT, 'manifest.json'), 'utf8')); } catch {}
const galleries = previous.galleries ?? {};

for (const [poiId, query] of Object.entries(TARGETS)) {
  if (only && !only.has(poiId)) continue;
  const directory = path.join(OUT, poiId);
  await mkdir(directory, { recursive: true });
  const images = await search(query);
  galleries[poiId] = [];
  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    const response = await request(image.thumburl ?? image.url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const file = `${index + 1}.jpg`;
    await writeFile(path.join(directory, file), bytes);
    const meta = image.extmetadata ?? {};
    galleries[poiId].push({
      file: `/poi-galleries/${poiId}/${file}`,
      commons_url: image.descriptionurl,
      author: strip(meta.Artist?.value) || 'Autor indicado en Wikimedia Commons',
      license: meta.LicenseShortName?.value || 'Consultar ficha',
      license_url: meta.LicenseUrl?.value || image.descriptionurl,
    });
    await sleep(1500);
  }
  console.log(`✓ ${poiId}: ${galleries[poiId].length}`);
  await sleep(2500);
}

await writeFile(path.join(OUT, 'manifest.json'), `${JSON.stringify({
  generated_at: new Date().toISOString(), galleries,
}, null, 2)}\n`);
