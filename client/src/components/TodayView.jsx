import React, { useMemo } from 'react';

/* ---------------------------------------------------------------
   TodayView
   Displays the plan for "today" based on the device date.
   If today is outside the trip range (13–25 Aug 2026) it shows
   a countdown to departure day.
   --------------------------------------------------------------- */

const STYLES = `
/* ---- Countdown ---- */
.countdown {
  text-align: center;
  padding: 32px 16px;
}
.countdown__title {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}
.countdown__days {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-torii);
  line-height: 1;
}
.countdown__label {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}
.countdown__date {
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* ---- Day card ---- */
.today-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin: 0 0 24px;
}

.today-card--free {
  border-left: 5px solid var(--color-free-accent);
}
.today-card--normal {
  border-left: 5px solid var(--color-torii);
}
.today-card--transit_out,
.today-card--transit_return {
  border-left: 5px solid var(--color-transit-accent);
}
.today-card--arrival {
  border-left: 5px solid #059669;
}

.today-card__header {
  padding: 16px 20px 12px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.today-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  margin-bottom: 8px;
}
.badge--free     { background: #FEF3C7; color: var(--color-free-accent); }
.badge--normal   { background: #FEE2E2; color: var(--color-torii); }
.badge--transit  { background: #E0E7FF; color: var(--color-transit-accent); }
.badge--arrival  { background: #D1FAE5; color: #059669; }

.today-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 4px;
}

.today-card__city {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.today-card__hotel {
  padding: 12px 20px;
  background: #F9F9F6;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.hotel-icon { flex-shrink: 0; font-size: 1rem; }
.hotel-info { display: flex; flex-direction: column; }
.hotel-name { font-weight: 600; color: var(--color-text); }
.hotel-times { color: var(--color-text-muted); font-size: 0.78rem; margin-top: 1px; }

/* ---- Blocks ---- */
.today-card__blocks {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.block-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.block-time {
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-torii);
  background: #FEE2E2;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  margin-top: 2px;
  min-width: 68px;
  text-align: center;
}

.today-card--free .block-time {
  color: var(--color-free-accent);
  background: #FEF3C7;
}
.today-card--transit_out .block-time,
.today-card--transit_return .block-time {
  color: var(--color-transit-accent);
  background: #E0E7FF;
}
.today-card--arrival .block-time {
  color: #059669;
  background: #D1FAE5;
}

.block-content {}
.block-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text);
}
.block-activity {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 1px;
  line-height: 1.4;
}
`;

const TYPE_META = {
  normal:         { badge: 'badge--normal',   label: 'Hoy',          icon: '📍' },
  free:           { badge: 'badge--free',     label: 'Día libre',    icon: '✨' },
  transit_out:    { badge: 'badge--transit',  label: 'Día de viaje', icon: '✈️' },
  transit_return: { badge: 'badge--transit',  label: 'Vuelta a casa',icon: '🏠' },
  arrival:        { badge: 'badge--arrival',  label: 'Llegada',      icon: '🎌' },
};

function formatDateEs(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysUntil(targetDateStr) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function HotelInfo({ hotel }) {
  if (!hotel) return null;
  const times = [hotel.checkin && `Check-in ${hotel.checkin}`, hotel.checkout && `Check-out ${hotel.checkout}`]
    .filter(Boolean).join('  ·  ');
  return (
    <div className="today-card__hotel">
      <span className="hotel-icon">🏨</span>
      <div className="hotel-info">
        <span className="hotel-name">{hotel.name}</span>
        {times && <span className="hotel-times">{times}</span>}
      </div>
    </div>
  );
}

function DayCard({ day }) {
  const meta = TYPE_META[day.type] ?? TYPE_META.normal;
  const cardClass = `today-card today-card--${day.type}`;

  return (
    <div className={cardClass}>
      <div className="today-card__header">
        <div className={`today-card__badge ${meta.badge}`}>
          <span>{meta.icon}</span>
          <span>{meta.label}</span>
        </div>
        <div className="today-card__title">{day.title}</div>
        <div className="today-card__city">
          {formatDateEs(day.date)} · {day.city}
        </div>
      </div>

      <HotelInfo hotel={day.hotel} />

      <div className="today-card__blocks">
        {day.blocks.map((block, i) => (
          <div className="block-item" key={i}>
            <span className="block-time">{block.time}</span>
            <div className="block-content">
              <div className="block-label">{block.label}</div>
              <div className="block-activity">{block.activity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TodayView({ days }) {
  const today = todayISO();

  const currentDay = useMemo(
    () => days.find(d => d.date === today),
    [days, today]
  );

  const firstDay = days[0]?.date;  // "2026-08-13"
  const lastDay  = days[days.length - 1]?.date; // "2026-08-25"

  const beforeTrip = firstDay && today < firstDay;
  const afterTrip  = lastDay  && today > lastDay;

  if (!days.length) return null;

  if (beforeTrip) {
    const diff = daysUntil(firstDay);
    return (
      <>
        <style>{STYLES}</style>
        <div className="countdown">
          <p className="countdown__title">¡El viaje empieza en…!</p>
          <div className="countdown__days">{diff}</div>
          <div className="countdown__label">{diff === 1 ? 'día' : 'días'}</div>
          <p className="countdown__date">Salida: {formatDateEs(firstDay)}</p>
        </div>
      </>
    );
  }

  if (afterTrip) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="countdown">
          <p className="countdown__title">El viaje ya terminó 🥲</p>
          <p className="countdown__date">Espero que haya sido increíble, Chelis ✨</p>
        </div>
      </>
    );
  }

  if (!currentDay) {
    return (
      <>
        <style>{STYLES}</style>
        <p style={{ padding: '16px', color: 'var(--color-text-muted)' }}>
          No hay datos para hoy ({today}).
        </p>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <DayCard day={currentDay} />
    </>
  );
}

// Named export so DayNav can reuse DayCard without importing TodayView.
export { DayCard };
