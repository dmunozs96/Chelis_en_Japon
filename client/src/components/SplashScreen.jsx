import React, { useState, useEffect } from 'react';

/* ---------------------------------------------------------------
   SplashScreen — Intro cinematográfica
   Muestra una pantalla de entrada oscura con cuenta atrás al viaje,
   con un pseudo-vídeo de fondo (slideshow de fotos de Japón) y un
   countdown dinámico (días/horas/minutos/segundos hasta el despegue).
   Se muestra una vez por sesión (sessionStorage).
   Auto-dismiss a los 5 segundos o tap para saltar.
   --------------------------------------------------------------- */

const TRIP_START  = '2026-08-13';
const TRIP_DAYS   = 13;

// Fecha y hora exactas de despegue del vuelo IB0281 (hora local de Madrid)
const DEPARTURE_DATETIME = new Date(2026, 7, 13, 12, 30, 0);

// Pseudo-vídeo de entrada: slideshow de las fotos en client/public/JapanPics
// (JPG comprimidos — los PNG originales pesaban ~2 MB cada uno)
const SLIDES = [
  '/JapanPics/Tokyo.jpg',
  '/JapanPics/Shibuya.jpg',
  '/JapanPics/Kyoto.jpg',
  '/JapanPics/Osaka.jpg',
  '/JapanPics/Japaneselads.jpg',
];
const SLIDE_INTERVAL_MS = 900;

function pad2(n) {
  return String(n).padStart(2, '0');
}

