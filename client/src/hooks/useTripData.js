import { useState, useEffect } from 'react';

/**
 * useTripData
 *
 * Loads trip.json from the /data directory (served as a static asset
 * by Vite in dev and by Express in production).
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

    async function load() {
      try {
        const res = await fetch('/data/alerts.json');
        if (!res.ok) throw new Error(`HTTP ${res.status} loading alerts.json`);
        const json = await res.json();
        if (!cancelled) {
          setAlerts(json.alerts ?? []);
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
