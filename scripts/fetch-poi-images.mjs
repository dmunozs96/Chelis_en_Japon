#!/usr/bin/env node
/**
 * fetch-poi-images.mjs
 *
 * Resuelve la imagen principal real de cada POI vía la API REST de Wikipedia
 * (page/summary) y la descarga a client/public/pois/{id}.jpg.
 *
 * También regenera:
 *   - client/public/pois/fallback-urls.json  (URLs reales verificadas, por si
 *     algún día falta el fichero local)
 *   - client/public/pois/credits.json        (atribución: artículo + fichero
 *     de Wikimedia Commons de cada imagen)
 *
 * Uso:  node scripts/fetch-poi-images.mjs [--force]
 *   --force  re-descarga aunque el .jpg ya exista
 */

import { writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'client', 'public', 'pois');
const FORCE = process.argv.includes('--force');

const UA = 'ChelisEnJapon/1.0 (guia de viaje personal; contacto: dmunoz@iseazy.com)';
const MAX_WIDTH = 1280;

// Cada POI mapea a una lista de títulos candidatos de Wikipedia (en orden de
// preferencia). Se usa el primero que exista y tenga imagen principal.
const POI_TITLES = {
  'sensoji':              ['Sensō-ji'],
  'hibiya-park':          ['Hibiya Park'],
  'ginza-six':            ['Ginza Six', 'Ginza'],
  'tsukiji-outer-market': ['Tsukiji fish market', 'Tsukiji'],
  'imperial-east':        ['East Gardens of the Imperial Palace', 'Tokyo Imperial Palace'],
  'shibuya-crossing':     ['Shibuya Crossing', 'Shibuya'],
  'shibuya-sky':          ['Shibuya Scramble Square'],
  'yanaka':               ['Yanaka, Tokyo', 'Yanaka Cemetery'],
  'hakone-openair':       ['Hakone Open-Air Museum', 'Hakone'],
  'nishiki-market':       ['Nishiki Market'],
  'pontocho':             ['Ponto-chō'],
  'fushimi-inari':        ['Fushimi Inari-taisha'],
  'kiyomizudera':         ['Kiyomizu-dera'],
  'higashiyama':          ['Sannenzaka', 'Higashiyama-ku, Kyoto'],
  'gion':                 ['Gion'],
  'arashiyama':           ['Arashiyama', 'Bamboo forests of Kyoto'],
  'kinkakuji':            ['Kinkaku-ji'],
  'nijo-castle':          ['Nijō Castle'],
  'peace-park':           ['Hiroshima Peace Memorial Park'],
  'genbaku-dome':         ['Hiroshima Peace Memorial'],
  'shukkei-en':           ['Shukkei-en'],
  'dotonbori':            ['Dōtonbori'],
  'hozenji':              ['Hōzen-ji (Osaka)', 'Hozenji Yokocho'],
  'osaka-castle':         ['Osaka Castle'],
};

async function getSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) return null;
  return res.json();
}

/** Devuelve la URL de descarga a <= MAX_WIDTH px a partir del summary. */
function pickImageUrl(summary) {
  const orig = summary?.originalimage;
  const thumb = summary?.thumbnail;
  if (!orig?.source) return null;
  if (orig.width <= MAX_WIDTH) return orig.source;
  if (thumb?.source) {
    // thumbnail.source ≈ .../thumb/x/xy/Foo.jpg/320px-Foo.jpg → pedir 1280px
    return thumb.source.replace(/\/\d+px-/, `/${MAX_WIDTH}px-`);
  }
  return orig.source;
}

/** Nombre del fichero en Commons a partir de la URL original (para créditos). */
function commonsFilePage(origUrl) {
  try {
    const name = decodeURIComponent(origUrl.split('/').pop());
    return `https://commons.wikimedia.org/wiki/File:${name}`;
  } catch {
    return null;
  }
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, dest) {
  // Wikimedia limita ráfagas: espaciar descargas y reintentar los 429.
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      const wait = 5_000 * attempt;
      console.log(`  … 429 en ${path.basename(dest)}, reintento en ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} descargando ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5_000) throw new Error(`Descarga sospechosamente pequeña (${buf.length} bytes)`);
    await writeFile(dest, buf);
    return buf.length;
  }
  throw new Error(`HTTP 429 persistente descargando ${url}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const fallbackUrls = {};
  const credits = {};
  const failures = [];

  for (const [id, titles] of Object.entries(POI_TITLES)) {
    const dest = path.join(OUT_DIR, `${id}.jpg`);
    let resolved = null;

    for (const title of titles) {
      const summary = await getSummary(title);
      const url = summary && pickImageUrl(summary);
      if (url) {
        resolved = { url, summary };
        break;
      }
    }

    if (!resolved) {
      failures.push(id);
      console.error(`✗ ${id} — ningún artículo candidato tiene imagen`);
      continue;
    }

    fallbackUrls[id] = resolved.url;
    credits[id] = {
      article: resolved.summary.content_urls?.desktop?.page ?? null,
      commons_file: commonsFilePage(resolved.summary.originalimage.source),
    };

    if (!FORCE && (await exists(dest))) {
      console.log(`· ${id} — ya existe, se conserva (usa --force para re-descargar)`);
      continue;
    }

    try {
      const bytes = await download(resolved.url, dest);
      console.log(`✓ ${id} — ${(bytes / 1024).toFixed(0)} KB  (${resolved.summary.title})`);
      await sleep(1_500);
    } catch (err) {
      failures.push(id);
      console.error(`✗ ${id} — ${err.message}`);
    }
  }

  await writeFile(path.join(OUT_DIR, 'fallback-urls.json'), JSON.stringify(fallbackUrls, null, 2) + '\n');
  await writeFile(path.join(OUT_DIR, 'credits.json'), JSON.stringify(credits, null, 2) + '\n');

  console.log(`\n${Object.keys(fallbackUrls).length}/${Object.keys(POI_TITLES).length} imágenes resueltas.`);
  if (failures.length) {
    console.error(`Fallaron: ${failures.join(', ')}`);
    process.exitCode = 1;
  }
}

main();