const STYLES = `
/* ---- Contenedor principal ---- */
.splash {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #060610;
  overflow: hidden;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* ---- Pseudo-vídeo: slideshow de fotos ---- */
.splash__slideshow {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.splash__slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
  filter: grayscale(0.1) brightness(0.5) saturate(1.15) contrast(1.05);
  transform: scale(1.02);
}

.splash__slide--active {
  opacity: 1;
}

.splash__slide-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg,
    rgba(6, 6, 16, 0.45) 0%,
    rgba(6, 6, 16, 0.72) 55%,
    rgba(6, 6, 16, 0.94) 100%);
  pointer-events: none;
}

/* ---- Capas de aurora ---- */
.splash__aurora {
  position: absolute;
  width: 160%;
  height: 160%;
  top: -30%;
  left: -30%;
  z-index: 2;
  pointer-events: none;
}

.splash__aurora--1 {
  background: radial-gradient(ellipse 55% 42% at 28% 30%,
    rgba(232, 0, 45, 0.22) 0%, transparent 55%);
  animation: sa1 14s ease-in-out infinite alternate;
}

.splash__aurora--2 {
  background: radial-gradient(ellipse 48% 58% at 76% 68%,
    rgba(70, 30, 195, 0.16) 0%, transparent 55%);
  animation: sa2 18s ease-in-out infinite alternate;
}

.splash__aurora--3 {
  background: radial-gradient(ellipse 40% 35% at 50% 80%,
    rgba(232, 0, 45, 0.08) 0%, transparent 55%);
  animation: sa3 22s ease-in-out infinite alternate;
}

@keyframes sa1 {
  0%   { transform: translate(0,   0)   scale(1);    }
  50%  { transform: translate(8%,  10%) scale(1.15); }
  100% { transform: translate(-5%, 6%)  scale(0.92); }
}
@keyframes sa2 {
  0%   { transform: translate(0,    0)   scale(1.1);  }
  50%  { transform: translate(-10%,-6%)  scale(0.88); }
  100% { transform: translate(7%, -11%)  scale(1.2);  }
}
@keyframes sa3 {
  0%   { transform: translate(0, 0)   scale(1);   }
  50%  { transform: translate(5%, -8%) scale(1.1); }
  100% { transform: translate(-4%, 4%) scale(0.95);}
}

/* ---- Scanlines sutiles ---- */
.splash::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.04) 3px,
    rgba(0, 0, 0, 0.04) 6px
  );
  pointer-events: none;
  z-index: 3;
}

/* ---- Contenido central ---- */
.splash__content {
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 32px;
  width: 100%;
  max-width: 480px;
}

/* ---- Pre-título ---- */
.splash__pre {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 5px;
  color: rgba(255, 255, 255, 0.30);
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.3s;
}

/* ---- Número grande ---- */
.splash__number {
  font-size: clamp(100px, 30vw, 168px);
  font-weight: 800;
  color: #fff;
  line-height: 0.82;
  letter-spacing: -10px;
  font-variant-numeric: tabular-nums;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.55s;
}

/* ---- Etiqueta días ---- */
.splash__days-label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 7px;
  color: rgba(255, 255, 255, 0.38);
  text-transform: uppercase;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.75s;
}

/* ---- Countdown en vivo hasta el despegue ---- */
.splash__live-countdown {
  margin-top: 16px;
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-variant-numeric: tabular-nums;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.85s;
}

.splash__live-countdown-unit {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.splash__live-countdown-suffix {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  margin-right: 6px;
}

.splash__live-countdown-sep {
  color: rgba(255, 255, 255, 0.25);
  margin: 0 2px;
}

/* ---- Destino ---- */
.splash__destination {
  margin-top: 30px;
  font-size: clamp(48px, 15vw, 80px);
  font-weight: 800;
  color: #E8002D;
  letter-spacing: -3px;
  line-height: 1;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.95s;
  text-shadow:
    0 0 40px rgba(232, 0, 45, 0.55),
    0 0 90px rgba(232, 0, 45, 0.20);
}

/* ---- Línea roja ---- */
.splash__line {
  width: 48px;
  height: 2px;
  background: #E8002D;
  margin-top: 18px;
  transform-origin: center;
  opacity: 0;
  transform: scaleX(0);
  animation: sline 0.7s var(--ease) forwards;
  animation-delay: 1.15s;
  box-shadow: 0 0 16px rgba(232, 0, 45, 0.7);
}

/* ---- Fecha ---- */
.splash__date {
  margin-top: 16px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.32);
  text-transform: uppercase;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 1.30s;
}

/* ---- Branding ---- */
.splash__brand {
  margin-top: 36px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 1.50s;
}

/* ---- Mensaje especial (durante/después del viaje) ---- */
.splash__special {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.splash__special-emoji {
  font-size: 72px;
  line-height: 1;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.3s;
}

.splash__special-title {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.5s;
}

.splash__special-sub {
  font-size: 16px;
  color: rgba(255,255,255,0.45);
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0;
  animation: sfade-up 0.9s var(--ease) forwards;
  animation-delay: 0.7s;
}

/* ---- Botón Saltar ---- */
.splash__skip {
  position: absolute;
  top: calc(20px + env(safe-area-inset-top));
  right: calc(20px + env(safe-area-inset-right));
  z-index: 10;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: var(--font);
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  animation: sfade-up 0.8s var(--ease) forwards;
  animation-delay: 1.7s;
  transition: background 0.15s, color 0.15s;
}

.splash__skip:active {
  background: rgba(255,255,255,0.14);
  color: #fff;
}

/* ---- Barra de progreso ---- */
.splash__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, rgba(232,0,45,0.6), #E8002D);
  box-shadow: 0 0 14px rgba(232, 0, 45, 0.65);
  animation: sprogress 4.5s linear forwards;
  animation-delay: 0.5s;
  pointer-events: none;
  z-index: 6;
}

/* ---- Salida ---- */
.splash--exiting {
  animation: sexit 0.55s var(--ease) forwards;
}

/* ---- Keyframes ---- */
@keyframes sfade-up {
  0%   { opacity: 0; transform: translateY(22px); }
  100% { opacity: 1; transform: translateY(0);    }
}

@keyframes sline {
  0%   { opacity: 0; transform: scaleX(0); }
  100% { opacity: 1; transform: scaleX(1); }
}

@keyframes sprogress {
  0%   { width: 0%; }
  100% { width: 100%; }
}

@keyframes sexit {
  0%   { opacity: 1; transform: scale(1);    }
  100% { opacity: 0; transform: scale(1.05); }
}
`;

/* --- Helpers --- */
function daysUntil(targetDateStr) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function tripDayNumber() {
  // Returns 1-based day of trip if currently on trip, else null
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = TRIP_START.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const diff = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
  if (diff >= 0 && diff < TRIP_DAYS) return diff + 1;
  return null;
}

