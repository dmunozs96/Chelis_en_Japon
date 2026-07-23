import React, { useState, useEffect, useRef } from 'react';
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
import OfflineBanner from './components/OfflineBanner.jsx';
import EmergencyView from './components/EmergencyView.jsx';
import LastMileView   from './components/LastMileView.jsx';
import IcCardGuideView from './components/IcCardGuideView.jsx';
import PhrasesView     from './components/PhrasesView.jsx';
import CurrencyConverterView from './components/CurrencyConverterView.jsx';
import ClimateView from './components/ClimateView.jsx';
import PreparationView from './components/PreparationView.jsx';
import CulturalGuideView from './components/CulturalGuideView.jsx';
import ShoppingGuideView from './components/ShoppingGuideView.jsx';

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
  const { tripData, days, hotels, loading, error } = useTripData();
  const { alerts } = useAlertsData();
  const { getPoiById } = usePoisData();
  const [activeTab, setActiveTab] = useState('today');
  const [showTickets, setShowTickets] = useState(false);
  const [mapDayData, setMapDayData] = useState(null);
  const [mapRouteMode, setMapRouteMode] = useState(false);
  const [mapFocusLatLng, setMapFocusLatLng] = useState(null);
  const [poiId, setPoiId] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [alertBadge, setAlertBadge] = useState(0);
  const [selectedTripDate, setSelectedTripDate] = useState(null);
  const returnScrollRef = useRef(null);

  function rememberPosition() {
    returnScrollRef.current = window.scrollY;
  }

  function restorePosition() {
    const scrollY = returnScrollRef.current;
    returnScrollRef.current = null;
    if (scrollY === null) return;
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' })));
  }

  function openMap(day) {
    rememberPosition();
    setMapRouteMode(false);
    setMapFocusLatLng(null);
    setMapDayData(day);
  }

  function openRoute(day) {
    rememberPosition();
    setMapRouteMode(true);
    setMapFocusLatLng(null);
    setMapDayData(day);
  }

  function closeMap() {
    setMapDayData(null);
    setMapRouteMode(false);
    setMapFocusLatLng(null);
    restorePosition();
  }

  function openPoi(id) {
    rememberPosition();
    setPoiId(id);
  }

  function closePoi() {
    setPoiId(null);
    if (mapDayData === null) restorePosition();
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
    return <><OfflineBanner /><SplashScreen trip={tripData?.trip} onDismiss={dismissSplash} /></>;
  }

  // If POIDetailView is showing, render it over everything (highest priority overlay)
  if (poiId !== null) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <OfflineBanner />
        <POIDetailView
          poi={getPoiById(poiId)}
          onBack={closePoi}
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
        <OfflineBanner />
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
        <OfflineBanner />
        <PlannerView onBack={() => setShowPlanner(false)} />
      </>
    );
  }

  // If TicketsView is showing, render it over everything
  if (showTickets) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <OfflineBanner />
        <TicketsView onBack={() => setShowTickets(false)} />
      </>
    );
  }

  if (activeTool === 'emergency') {
    return <><OfflineBanner /><EmergencyView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'last-mile') {
    return <><OfflineBanner /><LastMileView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'ic-card') {
    return <><OfflineBanner /><IcCardGuideView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'phrases') {
    return <><OfflineBanner /><PhrasesView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'currency') {
    return <><OfflineBanner /><CurrencyConverterView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'climate') {
    return <><OfflineBanner /><ClimateView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'preparation') {
    return <><OfflineBanner /><PreparationView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'culture') {
    return <><OfflineBanner /><CulturalGuideView onBack={() => setActiveTool(null)} /></>;
  }

  if (activeTool === 'shopping') {
    return <><OfflineBanner /><ShoppingGuideView onBack={() => setActiveTool(null)} /></>;
  }

  return (
    <>
      <style>{LOADING_STYLES}</style>
      <div className="app-shell">
        <OfflineBanner />
        <Header />

        <main className="main-content">
          {loading && <div className="app-loading">Cargando datos del viaje…</div>}
          {error   && <div className="app-error">Error cargando datos: {error}</div>}

          {!loading && !error && activeTab === 'today'       && (
            <TodayView trip={tripData?.trip} days={days} onOpenMap={openMap} onOpenPoi={openPoi} onOpenRoute={openRoute} onOpenIcGuide={() => setActiveTool('ic-card')} onOpenPreparation={() => setActiveTool('preparation')} />
          )}
          {!loading && !error && activeTab === 'trip'        && (
            <DayNav days={days} selectedDate={selectedTripDate} onSelectedDateChange={setSelectedTripDate} onOpenMap={openMap} onOpenPoi={openPoi} onOpenRoute={openRoute} />
          )}
          {!loading && !error && activeTab === 'alerts'      && (
            <AlertsView onBadgeChange={setAlertBadge} />
          )}
          {!loading && !error && activeTab === 'restaurants' && (
            <RestaurantsView onOpenPlanner={() => setShowPlanner(true)} />
          )}
          {!loading && !error && activeTab === 'more'        && (
            <MoreView onNavigate={(dest) => dest === 'tickets' ? setShowTickets(true) : setActiveTool(dest)} />
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
