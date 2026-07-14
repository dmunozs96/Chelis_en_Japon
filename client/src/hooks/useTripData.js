import { useState, useEffect } from 'react';

/**
 * useTripData
 *
 * Loads trip.json from the /data directory (served as a static asset
 * by Vite in dev and by Express in production).
 *
 * Returns:
 *   { tripData, days, loading, error }
 *
 * `days` is the flat array of day objects for convenience.
 */
export function useTripData() {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/data/trip.json');
        if (!res.ok) throw new Error(`HTTP ${res.status} loading trip.json`);
        const json = await res.json();
        if (!cancelled) {
          setTripData(json);
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

  return {
    tripData,
    days: tripData?.days ?? [],
    loading,
    error,
  };
}
