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
  top: calc(64px + env(safe-area-inset-top));
  z-index: 50;
  padding: 0 var(--page-padding);
  border-bottom: 1px solid var(--separator);
  background: rgb(13 14 16 / 96%);
}

.daynav__strip {
  display: flex;
  overflow-x: auto;
  gap: 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.daynav__strip::-webkit-scrollbar { display: none; }

/* --- Pill de día --- */
.daynav__pill {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 56px;
  min-height: 62px;
  padding: 8px 12px;
  border-radius: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  scroll-snap-align: center;
  transition: color var(--duration-micro) var(--ease);
  font-family: var(--font);
  box-shadow: none;
  -webkit-tap-highlight-color: transparent;
}

.daynav__pill:hover:not(.daynav__pill--active) {
  background: transparent;
}

.daynav__pill--active {
  background: transparent;
  box-shadow: none;
}

.daynav__pill--active::after {
  position: absolute;
  right: 12px;
  bottom: -1px;
  left: 12px;
  height: 2px;
  background: var(--torii-500);
  content: "";
}

.daynav__pill--free:not(.daynav__pill--active) {
  background: transparent;
}

.pill-weekday {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  line-height: 1;
  color: var(--label-secondary);
}

.pill-day {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--label-primary);
}

/* Estados de color del número del día según tipo */
.daynav__pill--free:not(.daynav__pill--active) .pill-day {
  color: var(--paper-300);
}

/* Estado activo: tinta clara y subrayado de marca */
.daynav__pill--active .pill-weekday,
.daynav__pill--active .pill-day {
  color: var(--paper-100);
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

export default function DayNav({ days, selectedDate, onSelectedDateChange, onOpenMap, onOpenPoi, onOpenRoute }) {
  const today = todayISO();

  const defaultIndex = Math.max(
    0,
    days.findIndex(d => d.date === today)
  );

  const selectedIndex = Math.max(0, days.findIndex((day) => day.date === selectedDate));
  const tabRefs = useRef([]);
  const stripRef = useRef(null);

  useEffect(() => {
    const el = tabRefs.current[selectedIndex];
    if (el && stripRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (days.length && !selectedDate) onSelectedDateChange(days[defaultIndex].date);
  }, [days, defaultIndex, selectedDate, onSelectedDateChange]);

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
                  onClick={() => onSelectedDateChange(day.date)}
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
          {selectedDay && (
            <DayCard
              key={selectedDay.date}
              day={selectedDay}
              days={days}
              onOpenMap={onOpenMap}
              onOpenPoi={onOpenPoi}
              onOpenRoute={onOpenRoute}
            />
          )}
        </div>
      </div>
    </>
  );
}
