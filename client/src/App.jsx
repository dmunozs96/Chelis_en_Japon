import React, { useState, useEffect } from 'react';
import { useTripData, useAlertsData, getUnreadActionCount } from './hooks/useTripData.js';
import { usePoisData } from './hooks/usePoisData.js';
import Header        from './components/Header.jsx';
import BottomNav     from './components/BottomNav.jsx';
import TodayView     from './components/TodayView.jsx';
import DayNav        from './components/DayNav.jsx';
import AlertsView    from './components/AlertsView.jsx';
import MoreView      from './components/MoreView.jsx';
import TicketsView   from './components/TicketsView.jsx';
import MapView       from './components/MapView.jsx';
import POIDetailView from './components/POIDetailView.jsx';
import SplashScreen  from './components/SplashScreen.jsx';
import RestaurantsView from './components/RestaurantsView.jsx';
import PlannerView   from './components/PlannerView.jsx';

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
  const { getPoiById } = usePoisData();
  const [activeTab, setActiveTab] = useState('today');
  const [showTickets, setShowTickets] = useState(false);
  const [mapDayData, setMapDayData] = useState(null);
  const [mapRouteMode, setMapRouteMode] = useState(false);
  const [mapFocusLatLng, setMapFocusLatLng] = useState(null);
  const [poiId, setPoiId] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [alertBadge, setAlertBadge] = useState(0);

  function openMap(day) {
    setMapRouteMode(false);
    setMapFocusLatLng(null);
    setMapDayData(day);
  }

  function openRoute(day) {
    setMapRouteMode(true);
    setMapFocusLatLng(null);
    setMapDayData(day);
  }

  function closeMap() {
    setMapDayData(null);
    setMapRouteMode(false);
    setMapFocusLatLng(null);
  }

  function openPoiFromMap(id) {
    setPoiId(id);
  }

  function openMapFromPoi(poi) {
    setMapRouteMode(false);
    setMapFocusLatLng(poi.lat != null && poi.lng != null ? [poi.lat, poi.lng] : null);
    setMapDayData({
      city: poi.city,
      hotel: null,
      pois: [{ id: poi.id, name: poi.name, lat: poi.lat, lng: poi.lng, type: poi.category, note: poi.significance }],
    });
    setPoiId(null);
  }

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

  // If POIDetailView is showing, render it over everything (highest priority overlay)
  if (poiId !== null) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <POIDetailView
          poi={getPoiById(poiId)}
          onBack={() => setPoiId(null)}
          onOpenMap={openMapFromPoi}
        />
      </>
    );
  }

  // If MapView is showing, render it over everything
  if (mapDayData !== null) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <MapView
          dayData={mapDayData}
          allHotels={hotels}
          onBack={closeMap}
          routeMode={mapRouteMode}
          focusLatLng={mapFocusLatLng}
          onOpenPoi={openPoiFromMap}
        />
      </>
    );
  }

  // If PlannerView is showing, render it over everything
  if (showPlanner) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <PlannerView onBack={() => setShowPlanner(false)} />
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

          {!loading && !error && activeTab === 'today'       && (
            <TodayView days={days} onOpenMap={openMap} onOpenPoi={setPoiId} onOpenRoute={openRoute} />
          )}
          {!loading && !error && activeTab === 'trip'        && (
            <DayNav days={days} onOpenMap={openMap} onOpenPoi={setPoiId} onOpenRoute={openRoute} />
          )}
          {!loading && !error && activeTab === 'alerts'      && (
            <AlertsView onBadgeChange={setAlertBadge} />
          )}
          {!loading && !error && activeTab === 'restaurants' && (
            <RestaurantsView onOpenPlanner={() => setShowPlanner(true)} />
          )}
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
