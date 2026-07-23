import React from 'react';
import Icon from './ui/Icon.jsx';

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
  gap: 32px;
}

/* Card principal de Billetes */
.more-tickets-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--ink-900);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card-lg);
  padding: 22px 20px;
  cursor: pointer;
  border: 1px solid var(--separator);
  width: 100%;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s var(--ease), box-shadow 0.15s var(--ease);
  min-height: 96px;
}

.more-tickets-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-card);
}

.more-tickets-icon {
  color: var(--paper-100);
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
  color: var(--paper-100);
  line-height: 1.2;
}

.more-tickets-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: var(--stone-500);
  line-height: 1.3;
}

.more-tickets-arrow {
  font-size: 22px;
  color: var(--torii-500);
  flex-shrink: 0;
  font-weight: 300;
}

/* Grid de herramientas */
.more-grid-header {
  margin-bottom: 4px;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: .13em;
  color: var(--paper-300);
  text-transform: uppercase;
  padding: 0 4px;
}

.more-grid {
  display: flex;
  flex-direction: column;
}

.more-tool-card {
  width: 100%;
  min-height: 58px;
  padding: 12px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 13px;
  position: relative;
  border: 0;
  border-bottom: 1px solid var(--separator);
  border-radius: 0;
  background: transparent;
  opacity: 1;
}

.more-tool-card--active {
  opacity: 1;
  border-bottom: 1px solid var(--separator);
  cursor: pointer;
  font-family: var(--font);
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.more-tool-card--active:active { opacity: .7; }

.more-tool-arrow { margin-left:auto; color:var(--stone-500); font-size:20px; }

.more-tool-icon {
  display:grid;
  width:32px;
  height:32px;
  place-items:center;
  color:var(--paper-300);
}

.more-tool-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  line-height: 1.3;
}

.more-section { display:flex; flex-direction:column; }

`;

const TOOL_GROUPS = [
  {
    label: 'En movimiento',
    tools: [
      { icon: 'hotel', label: 'Llegar al hotel', destination: 'last-mile' },
      { icon: 'ic', label: 'Guía Suica', destination: 'ic-card' },
      { icon: 'climate', label: 'Clima por etapa', destination: 'climate' },
    ],
  },
  {
    label: 'En Japón',
    tools: [
      { icon: 'phrases', label: 'Frases japonesas', destination: 'phrases' },
      { icon: 'currency', label: 'Conversor ¥/€', destination: 'currency' },
      { icon: 'shopping', label: 'Guía de compras', destination: 'shopping' },
    ],
  },
  {
    label: 'Antes y cultura',
    tools: [
      { icon: 'check', label: 'Preparar viaje', destination: 'preparation' },
      { icon: 'culture', label: 'Guía cultural', destination: 'culture' },
    ],
  },
  {
    label: 'Ayuda',
    tools: [
      { icon: 'emergency', label: 'Emergencias', destination: 'emergency' },
    ],
  },
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
          <Icon name="tickets" size={30} className="more-tickets-icon" />
          <div className="more-tickets-text">
            <div className="more-tickets-title">Billetes & Localizadores</div>
            <div className="more-tickets-subtitle">Vuelos · Hoteles · Trenes</div>
          </div>
          <div className="more-tickets-arrow" aria-hidden="true">›</div>
        </button>

        {TOOL_GROUPS.map((group) => (
          <section className="more-section" key={group.label}>
            <h2 className="more-grid-header">{group.label}</h2>
            <div className="more-grid">
              {group.tools.map((tool) => (
                <button
                  key={tool.label}
                  className="more-tool-card more-tool-card--active"
                  aria-label={tool.label}
                  onClick={() => onNavigate?.(tool.destination)}
                >
                  <Icon name={tool.icon} size={21} className="more-tool-icon" />
                  <span className="more-tool-label">{tool.label}</span>
                  <span className="more-tool-arrow" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
