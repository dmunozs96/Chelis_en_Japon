import { useEffect, useState } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

export function useShoppingGuideData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchJsonCached('/data/shopping_guide.json').then((json) => { if (!cancelled) setData(json); }).catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);
  return {
    categories: data?.categories ?? [],
    zones: data?.zones ?? [],
    stores: data?.stores ?? [],
    taxFreeRules: data?.tax_free_rules ?? null,
    customsReturn: data?.customs_return ?? null,
    electrical: data?.electrical ?? null,
    riskNotes: data?.risk_notes ?? [],
    day24Routes: data?.day24_routes ?? [],
    day24Excluded: data?.day24_excluded ?? null,
    wishlistTemplate: data?.wishlist_template ?? [],
    lastVerifiedAt: data?.last_verified_at,
    loading: !data && !error,
    error,
  };
}
