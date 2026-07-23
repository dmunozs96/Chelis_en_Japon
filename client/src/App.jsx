import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useTripData, useAlertsData, getUnreadActionCount } from './hooks/useTripData.js';
import { usePoisData } from './hooks/usePoisData.js';
import Header        from './components/Header.jsx';
import BottomNav     from './components/BottomNav.jsx';
import TodayView     from './components/TodayView.jsx';
import DayNav        from './components/DayNav.jsx';
import AlertsView    from './components/AlertsView.jsx';
import MoreView      from './components/MoreView.jsx';
import SplashScreen  from './components/SplashScreen.jsx';
import RestaurantsView from './components/RestaurantsView.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import EmergencyView from './components/EmergencyView.jsx';
import LastMileView   from './components/LastMileView.jsx';
import IcCardGuideView from './components/IcCardGuideView.jsx';
import PhrasesView     from './components/PhrasesView.jsx';
import CurrencyConverterView from './components/CurrencyConverterView.jsx';
import ClimateView from './components/ClimateView.jsx';
import PreparationView from './components/PreparationView.jsx';
import CulturalGuideView from './components/CulturalGuideView.jsx';
import RecoverableState from './components/ui/RecoverableState.jsx';
import { appPath, parseLocation } from './lib/navigation.js';

const TicketsView = lazy(() => import('./components/TicketsView.jsx'));
const MapView = lazy(() => import('./components/MapView.jsx'));
const POIDetailView = lazy(() => import('./components/POIDetailView.jsx'));
const PlannerView = lazy(() => import('./components/PlannerView.jsx'));
const ShoppingGuideView = lazy(() => import('./components/ShoppingGuideView.jsx'));

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

