import React, { useState } from 'react';
import { useDepartureCountdown } from '../hooks/useDepartureCountdown.js';

const STYLES = `
.splash {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  min-width: 320px;
  overflow: hidden;
  background: var(--ink-1000);
  color: var(--paper-100);
}
.splash__photo,
.splash__veil {
  position: absolute;
  inset: 0;
}
.splash__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 58% center;
  filter: saturate(.72) contrast(1.08) brightness(.68);
  animation: splash-photo 460ms var(--ease) both;
}
.splash__veil {
  background:
    linear-gradient(180deg, rgb(8 9 10 / 28%) 0%, rgb(8 9 10 / 18%) 36%, rgb(8 9 10 / 92%) 82%, var(--ink-1000) 100%),
    linear-gradient(90deg, rgb(8 9 10 / 58%) 0%, transparent 70%);
}
.splash__frame {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(100%, var(--shell-max));
  min-height: 100dvh;
  margin: 0 auto;
  padding: calc(24px + env(safe-area-inset-top)) var(--page-padding) calc(24px + env(safe-area-inset-bottom));
  flex-direction: column;
  justify-content: flex-start;
}
.splash__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--paper-300);
  font-size: 10px;
  font-weight: 650;
  letter-spacing: .15em;
  text-transform: uppercase;
}
.splash__meta::before {
  width: 28px;
  height: 2px;
  margin-right: auto;
  background: var(--torii-500);
  content: "";
}
.splash__meta span:first-child {
  margin-left: 10px;
}
.splash__content {
  margin-top: auto;
  animation: splash-content 460ms 100ms var(--ease) both;
}
.splash__eyebrow {
  margin-bottom: 14px;
  color: var(--paper-300);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.splash__number {
  color: var(--paper-100);
  font-family: var(--font-display);
  font-size: clamp(88px, 29vw, 144px);
  font-weight: 500;
  letter-spacing: -.075em;
  line-height: .75;
  font-variant-numeric: tabular-nums;
}
.splash__number-label {
  max-width: 270px;
  margin-top: 22px;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 520;
  letter-spacing: -.035em;
  line-height: 1.05;
}
.splash__detail {
  display: flex;
  margin-top: 18px;
  padding-top: 12px;
  align-items: center;
  gap: 8px;
  border-top: 1px solid rgb(241 237 229 / 35%);
  color: var(--paper-300);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.splash__detail strong {
  color: var(--paper-100);
  font-weight: 650;
}
.splash__enter {
  display: flex;
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(241 237 229 / 38%);
  border-radius: var(--radius-btn);
  background: rgb(8 9 10 / 46%);
  color: var(--paper-100);
  cursor: pointer;
  font-size: 14px;
  font-weight: 650;
  margin-top: 28px;
  transition: background var(--duration-press) var(--ease), border-color var(--duration-press) var(--ease);
}
.splash__enter::after {
  color: var(--torii-500);
  content: "→";
  font-size: 20px;
}
.splash__enter:active {
  border-color: var(--paper-100);
  background: var(--ink-800);
}
.splash--exiting {
  opacity: 0;
  transition: opacity 240ms var(--ease);
  pointer-events: none;
}
@keyframes splash-photo {
  from { opacity: 0; transform: scale(1.015); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes splash-content {
  from { transform: translateY(12px); }
  to { transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .splash__photo, .splash__content { animation: none; }
}
`;

function dateLabel(dateString) {
  if (!dateString) return null;
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

function tripDayNumber(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);
  if (today < start || today > end) return null;
  return Math.floor((today - start) / 86400000) + 1;
}

export default function SplashScreen({ trip, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const countdown = useDepartureCountdown(trip?.departure_datetime);
  const tripDay = tripDayNumber(trip?.start_date, trip?.end_date);

  const dismiss = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(onDismiss, 240);
  };

  const beforeTrip = countdown && countdown.totalMs > 0;
  const number = beforeTrip ? countdown.days : (tripDay ?? 13);
  const title = beforeTrip
    ? `${countdown.days === 1 ? 'día' : 'días'} para Japón`
    : tripDay
      ? `día ${tripDay} de viaje`
      : 'días por Japón';

  return (
    <>
      <style>{STYLES}</style>
      <section
        className={`splash${exiting ? ' splash--exiting' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="splash-title"
      >
        <img className="splash__photo" src="/pois/kinkakuji.jpg" alt="" fetchPriority="high" />
        <div className="splash__veil" aria-hidden="true" />

        <div className="splash__frame">
          <div className="splash__meta">
            <span>Japón / Agosto 2026</span>
            <span>私たちの旅</span>
          </div>

          <div className="splash__content">
            <div className="splash__eyebrow">Chelis en Japón</div>
            <div className="splash__number" aria-hidden="true">{number}</div>
            <h1 className="splash__number-label" id="splash-title">{title}</h1>
            <div className="splash__detail">
              {beforeTrip && (
                <><strong>{String(countdown.hours).padStart(2, '0')} h</strong><span>·</span><strong>{String(countdown.minutes).padStart(2, '0')} min</strong><span>hasta el despegue</span></>
              )}
              {!beforeTrip && trip?.start_date && (
                <><strong>{dateLabel(trip?.start_date)}</strong><span>—</span><strong>{dateLabel(trip?.end_date)}</strong></>
              )}
              {!beforeTrip && !trip?.start_date && <span>Tokio · Kioto · Osaka · Hiroshima</span>}
            </div>
          </div>

          <button className="splash__enter" type="button" onClick={dismiss}>
            Entrar en la guía
          </button>
        </div>
      </section>
    </>
  );
}
