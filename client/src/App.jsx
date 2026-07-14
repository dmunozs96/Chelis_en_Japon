import React, { useState } from 'react';
import { useTripData } from './hooks/useTripData.js';
import Header      from './components/Header.jsx';
import BottomNav   from './components/BottomNav.jsx';
import TodayView   from './components/TodayView.jsx';
import DayNav      from './components/DayNav.jsx';
import ComingSoon  from './components/ComingSoon.jsx';

/* ---------------------------------------------------------------
   App — shell principal
   Gestiona el tab activo y compone el layout:
     Header (glass, fixed top) + main content + BottomNav (glass, fixed bottom)
   --------------------------------------------------------------- */

const LOADING_STYLES = `
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 144px);
  font-size: 15px;
  color: var(--label-secondary);
  padding: var(--page-padding);
  text-align: center;
}

.app-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 144px);
  font-size: 15px;
  color: var(--accent);
  padding: var(--page-padding);
  text-align: center;
}
`;

export default function App() {
  const { days, loading, error } = useTripData();
  const [activeTab, setActiveTab] = useState('today');

  return (
    <>
      <style>{LOADING_STYLES}</style>
      <div className="app-shell">
        <Header />

        <main className="main-content">
          {loading && <div className="app-loading">Cargando datos del viaje…</div>}
          {error   && <div className="app-error">Error cargando datos: {error}</div>}

          {!loading && !error && activeTab === 'today'       && <TodayView days={days} />}
          {!loading && !error && activeTab === 'trip'        && <DayNav    days={days} />}
          {!loading && !error && activeTab === 'map'         && <ComingSoon label="Mapa" />}
          {!loading && !error && activeTab === 'restaurants' && <ComingSoon label="Restaurantes" />}
          {!loading && !error && activeTab === 'tickets'     && <ComingSoon label="Billetes" />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
}
