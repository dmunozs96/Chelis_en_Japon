import test from 'node:test';
import assert from 'node:assert/strict';
import { appPath, googleDirectionsUrl, googleMultiStopDirectionsUrl, parseLocation } from '../client/src/lib/navigation.js';

test('las rutas de aplicación se pueden compartir y recuperar', () => {
  const cases = [
    [{ view: 'today' }, '/'],
    [{ view: 'trip', date: '2026-08-18' }, '/viaje/2026-08-18'],
    [{ view: 'poi', id: 'fushimi-inari' }, '/poi/fushimi-inari'],
    [{ view: 'map', date: '2026-08-18', routeMode: true }, '/mapa/2026-08-18?modo=ruta'],
    [{ view: 'tool', tool: 'currency' }, '/herramienta/currency'],
  ];
  for (const [route, path] of cases) {
    assert.equal(appPath(route), path);
    const url = new URL(path, 'https://example.test');
    assert.deepEqual(parseLocation(url), route);
  }
});

test('los enlaces de navegación usan coordenadas verificadas', () => {
  const single = googleDirectionsUrl({ name: 'Sitio', lat: 35.1, lng: 139.2 });
  assert.match(single, /destination=35\.1%2C139\.2/);

  const multi = googleMultiStopDirectionsUrl([
    { lat: 35.1, lng: 139.1 },
    { lat: 35.2, lng: 139.2 },
    { lat: 35.3, lng: 139.3 },
  ]);
  assert.match(multi, /origin=35\.1%2C139\.1/);
  assert.match(multi, /waypoints=35\.2%2C139\.2/);
  assert.match(multi, /destination=35\.3%2C139\.3/);
});
