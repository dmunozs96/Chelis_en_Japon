import React, { useMemo, useState } from 'react';
import { useDepartureCountdown } from '../hooks/useDepartureCountdown.js';
import { usePreparationData } from '../hooks/usePreparationData.js';
import { getNowState, minutesUntil } from '../lib/nowMode.js';
import RouteLine from './ui/RouteLine.jsx';

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

.now-card {
  padding: 18px;
  border: 1px solid rgba(48, 209, 88, .4);
  border-radius: var(--radius-card);
  background: linear-gradient(145deg, rgba(48, 209, 88, .14), var(--bg-surface));
  box-shadow: var(--shadow-card);
}
.now-card__top { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.now-card__eyebrow { color:#30d158; font-size:12px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; }
.now-card__time { color:var(--label-secondary); font-size:13px; font-variant-numeric:tabular-nums; }
.now-card__title { margin-top:9px; color:var(--label-primary); font-size:22px; font-weight:750; line-height:1.2; }
.now-card__detail { margin-top:5px; color:var(--label-secondary); font-size:14px; line-height:1.45; }
.now-card__next { margin-top:12px; padding-top:12px; border-top:1px solid var(--separator); color:var(--label-secondary); font-size:13px; line-height:1.4; }
.now-card__next strong { color:var(--label-primary); }
.now-card__actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
.now-card__action { border:0; border-radius:var(--radius-btn); padding:10px 14px; background:var(--accent); color:#fff; font:600 14px var(--font); }
.now-card__action--secondary { background:var(--bg-secondary); color:var(--label-primary); }

.arrival-tool-card {
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid rgba(232, 0, 45, .45);
  border-radius: var(--radius-card);
  background: var(--accent-soft);
  color: var(--label-primary);
  font-family: var(--font);
  text-align: left;
  cursor: pointer;
}
.arrival-tool-card__icon { font-size: 28px; }
.arrival-tool-card__body { flex: 1; }
.arrival-tool-card__title { font-size: 15px; font-weight: 700; }
.arrival-tool-card__text { margin-top: 3px; color: var(--label-secondary); font-size: 13px; line-height: 1.35; }
.arrival-tool-card__arrow { color: var(--accent); font-size: 22px; }

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

.countdown-hero__time {
  margin-top: 10px;
  color: var(--label-primary);
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.countdown-hero__time span {
  color: var(--label-secondary);
  font-size: 12px;
  font-weight: 500;
}

.countdown-hero__date {
  font-size: 15px;
  color: var(--label-secondary);
  margin-top: 8px;
}
.prep-home-card { width:100%; max-width:440px; margin-top:18px; padding:17px; border:1px solid var(--glass-border); border-radius:var(--radius-card); background:var(--bg-surface); color:var(--label-primary); text-align:left; font-family:var(--font); }
.prep-home-card__top { display:flex; justify-content:space-between; gap:12px; align-items:center; }
.prep-home-card__title { font-size:17px; font-weight:700; }
.prep-home-card__count { color:var(--accent); font-size:13px; font-weight:700; }
.prep-home-card__next { margin-top:7px; color:var(--label-secondary); font-size:13px; line-height:1.4; }
.prep-home-card__bar { height:6px; margin-top:12px; overflow:hidden; border-radius:6px; background:var(--bg-secondary); }
.prep-home-card__bar span { display:block; height:100%; background:#30d158; }

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
  width: 58px;
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
  word-break: break-word;
  hyphens: auto;
}

.block-franja {
  font-size: 11px;
  color: var(--label-secondary);
  word-break: break-word;
  hyphens: auto;
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

/* ---- Sub-pasos operativos dentro de un bloque ---- */
.steps-toggle {
  background: none;
  border: none;
  padding: 0;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.plan-b { margin-top:10px; border:1px solid rgba(255,159,10,.38); border-radius:12px; background:rgba(255,159,10,.08); overflow:hidden; }
.plan-b summary { padding:11px 13px; color:#ff9f0a; font-size:13px; font-weight:750; cursor:pointer; list-style:none; }
.plan-b summary::-webkit-details-marker { display:none; }
.plan-b__body { padding:0 13px 13px; color:var(--label-secondary); font-size:13px; line-height:1.45; }
.plan-b__trigger { margin-bottom:5px; color:var(--label-primary); }

.steps-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 2px solid var(--separator);
  padding-left: 14px;
}

.step-row {
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.step-icon {
  font-size: 13px;
  flex-shrink: 0;
  width: 18px;
}

.step-time {
  font-size: 12px;
  font-weight: 700;
  color: var(--label-secondary);
  flex-shrink: 0;
  width: 40px;
  font-variant-numeric: tabular-nums;
}

.step-body {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--label-primary);
  line-height: 1.3;
}

.step-detail {
  font-size: 13px;
  color: var(--label-secondary);
  line-height: 1.4;
  margin-top: 1px;
}

.step-duration {
  font-size: 12px;
  color: var(--label-tertiary);
  margin-left: 4px;
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

function formatDateEs(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getDayNumber(days, day) {
  const idx = days.findIndex(d => d.date === day.date);
  return idx >= 0 ? idx + 1 : null;
}

function NowCard({ day, onOpenMap, onOpenPoi, onOpenTickets, onFindFood }) {
  const now = new Date();
  const state = getNowState(day, now);
  const focus = state.current ?? state.next;
  const until = minutesUntil(state.next, now);

  if (!focus) {
    return (
      <section className="now-card" aria-label="Modo Ahora">
        <div className="now-card__eyebrow">Ahora</div>
        <div className="now-card__title">{state.phase === 'finished' ? 'Plan del día completado' : 'Sin horario detallado'}</div>
        <div className="now-card__detail">Consulta el plan completo o adapta el resto del día con calma.</div>
      </section>
    );
  }

  const beforeStart = state.phase === 'before_start';
  const foodStep = focus.type === 'food';
  const transferStep = focus.type === 'transfer';
  return (
    <section className="now-card" aria-label="Modo Ahora">
      <div className="now-card__top">
        <div className="now-card__eyebrow">{beforeStart ? 'Lo primero' : 'Ahora'}</div>
        <div className="now-card__time">{focus.time}</div>
      </div>
      <div className="now-card__title">{focus.title}</div>
      {focus.detail && <div className="now-card__detail">{focus.detail}</div>}
      {state.next && !beforeStart && (
        <div className="now-card__next">
          Después: <strong>{state.next.time} · {state.next.title}</strong>
          {until > 0 ? ` · en ${until} min` : ''}
        </div>
      )}
      <div className="now-card__actions">
        {focus.poi_id && onOpenPoi && <button className="now-card__action" onClick={() => onOpenPoi(focus.poi_id)}>Abrir lugar</button>}
        {transferStep && onOpenTickets && <button className="now-card__action" onClick={onOpenTickets}>Ver billetes</button>}
        {foodStep && onFindFood && <button className="now-card__action" onClick={onFindFood}>Buscar comida</button>}
        {onOpenMap && <button className="now-card__action now-card__action--secondary" onClick={() => onOpenMap(day)}>Mapa del día</button>}
      </div>
    </section>
  );
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
  // Umbrales de la convención horaria 4e (comidas a la española):
  // mañana hasta las 14:00, tarde hasta las 20:00, noche después.
  if (hour < 14) return 'Mañana';
  if (hour < 20) return 'Tarde';
  return 'Noche';
}

/* --- Icono por tipo de paso operativo --- */
const STEP_ICONS = {
  walk: '🚶',
  transfer: '🚇',
  visit: '📍',
  food: '🍜',
  free: '✨',
  rest: '💤',
};

function stepIcon(step) {
  if (step.type === 'transfer') {
    if (step.mode === 'walk') return STEP_ICONS.walk;
    if (step.mode === 'tren' || step.mode === 'train') return '🚆';
    if (step.mode === 'taxi') return '🚕';
    if (step.mode === 'bus') return '🚌';
    if (step.mode === 'avion' || step.mode === 'avión') return '✈️';
    return STEP_ICONS.transfer;
  }
  return STEP_ICONS[step.type] || '•';
}

/* --- Sub-timeline de pasos operativos de un bloque --- */
function StepsList({ steps, onOpenPoi }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="steps-list">
      {steps.map((step, i) => {
        const tappable = Boolean(step.poi_id && onOpenPoi);
        return (
          <div
            className="step-row"
            key={i}
            role={tappable ? 'button' : undefined}
            tabIndex={tappable ? 0 : undefined}
            onClick={tappable ? () => onOpenPoi(step.poi_id) : undefined}
            style={tappable ? { cursor: 'pointer' } : undefined}
          >
            <span className="step-icon" aria-hidden="true">{stepIcon(step)}</span>
            <span className="step-time">{step.time}</span>
            <div className="step-body">
              <div className="step-title">
                {step.title}
                {step.duration_min && <span className="step-duration">· {step.duration_min} min</span>}
              </div>
              {step.detail && <div className="step-detail">{step.detail}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --- DayCard: exportado para uso en DayNav --- */
export function DayCard({ day, days = [], onOpenMap, onOpenPoi, onOpenRoute, onOpenIcGuide, nowMode = false, onOpenTickets, onFindFood }) {
  const isFree = day.type === 'free';
  const dayNum = days.length > 0 ? getDayNumber(days, day) : null;
  const hasRoutePois = (day.blocks ?? []).some(b => b.poi_id);
  const [expandedSteps, setExpandedSteps] = useState(() => new Set());
  const currentTime = new Date().toTimeString().slice(0, 5);
  const currentBlockIndex = nowMode
    ? day.blocks.reduce((latest, block, index) => block.time && block.time <= currentTime ? index : latest, -1)
    : -1;

  const toggleSteps = (i) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="today-view">
        {nowMode && <NowCard day={day} onOpenMap={onOpenMap} onOpenPoi={onOpenPoi} onOpenTickets={onOpenTickets} onFindFood={onFindFood} />}
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

        {nowMode && day.blocks?.length > 0 && (
          <section className="route-section" aria-labelledby={`route-title-${day.date}`}>
            <div className="route-section__heading">
              <span>Itinerario</span>
              <h2 id={`route-title-${day.date}`}>Ruta de hoy</h2>
            </div>
            <RouteLine
              currentIndex={currentBlockIndex}
              items={day.blocks.map((block, index) => ({
                key: `${day.date}-${index}`,
                id: block.poi_id,
                time: block.time,
                title: block.label,
                detail: block.activity && block.activity !== block.label ? block.activity : null,
                transfer: /traslado|tren|vuelo|llegada/i.test(`${block.label} ${block.activity ?? ''}`),
              }))}
              onSelect={onOpenPoi ? (item) => onOpenPoi(item.id) : undefined}
            />
          </section>
        )}

        {/* Hotel */}
        {day.hotel && <HotelCard hotel={day.hotel} />}

        {day.type === 'arrival' && onOpenIcGuide && (
          <button className="arrival-tool-card" onClick={onOpenIcGuide}>
            <span className="arrival-tool-card__icon" aria-hidden="true">🚇</span>
            <span className="arrival-tool-card__body">
              <span className="arrival-tool-card__title">Compra la Welcome Suica al llegar</span>
              <span className="arrival-tool-card__text">Narita Terminal 2·3 · guía de compra, uso y recarga</span>
            </span>
            <span className="arrival-tool-card__arrow" aria-hidden="true">›</span>
          </button>
        )}

        {/* Bloques del día */}
        {day.blocks && day.blocks.length > 0 && (
          <div className="blocks-card">
            <div className="section-label">Plan del día</div>
            <div className="blocks-list">
              {day.blocks.map((block, i) => {
                const tappable = Boolean(block.poi_id && onOpenPoi);
                const hasSteps = Boolean(block.steps && block.steps.length > 0);
                const stepsOpen = expandedSteps.has(i);
                return (
                  <div className="block-row" key={i}>
                    <div className="block-left">
                      <div className="block-dot" />
                      {block.time && <span className="block-time">{block.time}</span>}
                      <span className="block-franja">{timeToFranja(block.time) || block.label}</span>
                    </div>
                    <div style={{ flex: 1 }}>
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
                      {hasSteps && (
                        <>
                          <button
                            className="steps-toggle"
                            onClick={() => toggleSteps(i)}
                            aria-expanded={stepsOpen}
                          >
                            {stepsOpen ? 'Ocultar plan detallado ▲' : `Ver plan detallado (${block.steps.length} pasos) ▼`}
                          </button>
                          {stepsOpen && <StepsList steps={block.steps} onOpenPoi={onOpenPoi} />}
                        </>
                      )}
                      {block.plan_b && (
                        <details className="plan-b">
                          <summary>Plan B si algo se tuerce</summary>
                          <div className="plan-b__body">
                            <div className="plan-b__trigger"><strong>Cuándo:</strong> {block.plan_b.trigger}</div>
                            <div><strong>Qué hacer:</strong> {block.plan_b.action}</div>
                          </div>
                        </details>
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
export default function TodayView({ trip, days, onOpenMap, onOpenPoi, onOpenRoute, onOpenIcGuide, onOpenPreparation, onOpenTickets, onFindFood }) {
  const today = todayISO();
  const countdown = useDepartureCountdown(trip?.departure_datetime);
  const { tasks: preparationTasks } = usePreparationData();

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
    const completed = preparationTasks.filter((task) => ['completed', 'not_applicable'].includes(task.status)).length;
    const pending = preparationTasks.filter((task) => !['completed', 'not_applicable'].includes(task.status));
    const urgent = pending.filter((task) => task.due_date_resolved <= today || task.priority === 'critical').sort((a, b) => a.due_date_resolved.localeCompare(b.due_date_resolved));
    const nextTask = urgent[0] ?? pending.sort((a, b) => a.due_date_resolved.localeCompare(b.due_date_resolved))[0];
    return (
      <>
        <style>{STYLES}</style>
        <div className="countdown-hero" role="main" aria-label="Cuenta atrás para el viaje">
          <p className="countdown-hero__pre">¡El viaje empieza en…!</p>
          <div className="countdown-hero__number" aria-label={`${countdown?.days ?? 0} días`}>{countdown?.days ?? 0}</div>
          <div className="countdown-hero__label">{countdown?.days === 1 ? 'día para Japón' : 'días para Japón'}</div>
          {countdown && (
            <div className="countdown-hero__time" aria-label={`${countdown.hours} horas y ${countdown.minutes} minutos`}>
              {String(countdown.hours).padStart(2, '0')}<span> h</span> · {String(countdown.minutes).padStart(2, '0')}<span> min</span>
            </div>
          )}
          <p className="countdown-hero__date">Salida: {formatDateEs(firstDay)}</p>
          <button className="prep-home-card" onClick={onOpenPreparation}>
            <div className="prep-home-card__top"><span className="prep-home-card__title">Preparar viaje</span><span className="prep-home-card__count">{completed}/{preparationTasks.length || '—'}</span></div>
            <p className="prep-home-card__next">{nextTask ? `Siguiente: ${nextTask.title}` : 'Todo listo para salir ✓'}</p>
            <div className="prep-home-card__bar"><span style={{ width: preparationTasks.length ? `${(completed / preparationTasks.length) * 100}%` : '0%' }} /></div>
          </button>
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

  return <DayCard day={currentDay} days={days} onOpenMap={onOpenMap} onOpenPoi={onOpenPoi} onOpenRoute={onOpenRoute} onOpenIcGuide={onOpenIcGuide} nowMode onOpenTickets={onOpenTickets} onFindFood={onFindFood} />;
}
