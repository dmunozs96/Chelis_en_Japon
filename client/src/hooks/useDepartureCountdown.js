import { useEffect, useMemo, useState } from 'react';

export function calculateDepartureCountdown(departureDatetime, now = new Date()) {
  const departure = departureDatetime ? new Date(departureDatetime) : null;
  if (!departure || Number.isNaN(departure.getTime())) return null;

  const diffMs = Math.max(0, departure.getTime() - now.getTime());
  return {
    totalMs: diffMs,
    days: Math.floor(diffMs / 86400000),
    hours: Math.floor((diffMs % 86400000) / 3600000),
    minutes: Math.floor((diffMs % 3600000) / 60000),
  };
}

export function useDepartureCountdown(departureDatetime) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const update = () => setNow(new Date());
    const delay = (60 - new Date().getSeconds()) * 1000;
    let interval;
    const timeout = setTimeout(() => {
      update();
      interval = setInterval(update, 60000);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return useMemo(() => calculateDepartureCountdown(departureDatetime, now), [departureDatetime, now]);
}
