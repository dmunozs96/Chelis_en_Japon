import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const path = resolve(root, 'data/restaurants_db.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const headers = { 'user-agent': 'Mozilla/5.0 (compatible; ChelisJapanEditorialAudit/1.0)' };

for (const restaurant of data.restaurants.filter((item) => item.name_ja === null)) {
  const source = restaurant.sources.find((item) => item.url.includes('tabelog.com/'));
  if (!source) continue;
  try {
    const url = source.url.replace('tabelog.com/en/', 'tabelog.com/');
    const html = await (await fetch(url, { headers, redirect: 'follow' })).text();
    const name = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => { try { return JSON.parse(match[1]); } catch { return null; } })
      .find((item) => item?.['@type'] === 'Restaurant')?.name;
    if (name) {
      restaurant.name_ja = name;
      console.log(`${restaurant.id}: ${name}`);
    }
  } catch {}
}

for (const id of ['tokyo_55_yomoda_soba_nihonbashi','tokyo_58_nemuro_hanamaru']) {
  const restaurant = data.restaurants.find((item) => item.id === id);
  if (!restaurant.verified_fields.includes('price')) restaurant.verified_fields.push('price');
}
const confirmedNames = {
  tokyo_01_yurakucho_gadoshita: '有楽町ガード下',
  tokyo_02_andys_shin_hinomoto: '新日の基',
  tokyo_05_tsukiji_outer_market: '築地場外市場',
  tokyo_06_bird_land_ginza: '銀座バードランド',
  tokyo_07_esquisse: 'エスキス',
  tokyo_08_sukiyabashi_jiro: 'すきやばし次郎',
  kyoto_10_nishiki_market: '錦市場',
  kyoto_18_roan_kikunoi: '露庵 菊乃井',
  hiroshima_19_okonomimura: 'お好み村',
  hiroshima_22_ekinishi: 'エキニシ',
  osaka_30_kushikatsu_daruma: '串かつだるま 道頓堀店',
};
for (const [id, name] of Object.entries(confirmedNames)) {
  data.restaurants.find((item) => item.id === id).name_ja = name;
}
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