export default function SplashScreen({ onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const days    = daysUntil(TRIP_START);
  const tripDay = tripDayNumber();
  // El último día del viaje es TRIP_START + (TRIP_DAYS - 1); al día siguiente
  // days vale exactamente -TRIP_DAYS, por eso <= y no <.
  const afterTrip = days <= -TRIP_DAYS;

  const dismiss = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onDismiss, 520);
  };

  // Auto-dismiss a los 5 segundos
  useEffect(() => {
    const t = setTimeout(dismiss, 5200);
    return () => clearTimeout(t);
  }, []);

  // Pseudo-vídeo: avanza el slideshow de fotos en bucle
  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex(i => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  // Countdown en vivo (días/horas/minutos/segundos hasta el despegue)
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const diffMs = Math.max(0, DEPARTURE_DATETIME - now);
  const countdown = {
    days:    Math.floor(diffMs / 86400000),
    hours:   Math.floor((diffMs % 86400000) / 3600000),
    minutes: Math.floor((diffMs % 3600000) / 60000),
    seconds: Math.floor((diffMs % 60000) / 1000),
  };

  const renderContent = () => {
    // Durante el viaje
    if (tripDay !== null) {
      return (
        <div className="splash__content">
          <div className="splash__special">
            <div className="splash__special-emoji">🗾</div>
            <div className="splash__special-title">¡Día {tripDay} en Japón!</div>
            <div className="splash__special-sub">Disfrutad mucho</div>
            <div className="splash__brand" style={{ marginTop: 24 }}>Chelis en Japón</div>
          </div>
        </div>
      );
    }

    // Después del viaje
    if (afterTrip) {
      return (
        <div className="splash__content">
          <div className="splash__special">
            <div className="splash__special-emoji">🥲</div>
            <div className="splash__special-title">El viaje terminó</div>
            <div className="splash__special-sub">Qué bonito fue</div>
            <div className="splash__brand" style={{ marginTop: 24 }}>Chelis en Japón</div>
          </div>
        </div>
      );
    }

    // Cuenta atrás (lo normal: antes del viaje)
    const label = countdown.days === 1 ? 'día para' : 'días para';

    return (
      <div className="splash__content">
        <div className="splash__pre">Japón 2026</div>

        <div
          className="splash__number"
          aria-label={`${countdown.days} días, ${countdown.hours} horas y ${countdown.minutes} minutos para el despegue`}
        >
          {countdown.days}
        </div>

        <div className="splash__days-label">{label} el despegue</div>

        <div className="splash__live-countdown" aria-hidden="true">
          <span className="splash__live-countdown-unit">{pad2(countdown.hours)}</span>
          <span className="splash__live-countdown-suffix">h</span>
          <span className="splash__live-countdown-sep">·</span>
          <span className="splash__live-countdown-unit">{pad2(countdown.minutes)}</span>
          <span className="splash__live-countdown-suffix">min</span>
          <span className="splash__live-countdown-sep">·</span>
          <span className="splash__live-countdown-unit">{pad2(countdown.seconds)}</span>
          <span className="splash__live-countdown-suffix">s</span>
        </div>

        <div className="splash__destination">TOKIO</div>

        <div className="splash__line" aria-hidden="true" />

        <div className="splash__date">13 AGO · 25 AGO · 13 días</div>

        <div className="splash__brand">Chelis en Japón</div>
      </div>
    );
  };

  return (
    <>
      <style>{STYLES}</style>
      <div
        className={`splash${exiting ? ' splash--exiting' : ''}`}
        onClick={dismiss}
        role="dialog"
        aria-modal="true"
        aria-label="Pantalla de introducción. Toca para entrar."
      >
        {/* Pseudo-vídeo: slideshow de fotos de Japón */}
        <div className="splash__slideshow" aria-hidden="true">
          {SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`splash__slide${i === slideIndex ? ' splash__slide--active' : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <div className="splash__slide-overlay" aria-hidden="true" />

        {/* Capas aurora */}
        <div className="splash__aurora splash__aurora--1" aria-hidden="true" />
        <div className="splash__aurora splash__aurora--2" aria-hidden="true" />
        <div className="splash__aurora splash__aurora--3" aria-hidden="true" />

        {/* Botón saltar */}
        <button
          className="splash__skip"
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          aria-label="Saltar introducción"
        >
          Saltar ›
        </button>

        {/* Contenido */}
        {renderContent()}

        {/* Barra de progreso */}
        <div className="splash__progress" aria-hidden="true" />
      </div>
    </>
  );
}
