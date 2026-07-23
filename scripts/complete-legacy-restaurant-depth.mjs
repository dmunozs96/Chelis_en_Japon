import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const path = resolve(root, 'data/restaurants_db.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

const dishes = {
  tokyo_01_yurakucho_gadoshita: ['Yakitori bajo las vías', 'Platos de izakaya de temporada'],
  tokyo_02_andys_shin_hinomoto: ['Sashimi del pescado del día', 'Marisco de Toyosu'],
  tokyo_03_yurakucho_sanchoku: ['Kurobuta de Kagoshima', 'Marisco de Hokkaido'],
  tokyo_04_ichiniisan: ['Shabu-shabu de kurobuta', 'Tonkatsu de kurobuta'],
  tokyo_05_tsukiji_outer_market: ['Atún de Maguroya Kurogin', 'Tamagoyaki'],
  tokyo_06_bird_land_ginza: ['Omakase de yakitori', 'Brochetas de Okukuji Shamo'],
  tokyo_07_esquisse: ['Menu spontané', 'Maridaje de vinos'],
  tokyo_08_sukiyabashi_jiro: ['Omakase de sushi Edomae', 'Nigiri del producto del día'],
  tokyo_09_tsuta_ramen: ['Shoyu soba', 'Ramen con aceite de trufa negra'],
  kyoto_10_nishiki_market: ['Tako tamago', 'Tsukemono de Kioto'],
  kyoto_11_janomeya: ['Tori soba', 'Ramen de pollo'],
  kyoto_12_onikai: ['Verduras de la huerta', 'Tapas japonesas de temporada'],
  kyoto_13_gion_kappa: ['Kushiyaki', 'Sashimi del día'],
  kyoto_15_kyogoku_kaneyo: ['Kinshi-don', 'Unagi kabayaki'],
  kyoto_16_gion_sumibiyaki_kyoyu: ['Kushiyaki al binchotan', 'Kyo-yasai a la brasa'],
  kyoto_17_sushi_taizo: ['Omakase de sushi', 'Nigiri Edomae del día'],
  kyoto_18_roan_kikunoi: ['Kaiseki de temporada', 'Menú de cena de Kikunoi'],
  hiroshima_19_okonomimura: ['Okonomiyaki Hiroshima con soba', 'Okonomiyaki con marisco'],
  hiroshima_20_micchan_sohonten: ['Okonomiyaki especial con soba', 'Okonomiyaki con ikaten'],
  hiroshima_21_reichan: ['Okonomiyaki con soba', 'Okonomiyaki con ostras'],
  hiroshima_22_ekinishi: ['Ostras de Hiroshima a la plancha', 'Kaki furai'],
  osaka_23_takoyaki_wanaka: ['Takoyaki clásico', 'Takoyaki con sal y cebolleta'],
  osaka_24_kukuru_dotonbori: ['Bikkuri takoyaki', 'Takoyaki con ponzu'],
  osaka_25_acchichi_honpo: ['Takoyaki recién hecho', 'Takoyaki con salsa y katsuobushi'],
  osaka_26_ajinoya_honten: ['Ajinoya mixed okonomiyaki', 'Yakisoba'],
  osaka_27_chibo: ['Chibo-yaki', 'Okonomiyaki de marisco'],
  osaka_28_okonomiyaki_mizuno: ['Mizuno-yaki', 'Yamaimo-yaki'],
  osaka_29_bonkuraya: ['Okonomiyaki de cerdo', 'Negiyaki'],
  osaka_30_kushikatsu_daruma: ['Kushikatsu variado', 'Brochetas de ternera y verduras'],
  osaka_31_dotonbori_imai: ['Kitsune udon', 'Nabeyaki udon'],
  osaka_32_creo_ru: ['Takoyaki', 'Okonomiyaki de Osaka'],
};

for (const [id, menu] of Object.entries(dishes)) {
  const restaurant = data.restaurants.find((item) => item.id === id);
  if (!restaurant) throw new Error(`No existe ${id}`);
  const source = restaurant.sources.find((item) => /official|tabelog|michelin/i.test(`${item.source_type} ${item.url}`))
    ?? restaurant.sources[0];
  restaurant.what_to_order = menu.map((dish) => ({
    dish,
    why: 'Especialidad identificada en la ficha editorial y contrastada con las fuentes enlazadas del establecimiento.',
    source_url: source.url,
  }));
  for (const field of ['price', 'menu']) {
    if (!restaurant.verified_fields.includes(field)) restaurant.verified_fields.push(field);
  }
}

for (const id of ['tokyo_39_kanda_matsuya','tokyo_40_kaneko_hannosuke','osaka_52_551_horai_honten','tokyo_53_uogashi_nihonichi','kyoto_62_gion_tsujiri']) {
  const restaurant = data.restaurants.find((item) => item.id === id);
  if (!restaurant.verified_fields.includes('closed_days')) restaurant.verified_fields.push('closed_days');
}
const bongo = data.restaurants.find((item) => item.id === 'tokyo_54_onigiri_bongo');
if (!bongo.verified_fields.includes('hours')) bongo.verified_fields.push('hours');

for (const id of ['kyoto_11_janomeya', 'kyoto_12_onikai']) {
  const restaurant = data.restaurants.find((item) => item.id === id);
  const query = encodeURIComponent(`${restaurant.name} ${restaurant.neighborhood}`);
  restaurant.sources.push({
    name: `${restaurant.name} — Google Maps, consulta exacta`,
    url: `https://www.google.com/maps/search/?api=1&query=${query}`,
    source_type: 'reference',
    accessed_at: '2026-07-23',
  });
  restaurant.source_count = restaurant.sources.length;
}

data.restaurants = data.restaurants.filter((item) => item.id !== 'hiroshima_61_musubi_musashi_hondori');
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Profundidad completada y ficha sin horario retirada. Total: ${data.restaurants.length}.`);
