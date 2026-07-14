import { useState, useEffect } from 'react';

/**
 * usePoisData
 *
 * Loads pois_db.json from the /data directory. Returns the flat array of
 * POIs plus a lookup helper by id.
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

    async function load() {
      try {
        const res = await fetch('/data/pois_db.json');
        if (!res.ok) throw new Error(`HTTP ${res.status} loading pois_db.json`);
        const json = await res.json();
        if (!cancelled) {
          setPois(json.pois ?? []);
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

  function getPoiById(id) {
    if (!id) return null;
    return pois.find(p => p.id === id) ?? null;
  }

  return { pois, getPoiById, loading, error };
}
