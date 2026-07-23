#!/usr/bin/env node
/**
 * Amplía la biblioteca V2.5.1 con fotografía relevante de Wikimedia Commons.
 * Cada descarga conserva artículo, ficha Commons, autor y licencia en
 * client/public/visual-library/manifest.json.
 *
 * Uso: node scripts/fetch-visual-library.mjs [--force]
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'client', 'public', 'visual-library');
const FORCE = process.argv.includes('--force');
const UA = 'ChelisEnJapon/2.5.1 (guia de viaje personal; contacto: dmunoz@iseazy.com)';
const WIDTH = 1280;

const SUBJECTS = [
  // Gastronomía: platos, barras, mercados y cultura de mesa.
  ['food','sushi','Sushi'],['food','ramen','Ramen'],['food','udon','Udon'],['food','soba','Soba'],
  ['food','yakitori','Yakitori'],['food','tempura','Tempura'],['food','tonkatsu','Tonkatsu'],
  ['food','okonomiyaki','Okonomiyaki'],['food','takoyaki','Takoyaki'],['food','kaiseki','Kaiseki'],
  ['food','sukiyaki','Sukiyaki'],['food','shabu-shabu','Shabu-shabu'],['food','unagi','Unagi'],
  ['food','onigiri','Onigiri'],['food','bento','Bento'],['food','gyoza','Jiaozi'],
  ['food','curry-rice','Japanese curry'],['food','matcha','Matcha'],['food','wagashi','Wagashi'],
  ['food','taiyaki','Taiyaki'],['food','izakaya','Izakaya'],['food','depachika','Depachika'],
  ['food','toyosu-market','Toyosu Market'],['food','kuromon-market','Kuromon Ichiba Market'],
  ['food','tea-ceremony','Japanese tea ceremony'],['food','sake','Sake'],['food','kissaten','Kissaten'],
  ['food','yakiniku','Yakiniku'],['food','omurice','Omurice'],['food','donburi','Donburi'],
  ['food','mochi','Mochi'],['food','kushikatsu','Kushikatsu'],['food','hiroshima-okonomiyaki','Hiroshima-style okonomiyaki'],

  // Transporte y operación.
  ['transport','shinkansen','Shinkansen'],['transport','n700-series','N700 Series Shinkansen'],
  ['transport','tokyo-station','Tokyo Station'],['transport','kyoto-station','Kyoto Station'],
  ['transport','shinjuku-station','Shinjuku Station'],['transport','haneda-airport','Haneda Airport'],
  ['transport','narita-airport','Narita International Airport'],['transport','romancecar','Odakyu Romancecar'],
  ['transport','hakone-ropeway','Hakone Ropeway'],['transport','hiroden','Hiroden'],
  ['transport','osaka-metro','Osaka Metro'],['transport','suica','Suica'],
  ['transport','tokaido-shinkansen','Tokaido Shinkansen'],

  // Cultura, barrios y atmósferas.
  ['culture','kabuki','Kabuki'],['culture','noren','Noren'],['culture','ema','Ema (Shinto)'],
  ['culture','omikuji','O-mikuji'],['culture','goshuin','Goshuin'],['culture','yukata','Yukata'],
  ['culture','kimono','Kimono'],['culture','japanese-garden','Japanese garden'],
  ['culture','machiya','Machiya'],['culture','shotengai','Shōtengai'],['culture','torii','Torii'],
  ['culture','chochin','Chōchin'],['culture','kintsugi','Kintsugi'],['culture','ukiyo-e','Ukiyo-e'],
  ['culture','shodo','Japanese calligraphy'],['culture','tatami','Tatami'],['culture','onsen','Onsen'],
  ['culture','ryokan','Ryokan'],['culture','sentō','Sentō'],['culture','bamboo-forest','Bamboo forest'],

  // Objetos, compras y estaciones.
  ['objects','seiko','Seiko'],['objects','citizen-watch','Citizen Watch'],['objects','fountain-pen','Fountain pen'],
  ['objects','japanese-knife','Japanese kitchen knife'],['objects','furoshiki','Furoshiki'],
  ['objects','tenugui','Tenugui'],['objects','maneki-neko','Maneki-neko'],['objects','daruma','Daruma doll'],
  ['objects','japanese-ceramics','Japanese pottery and porcelain'],['objects','japanese-lacquerware','Japanese lacquerware'],
  ['nature','mount-fuji','Mount Fuji'],['nature','lake-ashi','Lake Ashi'],['nature','japanese-maple','Acer palmatum'],
  ['nature','bamboo','Bamboo'],['nature','summer-japan','Climate of Japan'],
];

const stripHtml = (value = '') => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exists = async (file) => { try { await access(file); return true; } catch { return false; } };

async function json(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (response.status === 429) {
      await sleep(attempt * 3000);
      continue;
    }
    if (!response.ok) return null;
    return response.json();
  }
  return null;
}

async function resolveSubject(article) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`;
  const summary = await json(summaryUrl);
  if (!summary?.originalimage?.source || summary.type === 'disambiguation') return null;
  const original = summary.originalimage.source;
  const filename = decodeURIComponent(new URL(original).pathname.split('/').pop());
  const infoUrl = new URL('https://commons.wikimedia.org/w/api.php');
  infoUrl.search = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', prop: 'imageinfo',
    iiprop: 'url|extmetadata', titles: `File:${filename}`, iiurlwidth: String(WIDTH),
  });
  const info = await json(infoUrl);
  const page = info && Object.values(info.query?.pages ?? {})[0];
  const image = page?.imageinfo?.[0];
  if (!image?.thumburl && !image?.url) return null;
  const meta = image.extmetadata ?? {};
  return {
    download_url: image.thumburl ?? image.url,
    article_url: summary.content_urls?.desktop?.page,
    commons_url: image.descriptionurl,
    author: stripHtml(meta.Artist?.value) || 'Autor indicado en Wikimedia Commons',
    license: meta.LicenseShortName?.value || 'Consultar ficha de Wikimedia Commons',
    license_url: meta.LicenseUrl?.value || image.descriptionurl,
    credit: stripHtml(meta.Credit?.value),
  };
}

async function download(url, destination) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': UA } });
    if (response.status === 429) {
      await sleep(attempt * 4000);
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 5000) throw new Error('archivo demasiado pequeño');
    await writeFile(destination, bytes);
    return bytes.length;
  }
  throw new Error('HTTP 429 persistente');
}

await mkdir(OUT, { recursive: true });
const manifestPath = path.join(OUT, 'manifest.json');
let previous = { images: [] };
try { previous = JSON.parse(await readFile(manifestPath, 'utf8')); } catch {}
const manifestById = new Map((previous.images ?? []).map((image) => [image.id, image]));
const failures = [];

async function saveManifest() {
  const images = [...manifestById.values()];
  await writeFile(manifestPath, `${JSON.stringify({
    generated_at: new Date().toISOString(),
    reuse_notice: 'Revisar autor y licencia de cada entrada antes de redistribuir. Las imágenes se sirven sin texto editorial incorporado.',
    count: images.length, images, failures,
  }, null, 2)}\n`);
}

for (const [category, id, article] of SUBJECTS) {
  const directory = path.join(OUT, category);
  const destination = path.join(directory, `${id}.jpg`);
  await mkdir(directory, { recursive: true });
  try {
    const resolved = await resolveSubject(article);
    if (!resolved) throw new Error('sin imagen principal verificable');
    if (FORCE || !(await exists(destination))) await download(resolved.download_url, destination);
    manifestById.set(id, {
      id, category, file: `/visual-library/${category}/${id}.jpg`, subject: article,
      ...resolved, allowed_contexts: [category], alt: article,
    });
    await saveManifest();
    console.log(`✓ ${category}/${id}`);
  } catch (error) {
    failures.push({ id, article, error: error.message });
    console.error(`✗ ${id}: ${error.message}`);
  }
  await sleep(1400);
}

await saveManifest();
console.log(`\n${manifestById.size}/${SUBJECTS.length} assets documentados.`);
if (manifestById.size < 65) process.exitCode = 1;
