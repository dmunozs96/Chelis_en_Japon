import React from 'react';
import DualClock from './DualClock.jsx';

/* ---------------------------------------------------------------
   Header
   Glass header fijo en la parte superior. Contiene el título
   de la app y el DualClock compacto.
   --------------------------------------------------------------- */

const STYLES = `
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 100;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--page-padding);
  max-width: 480px;
  margin: 0 auto;
}

/* Necesario para que el header glass se centre igual que el app-shell */
.app-header-outer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
}

.app-header-inner {
  width: 100%;
  max-width: 480px;
  height: 60px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--page-padding);
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  letter-spacing: -0.2px;
  white-space: nowrap;
  flex-shrink: 0;
}
`;

export default function Header() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="app-header-outer" role="banner">
        <div className="app-header-inner">
          <span className="header-title">Chelis en Japón</span>
          <DualClock />
        </div>
      </div>
    </>
  );
}
