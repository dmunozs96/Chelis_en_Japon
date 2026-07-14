import React, { useState, useEffect } from 'react';
import { useTripData, useAlertsData, getUnreadActionCount } from './hooks/useTripData.js';
import Header        from './components/Header.jsx';
import BottomNav     from './components/BottomNav.jsx';
import TodayView     from './components/TodayView.jsx';
import DayNav        from './components/DayNav.jsx';
import ComingSoon    from './components/ComingSoon.jsx';
import AlertsView    from './components/AlertsView.jsx';
import MoreView      from './components/MoreView.jsx';
import TicketsView   from './components/TicketsView.jsx';
import MapView       from './components/MapView.jsx';
import SplashScreen  from './components/SplashScreen.jsx';

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
  const { days, hotels, loading, error } = useTripData();
  const { alerts } = useAlertsData();
  const [activeTab, setActiveTab] = useState('today');
  const [showTickets, setShowTickets] = useState(false);
  const [mapDayData, setMapDayData] = useState(null);
  const [alertBadge, setAlertBadge] = useState(0);

  // Splash: muestra una vez por sesión
  const [showSplash, setShowSplash] = useState(() => {
    try { return !sessionStorage.getItem('splash_shown'); } catch { return true; }
  });

  const dismissSplash = () => {
    try { sessionStorage.setItem('splash_shown', '1'); } catch {}
    setShowSplash(false);
  };

  // Compute initial badge from localStorage on mount and when alerts load
  useEffect(() => {
    if (alerts.length > 0) {
      setAlertBadge(getUnreadActionCount(alerts));
    }
  }, [alerts]);

  // Splash screen (primera visita de la sesión)
  if (showSplash) {
    return <SplashScreen onDismiss={dismissSplash} />;
  }

  // If MapView is showing, render it over everything
  if (mapDayData !== null) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <MapView
          dayData={mapDayData}
          allHotels={hotels}
          onBack={() => setMapDayData(null)}
        />
      </>
    );
  }

  // If TicketsView is showing, render it over everything
  if (showTickets) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <TicketsView onBack={() => setShowTickets(false)} />
      </>
    );
  }

  return (
    <>
      <style>{LOADING_STYLES}</style>
      <div className="app-shell">
        <Header />

        <main className="main-content">
          {loading && <div className="app-loading">Cargando datos del viaje…</div>}
          {error   && <div className="app-error">Error cargando datos: {error}</div>}

          {!loading && !error && activeTab === 'today'       && <TodayView days={days} onOpenMap={setMapDayData} />}
          {!loading && !error && activeTab === 'trip'        && <DayNav    days={days} />}
          {!loading && !error && activeTab === 'alerts'      && (
            <AlertsView onBadgeChange={setAlertBadge} />
          )}
          {!loading && !error && activeTab === 'restaurants' && <ComingSoon label="Restaurantes" />}
          {!loading && !error && activeTab === 'more'        && (
            <MoreView onNavigate={(dest) => dest === 'tickets' && setShowTickets(true)} />
          )}
        </main>

        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertBadge={alertBadge}
        />
      </div>
    </>
  );
}
