import React, { useMemo } from 'react';

/* ---------------------------------------------------------------
   TodayView
   Muestra el plan del día actual. Si hoy está antes del viaje,
   muestra la cuenta atrás. Si es un día del viaje, muestra la
   hero card + hotel + bloques con diseño iOS premium.
   --------------------------------------------------------------- */

const STYLES = `
/* ---- Contenedor general ---- */
.today-view {
  padding: var(--page-padding);
  display: flex;
  flex-direction: column;
  gap: var(--gap-card);
}

/* ---- Cuenta atrás ---- */
.countdown-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 144px);
  padding: var(--page-padding);
  text-align: center;
  gap: 8px;
}

.countdown-hero__pre {
  font-size: 15px;
  color: var(--label-secondary);
  font-weight: 400;
}

.countdown-hero__number {
  font-size: 88px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -4px;
  font-variant-numeric: tabular-nums;
}

.countdown-hero__label {
  font-size: 22px;
  font-weight: 600;
  color: var(--label-primary);
  letter-spacing: -0.3px;
}

.countdown-hero__date {
  font-size: 15px;
  color: var(--label-secondary);
  margin-top: 8px;
}

/* ---- After-trip ---- */
.after-trip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 144px);
  padding: var(--page-padding);
  text-align: center;
  gap: 12px;
}
.after-trip__emoji {
  font-size: 56px;
  line-height: 1;
}
.after-trip__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: -0.4px;
}
.after-trip__sub {
  font-size: 16px;
  color: var(--label-secondary);
}

/* ---- Hero card ---- */
.hero-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card-lg);
  padding: 24px 20px 20px;
}

.hero-card__day-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-chip);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 12px;
  background: var(--accent-soft);
  color: var(--accent);
}

.hero-card__day-chip--free {
  background: rgba(48, 209, 88, 0.12);
  color: #30D158;
}

.hero-card__title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.1;
  color: var(--label-primary);
  margin-bottom: 6px;
}

.hero-card__subtitle {
  font-size: 15px;
  color: var(--label-secondary);
  font-weight: 400;
  text-transform: capitalize;
}

.map-btn {
  background: var(--bg-secondary);
  color: var(--label-primary);
  border: none;
  border-radius: var(--radius-btn);
  padding: 10px 20px;
  font-size: 15px;
  font-family: var(--font);
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  -webkit-tap-highlight-color: transparent;
}

/* ---- Hotel card ---- */
.hotel-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.hotel-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--label-primary);
  letter-spacing: -0.3px;
  margin-bottom: 12px;
}

.hotel-times-row {
  display: flex;
  gap: 24px;
}

.hotel-time-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hotel-time-icon {
  width: 16px;
  height: 16px;
  color: var(--label-tertiary);
  flex-shrink: 0;
}

.hotel-time-text {
  font-size: 14px;
  color: var(--label-secondary);
}

.hotel-time-text strong {
  color: var(--label-primary);
  font-weight: 600;
}

/* ---- Timeline de bloques ---- */
.blocks-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 20px;
}

.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.block-row {
  display: flex;
  gap: 16px;
  position: relative;
  padding-bottom: 20px;
}

.block-row:last-child {
  padding-bottom: 0;
}

/* Línea vertical del timeline */
.block-row::before {
  content: '';
  position: absolute;
  left: 32px;
  top: 22px;
  bottom: 0;
  width: 2px;
  background: var(--accent);
  opacity: 0.15;
}

.block-row:last-child::before {
  display: none;
}

.block-left {
  width: 48px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.block-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  margin-top: 5px;
}

.block-time {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  text-align: center;
  letter-spacing: 0.2px;
  line-height: 1.2;
}

.block-franja {
  font-size: 11px;
  color: var(--label-secondary);
  text-align: center;
  margin-top: 2px;
}

.block-right {
  flex: 1;
  padding-top: 2px;
}

.block-right--tappable {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.block-right--tappable:active {
  opacity: 0.7;
}

.block-activity-title {
  font-size: 17px;
  font-weight: 500;
  color: var(--label-primary);
  line-height: 1.3;
}

.block-activity-detail {
  font-size: 14px;
  color: var(--label-secondary);
  margin-top: 2px;
  line-height: 1.4;
}

.block-chevron {
  flex-shrink: 0;
  color: var(--accent);
  margin-top: 4px;
}

.route-btn {
  background: var(--bg-secondary);
  color: var(--accent);
  border: none;
  border-radius: var(--radius-btn);
  padding: 10px 20px;
  font-size: 15px;
  font-family: var(--font);
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  margin-left: 8px;
  -webkit-tap-highlight-color: transparent;
}

/* ---- No data ---- */
.no-data {
  padding: var(--page-padding);
  color: var(--label-secondary);
  font-size: 15px;
}
`;

