import React from 'react';
import Icon from './ui/Icon.jsx';

const TABS = [
  { id: 'today', label: 'Hoy', icon: 'today' },
  { id: 'trip', label: 'Viaje', icon: 'route' },
  { id: 'alerts', label: 'Alertas', icon: 'alert' },
  { id: 'restaurants', label: 'Restaurantes', icon: 'restaurant' },
  { id: 'more', label: 'Más', icon: 'more' },
];

export default function BottomNav({ activeTab, onTabChange, alertBadge = 0 }) {
  return (
    <div className="bottom-nav-outer">
      <nav className="bottom-nav-inner" aria-label="Navegación principal">
        {TABS.map(({ id, label, icon }) => {
          const isActive = activeTab === id;
          const showBadge = id === 'alerts' && alertBadge > 0;

          return (
            <button
              key={id}
              type="button"
              className={`bottom-nav__tab${isActive ? ' bottom-nav__tab--active' : ''}`}
              onClick={() => onTabChange(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={showBadge ? `${label}, ${alertBadge} alertas` : label}
            >
              <span className="bottom-nav__tab-wrapper">
                <span className="bottom-nav__icon"><Icon name={icon} size={22} /></span>
                {showBadge && (
                  <span className="bottom-nav__badge" aria-hidden="true">
                    {alertBadge > 9 ? '9+' : alertBadge}
                  </span>
                )}
              </span>
              <span className="bottom-nav__label">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