function LazyBoundary({ children }) {
  return <Suspense fallback={<div className="app-loading">Abriendo…</div>}>{children}</Suspense>;
}

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
  const initialRouteRef = useRef(parseLocation());

  function navigate(route, state = {}) {
    window.history.pushState({ ...state, route, appEntry: true, canGoBack: true }, '', appPath(route));
    applyRoute(route, state);
  }

  function applyRoute(route, state = {}) {
    setShowTickets(route.view === 'tickets');
    setShowPlanner(route.view === 'planner');
    setActiveTool(route.view === 'tool' ? route.tool : null);
    setPoiId(route.view === 'poi' ? route.id : null);
    setMapDayData(route.view === 'map' ? (state.mapDayData ?? days.find((day) => day.date === route.date) ?? null) : null);
    setMapRouteMode(route.view === 'map' && Boolean(route.routeMode));
    if (route.view === 'trip') {
      setActiveTab('trip');
      setSelectedTripDate(route.date);
    } else if (['today', 'alerts', 'restaurants', 'more'].includes(route.view)) {
      setActiveTab(route.view);
    }
  }

  useEffect(() => {
    const onPopState = (event) => applyRoute(parseLocation(), event.state ?? {});
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [days]);

  useEffect(() => {
    window.history.replaceState(
      { ...(window.history.state ?? {}), route: initialRouteRef.current, appEntry: true, canGoBack: false },
      '',
      window.location.href,
    );
  }, []);

  useEffect(() => {
    applyRoute(initialRouteRef.current, window.history.state ?? {});
    // Re-evaluate once trip data exists so /mapa/:date resolves after loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  function goBack(fallback = '/') {
    if (window.history.state?.canGoBack) window.history.back();
    else {
      window.history.replaceState({ appEntry: true, canGoBack: false }, '', fallback);
      applyRoute(parseLocation());
    }
  }

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
    setMapFocusLatLng(null);
    navigate({ view: 'map', date: day.date, routeMode: false }, { mapDayData: day });
  }

  function openRoute(day) {
    rememberPosition();
    setMapFocusLatLng(null);
    navigate({ view: 'map', date: day.date, routeMode: true }, { mapDayData: day });
  }

  function closeMap() {
    goBack('/');
    setMapFocusLatLng(null);
    window.setTimeout(restorePosition, 0);
  }

  function openPoi(id) {
    rememberPosition();
    navigate({ view: 'poi', id });
  }

  function closePoi() {
    goBack('/');
    if (mapDayData === null) window.setTimeout(restorePosition, 0);
  }

  function openPoiFromMap(id) {
    navigate({ view: 'poi', id });
  }

  function openMapFromPoi(poi) {
    setMapFocusLatLng(poi.lat != null && poi.lng != null ? [poi.lat, poi.lng] : null);
    const mapDay = {
      city: poi.city,
      hotel: null,
      pois: [{ id: poi.id, name: poi.name, lat: poi.lat, lng: poi.lng, type: poi.category, note: poi.significance }],
    };
    navigate({ view: 'map', date: 'lugar', routeMode: false }, { mapDayData: mapDay });
  }

  // Splash: muestra una vez por sesión
  const [showSplash, setShowSplash] = useState(() => {
    try { return window.location.pathname === '/' && !sessionStorage.getItem('splash_shown'); } catch { return true; }
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
        <LazyBoundary><POIDetailView
          poi={getPoiById(poiId)}
          onBack={closePoi}
          onOpenMap={openMapFromPoi}
        /></LazyBoundary>
      </>
    );
  }

  // If MapView is showing, render it over everything
  if (mapDayData !== null) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <OfflineBanner />
        <LazyBoundary><MapView
          dayData={mapDayData}
          allHotels={hotels}
          onBack={closeMap}
          routeMode={mapRouteMode}
          focusLatLng={mapFocusLatLng}
          onOpenPoi={mapDayData?.kind === 'restaurants' ? null : openPoiFromMap}
        /></LazyBoundary>
      </>
    );
  }

  // If PlannerView is showing, render it over everything
  if (showPlanner) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <OfflineBanner />
        <LazyBoundary><PlannerView onBack={() => goBack('/restaurantes')} /></LazyBoundary>
      </>
    );
  }

  // If TicketsView is showing, render it over everything
  if (showTickets) {
    return (
      <>
        <style>{LOADING_STYLES}</style>
        <OfflineBanner />
        <LazyBoundary><TicketsView onBack={() => goBack('/mas')} /></LazyBoundary>
      </>
    );
  }

  if (activeTool === 'emergency') {
    return <><OfflineBanner /><EmergencyView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'last-mile') {
    return <><OfflineBanner /><LastMileView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'ic-card') {
    return <><OfflineBanner /><IcCardGuideView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'phrases') {
    return <><OfflineBanner /><PhrasesView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'currency') {
    return <><OfflineBanner /><CurrencyConverterView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'climate') {
    return <><OfflineBanner /><ClimateView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'preparation') {
    return <><OfflineBanner /><PreparationView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'culture') {
    return <><OfflineBanner /><CulturalGuideView onBack={() => goBack('/mas')} /></>;
  }

  if (activeTool === 'shopping') {
    return <><OfflineBanner /><LazyBoundary><ShoppingGuideView onBack={() => goBack('/mas')} /></LazyBoundary></>;
  }

  return (
    <>
      <style>{LOADING_STYLES}</style>
      <div className="app-shell">
        <OfflineBanner />
        <Header />

        <main className="main-content">
          {loading && <div className="app-loading">Cargando datos del viaje…</div>}
          {error   && <RecoverableState title="No se pudo abrir la guía" detail={navigator.onLine ? error : 'No hay conexión y este dispositivo todavía no tiene una copia offline.'} />}

          {!loading && !error && activeTab === 'today'       && (
            <TodayView trip={tripData?.trip} days={days} onOpenMap={openMap} onOpenPoi={openPoi} onOpenRoute={openRoute} onOpenIcGuide={() => navigate({ view: 'tool', tool: 'ic-card' })} onOpenPreparation={() => navigate({ view: 'tool', tool: 'preparation' })} onOpenTickets={() => navigate({ view: 'tickets' })} onFindFood={() => navigate({ view: 'restaurants' })} />
          )}
          {!loading && !error && activeTab === 'trip'        && (
            <DayNav days={days} selectedDate={selectedTripDate} onSelectedDateChange={(date) => navigate({ view: 'trip', date })} onOpenMap={openMap} onOpenPoi={openPoi} onOpenRoute={openRoute} />
          )}
          {!loading && !error && activeTab === 'alerts'      && (
            <AlertsView onBadgeChange={setAlertBadge} />
          )}
          {!loading && !error && activeTab === 'restaurants' && (
            <RestaurantsView onOpenPlanner={() => navigate({ view: 'planner' })} onOpenMap={(restaurants) => navigate({ view: 'map', date: 'restaurantes' }, { mapDayData: { kind: 'restaurants', city: restaurants[0]?.city, hotel: null, pois: restaurants.map((r) => ({ ...r, type: 'restaurante', note: r.cuisine_description })) } })} />
          )}
          {!loading && !error && activeTab === 'more'        && (
            <MoreView onNavigate={(dest) => dest === 'tickets' ? navigate({ view: 'tickets' }) : navigate({ view: 'tool', tool: dest })} />
          )}
        </main>

        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => navigate({ view: tab })}
          alertBadge={alertBadge}
        />
      </div>
    </>
  );
}
