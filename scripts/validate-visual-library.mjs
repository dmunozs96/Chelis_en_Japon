#!/usr/bin/env node
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'client', 'public');
const errors = [];

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(full));
    else result.push(full);
  }
  return result;
}

const visualManifest = JSON.parse(await readFile(path.join(PUBLIC, 'visual-library', 'manifest.json'), 'utf8'));
const galleryManifest = JSON.parse(await readFile(path.join(PUBLIC, 'poi-galleries', 'manifest.json'), 'utf8'));
const images = (await walk(PUBLIC)).filter((file) => /\.(avif|webp|jpe?g|png)$/i.test(file));

for (const image of visualManifest.images ?? []) {
  for (const key of ['file','subject','commons_url','author','license','license_url','alt']) {
    if (!image[key]) errors.push(`${image.id}: falta ${key}`);
  }
  try { await access(path.join(PUBLIC, image.file.replace(/^\//, ''))); }
  catch { errors.push(`${image.id}: falta el archivo ${image.file}`); }
}

for (const [poiId, gallery] of Object.entries(galleryManifest.galleries ?? {})) {
  if (gallery.length < 3) errors.push(`${poiId}: galería incompleta`);
  for (const image of gallery) {
    for (const key of ['file','commons_url','author','license','license_url']) {
      if (!image[key]) errors.push(`${poiId}: falta ${key}`);
    }
    try { await access(path.join(PUBLIC, image.file.replace(/^\//, ''))); }
    catch { errors.push(`${poiId}: falta el archivo ${image.file}`); }
  }
}

if (images.length < 120) errors.push(`biblioteca insuficiente: ${images.length}/120 assets raster`);
if ((visualManifest.images?.length ?? 0) < 50) errors.push(`manifest temático insuficiente: ${visualManifest.images?.length ?? 0}/50`);

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Biblioteca visual válida: ${images.length} assets raster, ${visualManifest.images.length} temáticos y ${Object.keys(galleryManifest.galleries).length} galerías POI.`);
