import React, { useState, useEffect } from 'react';

/* ---------------------------------------------------------------
   DualClock
   Shows two live clocks: JST (UTC+9) and CEST (UTC+2).
   The JST clock is labelled with the current trip city.
   --------------------------------------------------------------- */

const CLOCK_STYLES = `
.dual-clock {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px 0;
}

.clock-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 14px 24px;
  min-width: 140px;
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s;
}

.clock-pill--primary {
  border-color: var(--color-torii);
}

.clock-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.clock-pill--primary .clock-label {
  color: var(--color-torii);
}

.clock-time {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.04em;
  line-height: 1;
}

.clock-tz {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}
`;

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date, offsetHours) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60_000;
  const local = new Date(utc + offsetHours * 3_600_000);
  return `${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}`;
}

export default function DualClock({ currentCity = 'Japón' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const jstTime  = formatTime(now, +9);  // JST = UTC+9
  const cestTime = formatTime(now, +2);  // CEST = UTC+2 (Spain in August)

  return (
    <>
      <style>{CLOCK_STYLES}</style>
      <div className="dual-clock" role="region" aria-label="Relojes del viaje">
        <div className="clock-pill clock-pill--primary">
          <span className="clock-label">{currentCity}</span>
          <time className="clock-time" dateTime={now.toISOString()}>{jstTime}</time>
          <span className="clock-tz">JST · UTC+9</span>
        </div>

        <div className="clock-pill">
          <span className="clock-label">Madrid</span>
          <time className="clock-time" dateTime={now.toISOString()}>{cestTime}</time>
          <span className="clock-tz">CEST · UTC+2</span>
        </div>
      </div>
    </>
  );
}
