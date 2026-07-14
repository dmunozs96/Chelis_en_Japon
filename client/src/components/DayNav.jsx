import React, { useState, useRef, useEffect } from 'react';
import { DayCard } from './TodayView.jsx';

/* ---------------------------------------------------------------
   DayNav
   Horizontal scrollable navigation strip across all 13 trip days.
   Clicking a day tab shows that day's full plan below.
   The "today" tab is highlighted; selected tab is also highlighted.
   --------------------------------------------------------------- */

const STYLES = `
.daynav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* --- Scrollable tab strip --- */
.daynav__strip-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-bg);
  border-bottom: 2px solid var(--color-border);
  padding: 0 4px;
}

.daynav__strip {
  display: flex;
  overflow-x: auto;
  gap: 4px;
  padding: 8px 4px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  /* Hide scrollbar visually but keep functionality */
  scrollbar-width: none;
}
.daynav__strip::-webkit-scrollbar { display: none; }

/* --- Individual day tab --- */
.daynav__tab {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  background: var(--color-surface);
  cursor: pointer;
  scroll-snap-align: center;
  transition: background 0.15s, border-color 0.15s;
  min-width: 52px;
  font-family: inherit;
}

.daynav__tab:hover {
  background: #F3F4F6;
}

.daynav__tab--today {
  border-color: var(--color-torii) !important;
}

.daynav__tab--selected {
  background: var(--color-torii);
  border-color: var(--color-torii);
}

.daynav__tab--selected .tab-weekday,
.daynav__tab--selected .tab-day {
  color: white;
}

.daynav__tab--free .tab-day {
  color: var(--color-free-accent);
}
.daynav__tab--transit_out .tab-day,
.daynav__tab--transit_return .tab-day {
  color: var(--color-transit-accent);
}
.daynav__tab--selected.daynav__tab--free .tab-day,
.daynav__tab--selected.daynav__tab--transit_out .tab-day,
.daynav__tab--selected.daynav__tab--transit_return .tab-day {
  color: white;
}

.tab-weekday {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  line-height: 1;
}

.tab-day {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.1;
}

.tab-type-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-top: 3px;
  background: var(--color-border);
}
.daynav__tab--free      .tab-type-dot { background: var(--color-free-accent); }
.daynav__tab--transit_out .tab-type-dot,
.daynav__tab--transit_return .tab-type-dot { background: var(--color-transit-accent); }
.daynav__tab--arrival .tab-type-dot { background: #059669; }
.daynav__tab--selected .tab-type-dot { background: rgba(255,255,255,0.7); }

/* --- Day detail area --- */
.daynav__detail {
  padding: 20px 16px 0;
}
`;

const WEEKDAYS = ['dom','lun','mar','mié','jue','vie','sáb'];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function DayNav({ days }) {
  const today = todayISO();

  // Default to today if in range, otherwise first day.
  const defaultIndex = Math.max(
    0,
    days.findIndex(d => d.date === today)
  );

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const tabRefs = useRef([]);
  const stripRef = useRef(null);

  // Scroll the selected tab into view on mount and on change.
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
        {/* Tab strip */}
        <div className="daynav__strip-wrapper">
          <div className="daynav__strip" ref={stripRef} role="tablist" aria-label="Días del viaje">
            {days.map((day, i) => {
              const [y, m, d] = day.date.split('-').map(Number);
              const dateObj = new Date(y, m - 1, d);
              const weekday = WEEKDAYS[dateObj.getDay()];
              const isToday    = day.date === today;
              const isSelected = i === selectedIndex;

              const tabClass = [
                'daynav__tab',
                `daynav__tab--${day.type}`,
                isToday    ? 'daynav__tab--today'    : '',
                isSelected ? 'daynav__tab--selected' : '',
              ].filter(Boolean).join(' ');

              return (
                <button
                  key={day.date}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${day.date} — ${day.city}`}
                  className={tabClass}
                  ref={el => tabRefs.current[i] = el}
                  onClick={() => setSelectedIndex(i)}
                >
                  <span className="tab-weekday">{weekday}</span>
                  <span className="tab-day">{d}</span>
                  <span className="tab-type-dot" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <div className="daynav__detail" role="tabpanel">
          {selectedDay && <DayCard day={selectedDay} />}
        </div>
      </div>
    </>
  );
}
