import React, { useState, useEffect } from 'react';

/* ---------------------------------------------------------------
   DualClock (compacto)
   Dos relojes en vivo: JST (UTC+9) y Madrid/CEST (UTC+2).
   Diseñado para integrarse en el header sin bordes ni cards.
   --------------------------------------------------------------- */

const STYLES = `
.dual-clock-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.clock-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.1;
}

.clock-block__label {
  font-size: 11px;
  font-weight: 500;
  color: var(--label-secondary);
  letter-spacing: 0.2px;
}

.clock-block__time {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  letter-spacing: -0.3px;
  font-variant-numeric: tabular-nums;
}

.clock-divider {
  width: 1px;
  height: 28px;
  background: var(--separator);
  flex-shrink: 0;
}
`;

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date, offsetHours) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60_000;
  const local = new Date(utc + offsetHours * 3_600_000);
  return `${pad(local.getHours())}:${pad(local.getMinutes())}`;
}

export default function DualClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const jstTime  = formatTime(now, +9);   // JST = UTC+9
  const cestTime = formatTime(now, +2);   // CEST = UTC+2 (España en agosto)

  return (
    <>
      <style>{STYLES}</style>
      <div className="dual-clock-compact" role="region" aria-label="Relojes del viaje">
        <div className="clock-block">
          <span className="clock-block__label">Madrid</span>
          <time className="clock-block__time">{cestTime}</time>
        </div>
        <div className="clock-divider" aria-hidden="true" />
        <div className="clock-block">
          <span className="clock-block__label">Japón</span>
          <time className="clock-block__time">{jstTime}</time>
        </div>
      </div>
    </>
  );
}
