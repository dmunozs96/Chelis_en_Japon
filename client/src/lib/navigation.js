const TOOL_IDS = new Set(['emergency', 'last-mile', 'ic-card', 'phrases', 'currency', 'climate', 'preparation', 'culture', 'shopping']);

export function parseLocation(location = window.location) {
  const parts = location.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const query = new URLSearchParams(location.search);

  if (parts[0] === 'viaje') return { view: 'trip', date: parts[1] ?? null };
  if (parts[0] === 'alertas') return { view: 'alerts' };
  if (parts[0] === 'restaurantes') return { view: 'restaurants' };
  if (parts[0] === 'mas') return { view: 'more' };
  if (parts[0] === 'poi' && parts[1]) return { view: 'poi', id: parts[1] };
  if (parts[0] === 'mapa') return { view: 'map', date: parts[1] ?? null, routeMode: query.get('modo') === 'ruta' };
  if (parts[0] === 'billetes') return { view: 'tickets' };
  if (parts[0] === 'planificador') return { view: 'planner' };
  if (parts[0] === 'herramienta' && TOOL_IDS.has(parts[1])) return { view: 'tool', tool: parts[1] };
  return { view: 'today' };
}

export function appPath(route) {
  switch (route.view) {
    case 'trip': return route.date ? `/viaje/${encodeURIComponent(route.date)}` : '/viaje';
    case 'alerts': return '/alertas';
    case 'restaurants': return '/restaurantes';
    case 'more': return '/mas';
    case 'poi': return `/poi/${encodeURIComponent(route.id)}`;
    case 'map': return `/mapa/${encodeURIComponent(route.date ?? 'lugar')}${route.routeMode ? '?modo=ruta' : ''}`;
    case 'tickets': return '/billetes';
    case 'planner': return '/planificador';
    case 'tool': return `/herramienta/${encodeURIComponent(route.tool)}`;
    default: return '/';
  }
}

export function googleDirectionsUrl({ lat, lng, name }) {
  const destination = lat != null && lng != null ? `${lat},${lng}` : name;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination ?? '')}&travelmode=transit`;
}

export function googleMultiStopDirectionsUrl(points) {
  const valid = points.filter((point) => point?.lat != null && point?.lng != null);
  if (valid.length < 2) return null;
  const origin = `${valid[0].lat},${valid[0].lng}`;
  const destination = `${valid.at(-1).lat},${valid.at(-1).lng}`;
  const waypoints = valid.slice(1, -1).map((point) => `${point.lat},${point.lng}`).join('|');
  const params = new URLSearchParams({ api: '1', origin, destination, travelmode: 'transit' });
  if (waypoints) params.set('waypoints', waypoints);
  return `https://www.google.com/maps/dir/?${params}`;
}
