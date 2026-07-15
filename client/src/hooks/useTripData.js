import { useState, useEffect } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

/**
 * useTripData
 *
 * Loads trip.json from the /data directory (served as a static asset
 * by Vite in dev and by Express in production). Cached: se descarga una
 * sola vez por sesión aunque varias vistas monten el hook.
 *
 * Returns:
 *   { tripData, days, flights, hotels, trains, loading, error }
 *
 * `days` is the flat array of day objects for convenience.
 */
export function useTripData() {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchJsonCached('/data/trip.json')
      .then((json) => {
        if (!cancelled) {
          setTripData(json);
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

  return {
    tripData,
    days:    tripData?.days    ?? [],
    flights: tripData?.flights ?? null,
    hotels:  tripData?.hotels  ?? [],
    trains:  tripData?.trains  ?? [],
    loading,
    error,
  };
}

/**
 * useAlertsData
 *
 * Loads alerts.json from the /data directory.
 *
 * Returns:
 *   { alerts, loading, error }
 */
export function useAlertsData() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchJsonCached('/data/alerts.json')
      .then((json) => {
        if (!cancelled) {
          setAlerts(json.alerts ?? []);
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

  return { alerts, loading, error };
}

/**
 * getUnreadActionCount
 *
 * Counts alerts of type "action" that have not been dismissed.
 * Uses localStorage key 'dismissed_alerts' (JSON array of IDs).
 */
export function getUnreadActionCount(alerts) {
  if (!alerts || alerts.length === 0) return 0;
  let dismissed = [];
  try {
    dismissed = JSON.parse(localStorage.getItem('dismissed_alerts') || '[]');
  } catch {
    dismissed = [];
  }
  return alerts.filter(
    (a) => a.type === 'action' && !dismissed.includes(a.id)
  ).length;
}
