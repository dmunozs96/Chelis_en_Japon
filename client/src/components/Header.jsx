import React from 'react';
import DualClock from './DualClock.jsx';

export default function Header() {
  return (
    <header className="app-header-outer">
      <div className="app-header-inner">
        <div className="header-identity">
          <span className="header-mark" aria-hidden="true" />
          <span className="header-title">Chelis en Japón</span>
        </div>
        <DualClock />
      </div>
    </header>
  );
}
