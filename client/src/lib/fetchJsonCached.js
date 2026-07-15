/**
 * fetchJsonCached
 *
 * fetch de JSON estáticos con dos niveles de resiliencia:
 *  1. Caché en memoria por URL (promesa compartida): los datos del viaje son
 *     inmutables durante la sesión — cada vista reutiliza la misma respuesta
 *     en vez de re-pedirla en cada montaje.
 *  2. Último snapshot bueno en localStorage: si la red falla (metro, campo,
 *     avión), se devuelve la última copia descargada en vez de romper la UI.
 *
 * Los datos solo cambian con un deploy; recargar la app con red renueva
 * ambas capas.
 */

const memory = new Map();

const storageKey = (url) => `json-cache:${url}`;

export function fetchJsonCached(url) {
  if (memory.has(url)) return memory.get(url);

  const promise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} loading ${url}`);
      const json = await res.json();
      try {
        localStorage.setItem(storageKey(url), JSON.stringify(json));
      } catch {
        // localStorage lleno o bloqueado — la caché en memoria sigue valiendo.
      }
      return json;
    } catch (err) {
      let stored = null;
      try {
        stored = localStorage.getItem(storageKey(url));
      } catch {}
      if (stored) return JSON.parse(stored);
      // Sin copia local: permitir que un montaje posterior lo reintente.
      memory.delete(url);
      throw err;
    }
  })();

  memory.set(url, promise);
  return promise;
}
