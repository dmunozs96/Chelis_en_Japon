import { useEffect, useState } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

export function useTravelToolsData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJsonCached('/data/travel_tools.json')
      .then((json) => { if (!cancelled) setData(json); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  return { data, loading: !data && !error, error };
}