/* --- Helpers --- */

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysUntil(targetDateStr) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function formatDateEs(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getDayNumber(days, day) {
  const idx = days.findIndex(d => d.date === day.date);
  return idx >= 0 ? idx + 1 : null;
}

/* --- Componente hotel --- */
function HotelCard({ hotel }) {
  if (!hotel) return null;
  return (
    <div className="hotel-card">
      <div className="section-label">Alojamiento</div>
      <div className="hotel-name">{hotel.name}</div>
      {(hotel.checkin || hotel.checkout) && (
        <div className="hotel-times-row">
          {hotel.checkin && (
            <div className="hotel-time-item">
              <svg className="hotel-time-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3l2 2" />
              </svg>
              <span className="hotel-time-text">Check-in <strong>{hotel.checkin}</strong></span>
            </div>
          )}
          {hotel.checkout && (
            <div className="hotel-time-item">
              <svg className="hotel-time-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3l2 2" />
              </svg>
              <span className="hotel-time-text">Check-out <strong>{hotel.checkout}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* --- Franja horaria de texto a label --- */
function timeToFranja(time) {
  if (!time) return '';
  const hour = parseInt(time.split(':')[0], 10);
  if (isNaN(hour)) return time;
  if (hour < 13) return 'Mañana';
  if (hour < 19) return 'Tarde';
  return 'Noche';
}

/* --- DayCard: exportado para uso en DayNav --- */
export function DayCard({ day, days = [], onOpenMap, onOpenPoi, onOpenRoute }) {
  const isFree = day.type === 'free';
  const dayNum = days.length > 0 ? getDayNumber(days, day) : null;
  const hasRoutePois = (day.blocks ?? []).some(b => b.poi_id);

  return (
    <>
      <style>{STYLES}</style>
      <div className="today-view">
        {/* Hero card */}
        <div className="hero-card">
          <div className={`hero-card__day-chip${isFree ? ' hero-card__day-chip--free' : ''}`}>
            {dayNum ? `Día ${dayNum}` : (isFree ? 'Día libre' : day.type === 'transit_out' ? 'Viaje a Japón' : day.type === 'transit_return' ? 'Vuelta a casa' : day.type === 'arrival' ? 'Llegada' : 'Hoy')}
          </div>
          <h1 className="hero-card__title">{day.title}</h1>
          <p className="hero-card__subtitle">{formatDateEs(day.date)}</p>
          {onOpenMap && (
            <button onClick={() => onOpenMap(day)} className="map-btn">
              📍 Ver en mapa
            </button>
          )}
          {onOpenRoute && hasRoutePois && (
            <button onClick={() => onOpenRoute(day)} className="route-btn">
              Ruta del día →
            </button>
          )}
        </div>

        {/* Hotel */}
        {day.hotel && <HotelCard hotel={day.hotel} />}

        {/* Bloques del día */}
        {day.blocks && day.blocks.length > 0 && (
          <div className="blocks-card">
            <div className="section-label">Plan del día</div>
            <div className="blocks-list">
              {day.blocks.map((block, i) => {
                const tappable = Boolean(block.poi_id && onOpenPoi);
                return (
                  <div className="block-row" key={i}>
                    <div className="block-left">
                      <div className="block-dot" />
                      {block.time && <span className="block-time">{block.time}</span>}
                      <span className="block-franja">{timeToFranja(block.time) || block.label}</span>
                    </div>
                    <div
                      className={`block-right${tappable ? ' block-right--tappable' : ''}`}
                      role={tappable ? 'button' : undefined}
                      tabIndex={tappable ? 0 : undefined}
                      onClick={tappable ? () => onOpenPoi(block.poi_id) : undefined}
                      onKeyDown={tappable ? (e) => e.key === 'Enter' && onOpenPoi(block.poi_id) : undefined}
                    >
                      <div>
                        <div className="block-activity-title">{block.label}</div>
                        {block.activity && block.activity !== block.label && (
                          <div className="block-activity-detail">{block.activity}</div>
                        )}
                      </div>
                      {tappable && (
                        <svg className="block-chevron" width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                          <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* --- Vista principal de "Hoy" --- */
export default function TodayView({ days, onOpenMap, onOpenPoi, onOpenRoute }) {
  const today = todayISO();

  const currentDay = useMemo(
    () => days.find(d => d.date === today),
    [days, today]
  );

  const firstDay = days[0]?.date;
  const lastDay  = days[days.length - 1]?.date;

  const beforeTrip = firstDay && today < firstDay;
  const afterTrip  = lastDay  && today > lastDay;

  if (!days.length) return null;

  if (beforeTrip) {
    const diff = daysUntil(firstDay);
    return (
      <>
        <style>{STYLES}</style>
        <div className="countdown-hero" role="main" aria-label="Cuenta atrás para el viaje">
          <p className="countdown-hero__pre">¡El viaje empieza en…!</p>
          <div className="countdown-hero__number" aria-label={`${diff} días`}>{diff}</div>
          <div className="countdown-hero__label">{diff === 1 ? 'día para Japón' : 'días para Japón'}</div>
          <p className="countdown-hero__date">Salida: {formatDateEs(firstDay)}</p>
        </div>
      </>
    );
  }

  if (afterTrip) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="after-trip" role="main">
          <div className="after-trip__emoji" aria-hidden="true">🥲</div>
          <h2 className="after-trip__title">El viaje ya terminó</h2>
          <p className="after-trip__sub">Espero que haya sido increíble, Chelis ✨</p>
        </div>
      </>
    );
  }

  if (!currentDay) {
    return (
      <>
        <style>{STYLES}</style>
        <p className="no-data">No hay datos para hoy ({today}).</p>
      </>
    );
  }

  return <DayCard day={currentDay} days={days} onOpenMap={onOpenMap} onOpenPoi={onOpenPoi} onOpenRoute={onOpenRoute} />;
}
