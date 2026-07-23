import { useEffect, useState } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

export function useShoppingGuideData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchJsonCached('/data/shopping_guide.json?v=4-watch-photos-geek')
      .then((json) => { if (!cancelled) setData(json); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);
  return { data, loading: !data && !error, error };
}
