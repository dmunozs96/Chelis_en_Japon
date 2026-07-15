import React from 'react';

/* ---------------------------------------------------------------
   MoreView
   Pantalla del tab "Más". Grid de herramientas operativas con card
   principal de Billetes.
   --------------------------------------------------------------- */

const STYLES = `
.more-view {
  padding: var(--page-padding);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Card principal de Billetes */
.more-tickets-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--accent);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card-lg);
  padding: 22px 20px;
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s var(--ease), box-shadow 0.15s var(--ease);
  min-height: 80px;
}

.more-tickets-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-card);
}

.more-tickets-icon {
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
}

.more-tickets-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.more-tickets-title {
  font-size: 19px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.more-tickets-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255,255,255,0.82);
  line-height: 1.3;
}

.more-tickets-arrow {
  font-size: 22px;
  color: rgba(255,255,255,0.7);
  flex-shrink: 0;
  font-weight: 300;
}

/* Grid de herramientas */
.more-grid-header {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--label-secondary);
  text-transform: uppercase;
  padding: 0 4px;
}

.more-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-card);
}

.more-tool-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  position: relative;
  min-height: 100px;
  opacity: 0.5;
  overflow: hidden;
}

.more-tool-card--active {
  opacity: 1;
  border: 1px solid var(--glass-border);
  cursor: pointer;
  font-family: var(--font);
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.more-tool-card--active:active { transform: scale(0.98); }

.more-tool-arrow { position: absolute; right: 14px; bottom: 12px; color: var(--accent); font-size: 20px; }

.more-tool-icon {
  font-size: 28px;
  line-height: 1;
}

.more-tool-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  line-height: 1.3;
}

`;

const TOOLS = [
  { icon: '✅', label: 'Preparar viaje', destination: 'preparation' },
  { icon: '⛩️', label: 'Guía cultural', destination: 'culture' },
  { icon: '🇯🇵', label: 'Frases japonesas', destination: 'phrases' },
  { icon: '¥', label: 'Conversor ¥/€', destination: 'currency' },
  { icon: '🚨', label: 'Emergencias', destination: 'emergency' },
  { icon: '🚇', label: 'Guía Suica', destination: 'ic-card' },
  { icon: '🧳', label: 'Llegar al hotel', destination: 'last-mile' },
  { icon: '🌡️', label: 'Clima por etapa', destination: 'climate' },
];

export default function MoreView({ onNavigate }) {
  return (
    <>
      <style>{STYLES}</style>
      <div className="more-view">
        {/* Card principal — Billetes */}
        <button
          className="more-tickets-card"
          onClick={() => onNavigate && onNavigate('tickets')}
          aria-label="Ver billetes y localizadores"
        >
          <div className="more-tickets-icon" aria-hidden="true">✈️</div>
          <div className="more-tickets-text">
            <div className="more-tickets-title">Billetes & Localizadores</div>
            <div className="more-tickets-subtitle">Vuelos · Hoteles · Trenes</div>
          </div>
          <div className="more-tickets-arrow" aria-hidden="true">›</div>
        </button>

        {/* Herramientas operativas */}
        <div className="more-grid-header">Herramientas</div>
        <div className="more-grid">
          {TOOLS.map((tool) => (
            <button
              key={tool.label}
              className="more-tool-card more-tool-card--active"
              aria-label={tool.label}
              onClick={() => onNavigate?.(tool.destination)}
            >
              <div className="more-tool-icon" aria-hidden="true">{tool.icon}</div>
              <div className="more-tool-label">{tool.label}</div>
              <div className="more-tool-arrow">›</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
