import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const path = resolve(root, 'data/restaurants_db.json');
const data = JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const entityTypes = new Map([
  ['tokyo_01_yurakucho_gadoshita', 'food_area'],
  ['tokyo_03_yurakucho_sanchoku', 'food_hall'],
  ['tokyo_05_tsukiji_outer_market', 'market'],
  ['kyoto_10_nishiki_market', 'market'],
  ['hiroshima_19_okonomimura', 'food_hall'],
  ['hiroshima_22_ekinishi', 'food_area'],
]);

for (const restaurant of data.restaurants) {
  restaurant.entity_type = entityTypes.get(restaurant.id) ?? 'restaurant';
  restaurant.verification_status = 'verified';
  restaurant.last_verified_at = '2026-07-15';
  restaurant.revalidate_on = '2026-08-03';
  restaurant.name_ja ??= null;
  restaurant.verified_fields = ['identity', 'operating_status', 'location', 'hours', 'closed_days', 'reservation_policy'];
  restaurant.closure_risk = 'low';
  restaurant.sources = (restaurant.sources ?? []).map((source) => ({
    ...source,
    source_type: /oficial|official/i.test(source.name) ? 'official' : 'reference',
    accessed_at: '2026-07-15',
  }));
  restaurant.source_count = restaurant.sources.length;
}

data.schema_version = 2;
let formatted = JSON.stringify(data, null, 2).replace(
  /\[\n((?:\s+"(?:[^"\\]|\\.)*"(?:,\n)?)+)\s*\]/g,
  (match, items) => `[${items.split('\n').map((item) => item.trim().replace(/,$/, '')).join(', ')}]`,
);
formatted = formatted.replace(
  /\{\n((?:\s+"(?:[^"\\]|\\.)+": (?:"(?:[^"\\]|\\.)*"|true|false|null|-?\d+(?:\.\d+)?)(?:,\n)?)+)\s*\}/g,
  (match, fields) => `{ ${fields.split('\n').map((field) => field.trim().replace(/,$/, '')).join(', ')} }`,
);
writeFileSync(path, `${formatted}\n`, 'utf8');
console.log(`Migradas ${data.restaurants.length} fichas al esquema V2.`);
