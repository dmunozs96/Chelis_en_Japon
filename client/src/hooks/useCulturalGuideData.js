import { useEffect, useState } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

export function useCulturalGuideData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchJsonCached('/data/cultural_guide.json').then((json) => { if (!cancelled) setData(json); }).catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);
  return { topics: data?.topics ?? [], sources: data?.sources ?? [], lastVerifiedAt: data?.last_verified_at, loading: !data && !error, error };
}
