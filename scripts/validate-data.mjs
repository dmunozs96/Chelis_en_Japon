import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const readJson = (relativePath) => JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const isHttpUrl = (value) => {
  if (!value) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

export function validateProject() {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const unique = (items, label) => {
    const seen = new Set();
    for (const id of items) {
      check(Boolean(id), `${label}: ID vacío`);
      check(!seen.has(id), `${label}: ID duplicado "${id}"`);
      seen.add(id);
    }
    return seen;
  };

  const tripData = readJson('data/trip.json');
  const { pois } = readJson('data/pois_db.json');
  const { restaurants } = readJson('data/restaurants_db.json');
  const { alerts } = readJson('data/alerts.json');
  const travelTools = readJson('data/travel_tools.json');
  const days = tripData.days ?? [];
  const trip = tripData.trip ?? {};

  check(isDate(trip.start_date), 'trip.start_date no es una fecha válida');
  check(isDate(trip.end_date), 'trip.end_date no es una fecha válida');
  check(!Number.isNaN(Date.parse(trip.departure_datetime)), 'trip.departure_datetime no es una fecha/hora válida');
  check(days.length > 0, 'trip.json no contiene días');
  check(days[0]?.date === trip.start_date, 'El primer día no coincide con trip.start_date');
  check(days.at(-1)?.date === trip.end_date, 'El último día no coincide con trip.end_date');

  unique(days.map((day) => day.date), 'Días');
  for (let i = 0; i < days.length; i += 1) {
    check(isDate(days[i].date), `Día ${i + 1}: fecha inválida`);
    if (i > 0) {
      const expected = new Date(`${days[i - 1].date}T00:00:00Z`);
      expected.setUTCDate(expected.getUTCDate() + 1);
      check(days[i].date === expected.toISOString().slice(0, 10), `Días no consecutivos: ${days[i - 1].date} → ${days[i].date}`);
    }
  }

  const poiIds = unique(pois.map((poi) => poi.id), 'POIs');
  for (const poi of pois) {
    check(Number.isFinite(poi.lat) && poi.lat >= -90 && poi.lat <= 90, `POI ${poi.id}: latitud inválida`);
    check(Number.isFinite(poi.lng) && poi.lng >= -180 && poi.lng <= 180, `POI ${poi.id}: longitud inválida`);
    check(isHttpUrl(poi.website), `POI ${poi.id}: website inválida`);
    check(existsSync(resolve(root, `client/public/pois/${poi.id}.jpg`)), `POI ${poi.id}: falta la imagen local`);
  }

  for (const day of days) {
    const dayPoiIds = new Set((day.pois ?? []).map((poi) => poi.id));
    for (const poiId of dayPoiIds) check(poiIds.has(poiId), `${day.date}: POI inline desconocido "${poiId}"`);
    for (const block of day.blocks ?? []) {
      if (block.poi_id) {
        check(poiIds.has(block.poi_id), `${day.date}: bloque referencia POI desconocido "${block.poi_id}"`);
        check(dayPoiIds.has(block.poi_id), `${day.date}: bloque referencia "${block.poi_id}" pero no está en days[].pois`);
      }
      for (const step of block.steps ?? []) {
        if (step.poi_id) check(poiIds.has(step.poi_id), `${day.date}: step referencia POI desconocido "${step.poi_id}"`);
      }
    }
  }

  unique(restaurants.map((restaurant) => restaurant.id), 'Restaurantes');
  for (const restaurant of restaurants) {
    check(Number.isFinite(restaurant.lat) && Number.isFinite(restaurant.lng), `Restaurante ${restaurant.id}: coordenadas inválidas`);
    check(isHttpUrl(restaurant.reservation_url), `Restaurante ${restaurant.id}: URL de reserva inválida`);
    for (const source of restaurant.sources ?? []) {
      check(typeof source?.name === 'string' && source.name.length > 0, `Restaurante ${restaurant.id}: fuente sin nombre`);
      check(isHttpUrl(source?.url), `Restaurante ${restaurant.id}: fuente inválida`);
    }
  }

  unique(alerts.map((alert) => alert.id), 'Alertas');
  const dayDates = new Set(days.map((day) => day.date));
  for (const alert of alerts) {
    if (alert.due_date) check(isDate(alert.due_date), `Alerta ${alert.id}: due_date inválida`);
    if (alert.related_day) check(dayDates.has(alert.related_day), `Alerta ${alert.id}: related_day fuera del viaje`);
    check(isHttpUrl(alert.action_url), `Alerta ${alert.id}: action_url inválida`);
  }

  const hotelIds = new Set((tripData.hotels ?? []).map((hotel) => hotel.id));
  const coveredHotelIds = new Set();
  for (const access of travelTools.hotel_access ?? []) {
    check(Array.isArray(access.hotel_ids) && access.hotel_ids.length > 0, 'Acceso de hotel sin hotel_ids');
    for (const hotelId of access.hotel_ids ?? []) {
      check(hotelIds.has(hotelId), `Acceso referencia hotel desconocido "${hotelId}"`);
      check(!coveredHotelIds.has(hotelId), `Hotel ${hotelId}: acceso duplicado`);
      coveredHotelIds.add(hotelId);
    }
    check(Array.isArray(access.steps) && access.steps.length > 0, `Acceso ${access.hotel_ids?.[0]}: sin pasos`);
    check(isHttpUrl(access.source), `Acceso ${access.hotel_ids?.[0]}: fuente inválida`);
  }
  for (const hotelId of hotelIds) check(coveredHotelIds.has(hotelId), `Hotel ${hotelId}: falta guía de acceso`);

  const emergency = travelTools.emergency ?? {};
  check(emergency.police?.number === '110', 'Número de policía distinto de 110');
  check(emergency.ambulance?.number === '119', 'Número de ambulancia distinto de 119');
  for (const source of emergency.sources ?? []) check(isHttpUrl(source.url), 'Emergencias: fuente inválida');

  const icCard = travelTools.ic_card ?? {};
  check(Array.isArray(icCard.purchase) && icCard.purchase.length > 0, 'IC card: faltan instrucciones de compra');
  check(Array.isArray(icCard.use) && icCard.use.length > 0, 'IC card: faltan instrucciones de uso');
  check(Array.isArray(icCard.recharge) && icCard.recharge.length > 0, 'IC card: faltan instrucciones de recarga');
  check(Array.isArray(icCard.warnings) && icCard.warnings.length > 0, 'IC card: faltan advertencias');
  for (const source of icCard.sources ?? []) check(isHttpUrl(source.url), 'IC card: fuente inválida');

  const phraseData = travelTools.phrases ?? {};
  const categoryIds = unique((phraseData.categories ?? []).map((category) => category.id), 'Categorías de frases');
  check(categoryIds.size === 6, `Frases: se esperaban 6 categorías y hay ${categoryIds.size}`);
  check((phraseData.items ?? []).length >= 24, 'Frases: debe haber al menos 24 frases útiles');
  for (const phrase of phraseData.items ?? []) {
    check(categoryIds.has(phrase.category), `Frase "${phrase.es}": categoría desconocida`);
    check(Boolean(phrase.es && phrase.ja && phrase.reading), 'Frase incompleta');
  }
  for (const categoryId of categoryIds) check(phraseData.items.some((phrase) => phrase.category === categoryId), `Categoría ${categoryId}: sin frases`);
  for (const source of phraseData.sources ?? []) check(isHttpUrl(source.url), 'Frases: fuente inválida');

  const currency = travelTools.currency ?? {};
  check(Number.isFinite(currency.default_rate) && currency.default_rate > 0, 'Conversor: tipo inicial inválido');
  check(isDate(currency.rate_date), 'Conversor: fecha del tipo inválida');
  check(isHttpUrl(currency.source), 'Conversor: fuente inválida');

  const climate = travelTools.climate ?? {};
  const expectedClimateCities = new Set(['Tokio', 'Hakone', 'Kioto', 'Hiroshima', 'Osaka']);
  const climateCities = unique((climate.cities ?? []).map((city) => city.city), 'Ciudades de clima');
  for (const city of expectedClimateCities) check(climateCities.has(city), `Clima: falta ${city}`);
  for (const city of climate.cities ?? []) {
    if (city.mean_c !== null) {
      check(Number.isFinite(city.mean_c) && Number.isFinite(city.max_c) && Number.isFinite(city.min_c), `Clima ${city.city}: temperaturas inválidas`);
      check(city.max_c >= city.mean_c && city.mean_c >= city.min_c, `Clima ${city.city}: temperaturas incoherentes`);
    }
    check(Boolean(city.note), `Clima ${city.city}: falta orientación`);
  }
  for (const source of climate.sources ?? []) check(isHttpUrl(source.url), 'Clima: fuente inválida');

  return { errors, counts: { days: days.length, pois: pois.length, restaurants: restaurants.length, alerts: alerts.length, hotelAccess: coveredHotelIds.size, phrases: phraseData.items?.length ?? 0 } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateProject();
  if (result.errors.length) {
    console.error(`Validación fallida (${result.errors.length}):`);
    result.errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    const { days, pois, restaurants, alerts, hotelAccess, phrases } = result.counts;
    console.log(`Datos válidos: ${days} días, ${pois} POIs, ${restaurants} restaurantes, ${alerts} alertas, ${hotelAccess} accesos y ${phrases} frases.`);
  }
}
