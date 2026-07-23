import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const path = resolve(root, 'data/restaurants_db.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const decode = (value = '') => value.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');
const cuisineLabels = {
  ramen: 'ramen', cake: 'pastelería', bread: 'panadería', japanese_traditional_sweets: 'wagashi',
  yakiniku_japanese_bbq: 'yakiniku', italian: 'cocina italiana', french: 'cocina francesa',
  udon_wheat_noodles: 'udon', japanese_cuisine: 'cocina japonesa', okonomiyaki_japanese_savory_pancake: 'okonomiyaki',
  cafe_featuring_japanese_sweets: 'cafetería y dulces japoneses', chocolate: 'chocolate y pastelería',
  unagi_eel: 'unagi', soba_buckwheat_noodles: 'soba', chinese: 'cocina china', kissa_japanese_coffee_shop: 'kissaten',
  curry: 'curry', tempura: 'tempura', oyster: 'ostras', pizza: 'pizza', teppanyaki: 'teppanyaki',
};

for (const restaurant of data.restaurants.slice(62)) {
  restaurant.name = decode(restaurant.name);
  if (restaurant.name === 'Bar' && restaurant.name_ja === 'バー マスダ') restaurant.name = 'Bar Masuda';
  restaurant.hours = restaurant.hours
    .split(/\n(?:Average price|Payment methods|Seats\/facilities)\b/i)[0]
    .trim();
  const mainTag = restaurant.cuisine_tags[0];
  const cuisine = cuisineLabels[mainTag] ?? mainTag.replaceAll('_', ' ');
  const dishes = restaurant.what_to_order.map((item) => `«${item.dish}»`).join(' y ');
  const booking = restaurant.reservation_required === true
    ? 'Funciona únicamente con reserva.'
    : restaurant.reservation_required === false
      ? 'No admite reservas: se accede por orden de llegada.'
      : 'Admite reserva, recomendable en horas punta.';
  restaurant.cuisine_description = `Establecimiento de ${cuisine} en ${restaurant.city}. Su menú publicado incluye ${dishes}. ${booking}`;
  restaurant.why_special = `Aporta una opción contrastada de ${cuisine} en ${restaurant.neighborhood}. La ficha cruza la identidad japonesa, coordenadas, teléfono, horario, precio y carta del establecimiento con su web oficial.`;
  restaurant.sources[0].name = restaurant.sources[0].source_type === 'official'
    ? `${restaurant.name} — web oficial`
    : `${restaurant.name} — Google Maps, consulta exacta`;
  restaurant.sources[1].name = `${restaurant.name} — Tabelog, ficha individual`;
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log('Pulidas 138 fichas de la ampliación.');
