import { useState, useEffect } from 'react';

/**
 * useRestaurantsData
 *
 * Loads restaurants_db.json from the /data directory. Returns the flat
 * array of restaurants plus lookup/filter helpers. 100% offline — no
 * network calls beyond the initial static fetch.
 *
 * Returns:
 *   { restaurants, getRestaurantById, getRestaurantsByCity, loading, error }
 */

// trip.json usa nombres de ciudad en español; restaurants_db.json en inglés.
export const CITY_ES_TO_EN = {
  Tokio: 'Tokyo',
  Kioto: 'Kyoto',
  Hiroshima: 'Hiroshima',
  Osaka: 'Osaka',
};

export function useRestaurantsData() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/data/restaurants_db.json');
        if (!res.ok) throw new Error(`HTTP ${res.status} loading restaurants_db.json`);
        const json = await res.json();
        if (!cancelled) {
          setRestaurants(json.restaurants ?? []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function getRestaurantById(id) {
    if (!id) return null;
    return restaurants.find(r => r.id === id) ?? null;
  }

  function getRestaurantsByCity(cityEsOrEn) {
    const cityEn = CITY_ES_TO_EN[cityEsOrEn] ?? cityEsOrEn;
    return restaurants.filter(r => r.city === cityEn);
  }

  return { restaurants, getRestaurantById, getRestaurantsByCity, loading, error };
}

/** Distancia aproximada en km entre dos puntos (fórmula haversine). */
export function distanceKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some((v) => v == null)) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
