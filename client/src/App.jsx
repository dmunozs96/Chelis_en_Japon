import React, { useState } from 'react';
import { useTripData } from './hooks/useTripData.js';
import DualClock  from './components/DualClock.jsx';
import TodayView  from './components/TodayView.jsx';
import DayNav     from './components/DayNav.jsx';

/* ---------------------------------------------------------------
   App-level styles (layout, header, tabs)
   --------------------------------------------------------------- */
const APP_STYLES = `
/* ---- App shell ---- */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
}

/* ---- Header ---- */
.app-header {
  background: var(--color-torii);
  color: white;
  padding: 16px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-header__title {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.app-header__subtitle {
  font-size: 0.78rem;
  opacity: 0.85;
  font-weight: 400;
}

/* ---- Main sections toggle ---- */
.section-tabs {
  display: flex;
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
}

.section-tab {
  flex: 1;
  padding: 10px 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  font-family: inherit;
  transition: color 0.15s, box-shadow 0.15s;
}

.section-tab--active {
  color: var(--color-torii);
  box-shadow: inset 0 -2px 0 var(--color-torii);
}

.section-tab:hover:not(.section-tab--active) {
  color: var(--color-text);
}

/* ---- Content area ---- */
.app-content {
  flex: 1;
  overflow-y: auto;
}

/* ---- Loading / error states ---- */
.app-loading,
.app-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  padding: 24px;
  text-align: center;
}
.app-error { color: var(--color-torii); }
`;

const SECTIONS = [
  { id: 'hoy',   label: '📅 Hoy' },
  { id: 'todos', label: '🗓 Todos los días' },
];

function todayCity(days) {
  if (!days.length) return 'Japón';
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const day = days.find(d => d.date === iso);
  return day?.city ?? 'Japón';
}

export default function App() {
  const { days, loading, error } = useTripData();
  const [activeSection, setActiveSection] = useState('hoy');

  const city = todayCity(days);

  return (
    <>
      <style>{APP_STYLES}</style>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__title">Chelis en Japón 🗾</div>
          <div className="app-header__subtitle">Guía interactiva · Agosto 2026</div>
        </header>

        {/* Dual clock — always visible */}
        <DualClock currentCity={city} />

        {/* Section tabs */}
        <nav className="section-tabs" aria-label="Secciones">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`section-tab${activeSection === s.id ? ' section-tab--active' : ''}`}
              onClick={() => setActiveSection(s.id)}
              aria-current={activeSection === s.id ? 'page' : undefined}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="app-content">
          {loading && <div className="app-loading">Cargando datos del viaje…</div>}
          {error   && <div className="app-error">Error cargando datos: {error}</div>}

          {!loading && !error && activeSection === 'hoy'   && <TodayView days={days} />}
          {!loading && !error && activeSection === 'todos' && <DayNav    days={days} />}
        </main>
      </div>
    </>
  );
}
