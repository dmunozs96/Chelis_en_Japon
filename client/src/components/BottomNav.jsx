import React from 'react';

/* ---------------------------------------------------------------
   BottomNav
   Tab bar glass fijo en la parte inferior. 5 tabs con iconos SVG
   inline. Las tabs deshabilitadas tienen pointer-events none.
   --------------------------------------------------------------- */

const STYLES = `
.bottom-nav-outer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
}

.bottom-nav-inner {
  width: 100%;
  max-width: 480px;
  height: calc(64px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--separator);
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-top: 8px;
}

.bottom-nav__tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
  min-width: 56px;
  font-family: var(--font);
  transition: opacity var(--duration-micro) var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.bottom-nav__tab--disabled {
  opacity: 0.4;
  pointer-events: none;
}

.bottom-nav__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.bottom-nav__label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 1;
}

.bottom-nav__tab--active .bottom-nav__icon,
.bottom-nav__tab--active .bottom-nav__label {
  color: var(--accent);
}
.bottom-nav__tab--active svg {
  color: var(--accent);
}

.bottom-nav__tab:not(.bottom-nav__tab--active) .bottom-nav__label {
  color: var(--label-secondary);
}
.bottom-nav__tab:not(.bottom-nav__tab--active) svg {
  color: var(--label-secondary);
}

/* Badge de notificaciones */
.bottom-nav__tab-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.bottom-nav__badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: var(--accent);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--glass-bg);
  line-height: 1;
}
`;

/* --- Iconos SVG inline (24x24px, paths simples) --- */

function TodayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="4" x2="8" y2="7" />
      <line x1="16" y1="4" x2="16" y2="7" />
      <line x1="7" y1="13" x2="9" y2="13" />
      <line x1="11" y1="13" x2="13" y2="13" />
      <line x1="15" y1="13" x2="17" y2="13" />
      <line x1="7" y1="17" x2="9" y2="17" />
      <line x1="11" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function TripIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="19" cy="12" r="2.5" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" strokeDasharray="2 2" />
    </svg>
  );
}

function AlertsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      {/* Tenedor */}
      <line x1="8" y1="3" x2="8" y2="21" />
      <line x1="6" y1="3" x2="6" y2="8" />
      <line x1="10" y1="3" x2="10" y2="8" />
      <path d="M6 8 Q8 10 10 8" />
      {/* Cuchillo */}
      <path d="M16 3 L16 12 Q18 15 16 21" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="9" y1="9" x2="15" y2="15" strokeDasharray="2 2" />
    </svg>
  );
}

const TABS = [
  { id: 'today',       label: 'Hoy',         Icon: TodayIcon,   disabled: false },
  { id: 'trip',        label: 'Viaje',        Icon: TripIcon,    disabled: false },
  { id: 'alerts',      label: 'Alertas',      Icon: AlertsIcon,  disabled: false },
  { id: 'restaurants', label: 'Restaurantes', Icon: ForkIcon,    disabled: false },
  { id: 'more',        label: 'Más',          Icon: TicketIcon,  disabled: false },
];

// badge: número de alertas de Acción no leídas (se pasará desde App cuando esté implementado)
export default function BottomNav({ activeTab, onTabChange, alertBadge = 0 }) {
  return (
    <>
      <style>{STYLES}</style>
      <div className="bottom-nav-outer" role="navigation" aria-label="Navegación principal">
        <nav className="bottom-nav-inner">
          {TABS.map(({ id, label, Icon, disabled }) => {
            const isActive = activeTab === id;
            const showBadge = id === 'alerts' && alertBadge > 0;
            const classes = [
              'bottom-nav__tab',
              isActive ? 'bottom-nav__tab--active'  : '',
              disabled ? 'bottom-nav__tab--disabled' : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={id}
                className={classes}
                onClick={() => !disabled && onTabChange(id)}
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={disabled ? 'true' : undefined}
                aria-label={showBadge ? `${label}, ${alertBadge} alertas` : label}
              >
                <div className="bottom-nav__tab-wrapper">
                  <span className="bottom-nav__icon">
                    <Icon />
                  </span>
                  {showBadge && (
                    <span className="bottom-nav__badge" aria-hidden="true">
                      {alertBadge > 9 ? '9+' : alertBadge}
                    </span>
                  )}
                </div>
                <span className="bottom-nav__label">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
