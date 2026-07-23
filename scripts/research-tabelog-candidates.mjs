import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outPath = resolve(root, 'data/restaurant_candidates.json');
const headers = { 'user-agent': 'Mozilla/5.0 (compatible; ChelisJapanEditorialAudit/1.0)' };

const areas = {
  Tokyo: 'https://tabelog.com/en/tokyo/rstLst/',
  Kyoto: 'https://tabelog.com/en/kyoto/A2601/rstLst/',
  Osaka: 'https://tabelog.com/en/osaka/A2701/rstLst/',
  Hiroshima: 'https://tabelog.com/en/hiroshima/A3401/rstLst/',
  Hakone: 'https://tabelog.com/en/kanagawa/A1410/A141001/rstLst/',
};

const decode = (value = '') => value
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', ' ');
const text = (value = '') => decode(value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' '))
  .replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();
const section = (html, heading, nextHeading) => {
  const startMatch = new RegExp(`<th>\\s*${heading}\\s*</th>`, 'i').exec(html);
  if (!startMatch) return null;
  const start = startMatch.index;
  const tail = html.slice(start + startMatch[0].length);
  const endMatch = nextHeading ? new RegExp(`<th>\\s*${nextHeading}\\s*</th>`, 'i').exec(tail) : null;
  const end = endMatch ? start + startMatch[0].length + endMatch.index : start + 5000;
  return text(html.slice(start, end)).replace(new RegExp(`^${heading}\\s*`, 'i'), '').trim();
};

async function fetchText(url) {
  const response = await fetch(url, { headers, redirect: 'follow' });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function collectLinks(base, pages) {
  const links = [];
  for (let page = 1; page <= pages; page += 1) {
    const url = `${base}${page}/?SrtT=rt`;
    const html = await fetchText(url);
    for (const match of html.matchAll(/<a[^>]+class="[^"]*list-rst__rst-name-target[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      links.push({ url: match[1], listing_name: text(match[2]) });
    }
  }
  return [...new Map(links.map((item) => [item.url, item])).values()];
}

async function inspect({ url, listing_name: listingName }, city) {
  try {
    const html = await fetchText(url);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    const schema = blocks.map((match) => {
      try { return JSON.parse(match[1]); } catch { return null; }
    }).find((item) => item?.['@type'] === 'Restaurant');
    if (!schema?.geo?.latitude || !schema?.telephone || !schema?.priceRange) return null;

    const websiteMatch = html.match(/<p class="homepage"><a[^>]+href="([^"]+)"/);
    const website = websiteMatch ? decode(websiteMatch[1]) : null;
    const hours = section(html, 'Business hours', 'Average price');
    const reservation = section(html, 'Reservation availability', 'Address');
    const address = section(html, 'Address', 'Transportation');
    if (!hours || !address) return null;

    let officialFinalUrl = null;
    if (website) {
      try {
        const official = await fetch(website, { headers, redirect: 'follow', signal: AbortSignal.timeout(10000) });
        if (official.status < 500) officialFinalUrl = official.url;
      } catch {}
    }

    return {
      city,
      name: schema.name || listingName,
      name_ja: null,
      tabelog_url: url,
      official_url: officialFinalUrl,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${schema.name || listingName} ${address}`)}`,
      address,
      lat: schema.geo.latitude,
      lng: schema.geo.longitude,
      telephone: schema.telephone,
      price_range: schema.priceRange,
      cuisines: String(schema.servesCuisine ?? '').split(',').filter(Boolean),
      hours,
      reservation,
      rating: Number(schema.aggregateRating?.ratingValue ?? 0),
      rating_count: Number(schema.aggregateRating?.ratingCount ?? 0),
      checked_at: '2026-07-23',
    };
  } catch {
    return null;
  }
}

const output = { generated_at: '2026-07-23', candidates: [] };
for (const [city, base] of Object.entries(areas)) {
  const pages = city === 'Tokyo' ? 30 : city === 'Hakone' ? 3 : 12;
  const links = await collectLinks(base, pages);
  let cursor = 0;
  const rows = [];
  async function worker() {
    while (cursor < links.length) {
      const row = await inspect(links[cursor++], city);
      if (row) rows.push(row);
    }
  }
  await Promise.all(Array.from({ length: 10 }, worker));
  rows.sort((a, b) => b.rating - a.rating || b.rating_count - a.rating_count);
  output.candidates.push(...rows);
  console.log(`${city}: ${links.length} listados, ${rows.length} candidatos con ficha individual y datos estructurados completos.`);
}

writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Guardados ${output.candidates.length} candidatos en ${outPath}.`);
