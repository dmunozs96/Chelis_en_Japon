import React, { useState, useRef, useEffect } from 'react';
import { DayCard } from './TodayView.jsx';

/* ---------------------------------------------------------------
   DayNav
   Strip horizontal scrollable de todos los días del viaje.
   Al seleccionar un día muestra su DayCard con diseño premium.
   --------------------------------------------------------------- */

const STYLES = `
.daynav {
  display: flex;
  flex-direction: column;
}

/* --- Strip de días sticky bajo el header --- */
.daynav__strip-wrapper {
  position: sticky;
  top: 60px;   /* altura del header */
  z-index: 50;
  background: var(--bg-secondary);
  padding: 12px var(--page-padding) 0;
  border-bottom: 1px solid var(--separator);
  padding-bottom: 12px;
}

.daynav__strip {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}
.daynav__strip::-webkit-scrollbar { display: none; }

/* --- Pill de día --- */
.daynav__pill {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border-radius: var(--radius-btn);
  border: none;
  background: var(--bg-surface);
  cursor: pointer;
  scroll-snap-align: center;
  transition: background var(--duration-micro) var(--ease), color var(--duration-micro) var(--ease);
  min-width: 52px;
  font-family: var(--font);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  -webkit-tap-highlight-color: transparent;
}

.daynav__pill:hover:not(.daynav__pill--active) {
  background: #EBEBF0;
}

.daynav__pill--active {
  background: var(--accent);
  box-shadow: 0 2px 12px rgba(232, 0, 45, 0.35);
}

.daynav__pill--free:not(.daynav__pill--active) {
  background: var(--accent-soft);
}

.pill-weekday {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
  color: var(--label-secondary);
}

.pill-day {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--label-primary);
}

/* Estados de color del número del día según tipo */
.daynav__pill--free:not(.daynav__pill--active) .pill-day {
  color: var(--accent);
}

/* Estado activo: todo blanco */
.daynav__pill--active .pill-weekday,
.daynav__pill--active .pill-day {
  color: #FFFFFF;
}

/* --- Contenido del día --- */
.daynav__detail {
  padding: 0;
}
`;

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DayNav({ days }) {
  const today = todayISO();

  const defaultIndex = Math.max(
    0,
    days.findIndex(d => d.date === today)
  );

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const tabRefs = useRef([]);
  const stripRef = useRef(null);

  useEffect(() => {
    const el = tabRefs.current[selectedIndex];
    if (el && stripRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedIndex]);

  if (!days.length) return null;

  const selectedDay = days[selectedIndex];

  return (
    <>
      <style>{STYLES}</style>
      <div className="daynav">
        {/* Strip de días */}
        <div className="daynav__strip-wrapper">
          <div
            className="daynav__strip"
            ref={stripRef}
            role="tablist"
            aria-label="Días del viaje"
          >
            {days.map((day, i) => {
              const [y, m, d] = day.date.split('-').map(Number);
              const dateObj = new Date(y, m - 1, d);
              const weekday = WEEKDAYS[dateObj.getDay()];
              const isSelected = i === selectedIndex;
              const isFree = day.type === 'free';

              const pillClass = [
                'daynav__pill',
                isSelected ? 'daynav__pill--active' : '',
                isFree && !isSelected ? 'daynav__pill--free' : '',
              ].filter(Boolean).join(' ');

              return (
                <button
                  key={day.date}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${day.date} — ${day.city}`}
                  className={pillClass}
                  ref={el => (tabRefs.current[i] = el)}
                  onClick={() => setSelectedIndex(i)}
                >
                  <span className="pill-weekday">{weekday}</span>
                  <span className="pill-day">{d}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle del día seleccionado */}
        <div className="daynav__detail" role="tabpanel">
          {selectedDay && <DayCard day={selectedDay} days={days} />}
        </div>
      </div>
    </>
  );
}
