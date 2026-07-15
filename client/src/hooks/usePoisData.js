import { useState, useEffect } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

/**
 * usePoisData
 *
 * Loads pois_db.json from the /data directory. Returns the flat array of
 * POIs plus a lookup helper by id. Cached: una sola descarga por sesión.
 *
 * Returns:
 *   { pois, getPoiById, loading, error }
 */
export function usePoisData() {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchJsonCached('/data/pois_db.json')
      .then((json) => {
        if (!cancelled) {
          setPois(json.pois ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  function getPoiById(id) {
    if (!id) return null;
    return pois.find(p => p.id === id) ?? null;
  }

  return { pois, getPoiById, loading, error };
}
