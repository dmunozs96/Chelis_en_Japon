import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from './ui/Icon.jsx';

/* ---------------------------------------------------------------
   MapView
   Pantalla de mapa completa. Overlay fijo sobre toda la app.
   Muestra posición del usuario, hotel del día y POIs del día.
   --------------------------------------------------------------- */

const STYLES = `
/* ---- Contenedor principal ---- */
.map-view {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
}

/* ---- Barra de navegación superior ---- */
.map-nav {
  position: relative;
  z-index: 10;
  height: 60px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
}

.map-nav__back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--accent);
  font-size: 17px;
  font-family: var(--font);
  font-weight: 400;
  cursor: pointer;
  padding: 8px 0;
  -webkit-tap-highlight-color: transparent;
}

.map-nav__back svg {
  flex-shrink: 0;
}

.map-nav__title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  letter-spacing: -0.2px;
}

/* ---- Contenedor del mapa ---- */
.map-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
}

/* El div que Leaflet usa — height explícito requerido */
#chelis-map {
  width: 100%;
  height: calc(100dvh - 60px - 120px);
  background: #e8e0d8;
}

/* ---- Banner sin GPS ---- */
.map-no-gps-banner {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--separator);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: var(--label-secondary);
  white-space: nowrap;
  pointer-events: none;
}

/* ---- Mini panel inferior de POIs ---- */
.map-panel {
  position: relative;
  z-index: 10;
  height: 120px;
  background: var(--bg-surface);
  border-top: 1px solid var(--separator);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.map-panel__handle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0 4px;
  flex-shrink: 0;
}

.map-panel__handle-bar {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--separator);
}

.map-panel__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 16px 6px;
  flex-shrink: 0;
}

.map-panel__list {
  display: flex;
  gap: 10px;
  padding: 0 16px 12px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex: 1;
}

.map-panel__list::-webkit-scrollbar {
  display: none;
}

.map-panel__empty {
  padding: 0 16px;
  font-size: 14px;
  color: var(--label-tertiary);
  display: flex;
  align-items: center;
  flex: 1;
}

/* ---- POI chip en el panel ---- */
.poi-chip {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  width: 140px;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  border: 1.5px solid transparent;
  transition: border-color 0.15s;
}

.poi-chip:active {
  border-color: var(--accent);
}

.poi-chip__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--label-primary);
  line-height: 1.3;
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poi-chip__type {
  font-size: 11px;
  color: var(--label-secondary);
  text-transform: capitalize;
}

/* ---- Hotel chip en el panel ---- */
.hotel-chip {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  width: 140px;
  background: rgba(232, 0, 45, 0.07);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  border: 1.5px solid rgba(232, 0, 45, 0.15);
}

.hotel-chip:active {
  border-color: var(--accent);
}

.hotel-chip__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--label-primary);
  line-height: 1.3;
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hotel-chip__type {
  font-size: 11px;
  color: var(--accent);
  font-weight: 500;
}

/* ---- CSS de los marcadores SVG ---- */
@keyframes map-pulse {
  0%   { transform: scale(1); opacity: 0.8; }
  70%  { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
}

.marker-user {
  position: relative;
  width: 22px;
  height: 22px;
}

.marker-user__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #007AFF;
  opacity: 0.3;
  animation: map-pulse 2s ease-out infinite;
}

.marker-user__dot {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: #007AFF;
  border: 2.5px solid #fff;
  box-shadow: 0 1px 4px rgba(0,122,255,0.5);
}

/* Popups Leaflet custom */
.leaflet-popup-content-wrapper {
  border-radius: 12px !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15) !important;
  border: none !important;
  padding: 0 !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  font-family: var(--font) !important;
}

.leaflet-popup-tip-container {
  display: none !important;
}

.map-popup {
  padding: 12px 14px;
  min-width: 180px;
  max-width: 240px;
}

.map-popup__name {
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 4px;
  line-height: 1.3;
}

.map-popup__type {
  font-size: 12px;
  color: #8E8E93;
  text-transform: capitalize;
  margin-bottom: 6px;
}

.map-popup__note {
  font-size: 13px;
  color: #3a3a3c;
  line-height: 1.45;
}
.map-view{max-width:var(--shell-max);background:var(--ink-950)}.map-nav{height:calc(56px + env(safe-area-inset-top));padding:env(safe-area-inset-top) var(--page-padding) 0;border-bottom:1px solid var(--separator);background:rgb(13 14 16 / 94%);backdrop-filter:none;-webkit-backdrop-filter:none}.map-nav__back{color:var(--paper-100);font-size:13px;font-weight:650}.map-nav__title{font-family:var(--font-display);font-size:16px;font-weight:600}
#chelis-map{height:calc(100dvh - 56px - env(safe-area-inset-top) - 150px)}.map-no-gps-banner{top:12px;padding:7px 11px;border-radius:var(--radius-chip);background:rgb(13 14 16 / 92%);color:var(--paper-300);backdrop-filter:none;-webkit-backdrop-filter:none}
.map-panel{height:150px;padding:0 var(--page-padding) env(safe-area-inset-bottom);background:var(--ink-950)}.map-panel__handle{padding-top:10px}.map-panel__title{padding:2px 0 8px;color:var(--paper-300);font-size:10px;font-weight:750;letter-spacing:.13em}.map-panel__list{gap:0;padding:0;overflow-x:auto}.poi-chip,.hotel-chip{width:160px;padding:12px 14px;border:0;border-right:1px solid var(--separator);border-radius:0;background:transparent;color:inherit;font-family:var(--font);text-align:left}.poi-chip__name,.hotel-chip__name{font-family:var(--font-display);font-size:14px;font-weight:600}.hotel-chip__type{color:var(--moss-500)}
@media(prefers-reduced-motion:reduce){.marker-user__ring{animation:none}}
`;

/* ---- Helpers para crear iconos SVG ---- */

function createUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="marker-user"><div class="marker-user__ring"></div><div class="marker-user__dot"></div></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function createHotelIcon() {
  const svg = `
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="#E8002D"/>
      <rect x="8" y="13" width="16" height="10" rx="2" fill="white" opacity="0.9"/>
      <rect x="10" y="16" width="5" height="5" rx="1" fill="#E8002D"/>
      <rect x="17" y="16" width="5" height="5" rx="1" fill="#E8002D"/>
    </svg>`;
  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

function createPoiIcon(type, number) {
  const isMemorial = type === 'memorial';
  const color = isMemorial ? '#8C8982' : '#E8002D';
  const label = number != null
    ? `<text x="13" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="white" font-family="sans-serif">${number}</text>`
    : `<circle cx="13" cy="13" r="4" fill="white" opacity="0.9"/>`;
  const svg = `
    <svg width="26" height="34" viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 8.5 13 21 13 21s13-12.5 13-21C26 5.82 20.18 0 13 0z" fill="${color}"/>
      ${label}
    </svg>`;
  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -34],
  });
}

function popupContent(name, type, note) {
  return `
    <div class="map-popup">
      <div class="map-popup__name">${name}</div>
      ${type ? `<div class="map-popup__type">${type}</div>` : ''}
      ${note ? `<div class="map-popup__note">${note}</div>` : ''}
    </div>`;
}

/* ---- Coordenadas de fallback por ciudad ---- */
const CITY_CENTERS = {
  'Tokio':     [35.6762, 139.6503],
  'Hakone':    [35.2324, 139.1069],
  'Kioto':     [35.0116, 135.7681],
  'Hiroshima': [34.3853, 132.4553],
  'Osaka':     [34.6937, 135.5023],
};

/* ---- Componente principal ---- */
export default function MapView({ dayData, allHotels, onBack, centerOn = 'user', routeMode = false, onOpenPoi, focusLatLng = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [noGps, setNoGps] = useState(false);

  // Buscar el hotel del día en allHotels para obtener lat/lng
  const hotelName = dayData?.hotel?.name ?? null;
  const hotelFull = hotelName
    ? allHotels.find(h => h.name === hotelName) ?? null
    : null;

  const allPois = dayData?.pois ?? [];
  const city = dayData?.city ?? 'Tokio';

  // En modo ruta: orden de POIs según los bloques del día que tienen poi_id
  const routePois = routeMode
    ? (dayData?.blocks ?? [])
        .filter(b => b.poi_id)
        .map(b => allPois.find(p => p.id === b.poi_id))
        .filter(Boolean)
    : [];

  const pois = routeMode ? routePois : allPois;

  useEffect(() => {
    if (!mapRef.current) return;
    // Si ya existe instancia, limpiar antes de reiniciar
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Determinar centro inicial de fallback
    const hotelCenter = hotelFull?.lat && hotelFull?.lng
      ? [hotelFull.lat, hotelFull.lng]
      : null;
    const cityCenter = CITY_CENTERS[city] ?? [35.6762, 139.6503];
    const fallbackCenter = focusLatLng ?? hotelCenter ?? cityCenter;

    // Inicializar mapa
    const map = L.map(mapRef.current, {
      center: fallbackCenter,
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });
    mapInstanceRef.current = map;

    // Tile layer CartoDB Positron
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Añadir marcador del hotel del día
    if (hotelFull?.lat && hotelFull?.lng) {
      const hotelMarker = L.marker([hotelFull.lat, hotelFull.lng], { icon: createHotelIcon() });
      hotelMarker.bindPopup(popupContent(hotelFull.name, 'Hotel', null));
      hotelMarker.addTo(map);
    }

    // Añadir marcadores de POIs (numerados si es modo ruta)
    pois.forEach((poi, idx) => {
      if (poi.lat == null || poi.lng == null) return;
      const marker = L.marker([poi.lat, poi.lng], { icon: createPoiIcon(poi.type, routeMode ? idx + 1 : null) });
      if (onOpenPoi) {
        marker.on('click', () => onOpenPoi(poi.id));
      } else {
        marker.bindPopup(popupContent(poi.name, poi.type, poi.note));
      }
      marker.addTo(map);
    });

    // Polyline conectando los POIs en orden (modo ruta)
    if (routeMode && pois.length > 1) {
      const latlngs = pois.filter(p => p.lat != null && p.lng != null).map(p => [p.lat, p.lng]);
      L.polyline(latlngs, {
        color: '#E8002D',
        weight: 3,
        opacity: 0.7,
        dashArray: '6 8',
      }).addTo(map);
    }

    // Geolocalización. Si se pidió enfocar un punto concreto (focusLatLng,
    // p.ej. "Ver mapa" desde un POI), el GPS solo añade el marcador del
    // usuario — nunca roba el centro del mapa.
    const followUser = centerOn === 'user' && !focusLatLng;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!mapInstanceRef.current) return;
          const { latitude, longitude } = pos.coords;
          const userMarker = L.marker([latitude, longitude], { icon: createUserIcon() });
          userMarker.addTo(mapInstanceRef.current);
          if (followUser) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
          }
          setNoGps(false);
        },
        () => {
          // Sin permiso o fallo — centrar en hotel/ciudad
          setNoGps(true);
          if (mapInstanceRef.current && followUser) {
            mapInstanceRef.current.setView(fallbackCenter, 14);
          }
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    } else {
      setNoGps(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayData?.date, routeMode]);

  // Centrar mapa en un POI al tocar en el panel
  function flyToPoi(lat, lng, name, type, note) {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 0.6 });
    // Abrir popup al llegar
    setTimeout(() => {
      if (!mapInstanceRef.current) return;
      const popup = L.popup({ closeButton: false })
        .setLatLng([lat, lng])
        .setContent(popupContent(name, type, note))
        .openOn(mapInstanceRef.current);
    }, 700);
  }

  function flyToHotel() {
    if (!mapInstanceRef.current || !hotelFull?.lat) return;
    mapInstanceRef.current.flyTo([hotelFull.lat, hotelFull.lng], 16, { duration: 0.6 });
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="map-view" role="main" aria-label="Mapa del día">

        {/* Nav bar */}
        <nav className="map-nav">
          <button className="map-nav__back" onClick={onBack} aria-label="Volver">
            <Icon name="back" size={20}/>
            Volver
          </button>
          <span className="map-nav__title">{routeMode ? 'Ruta del día' : 'Mapa del día'}</span>
        </nav>

        {/* Contenedor del mapa */}
        <div className="map-wrapper">
          <div id="chelis-map" ref={mapRef} />

          {/* Banner sin GPS */}
          {noGps && (
            <div className="map-no-gps-banner" aria-live="polite">
              Sin ubicación en tiempo real
            </div>
          )}
        </div>

        {/* Mini panel inferior */}
        <div className="map-panel" aria-label="Lugares del día">
          <div className="map-panel__handle" aria-hidden="true">
            <div className="map-panel__handle-bar" />
          </div>
          <div className="map-panel__title">{routeMode ? 'Orden de la ruta' : 'Lugares del día'}</div>

          {(pois.length === 0 && !hotelFull) ? (
            <div className="map-panel__empty">Sin lugares para este día</div>
          ) : (
            <div className="map-panel__list">
              {/* Hotel primero si existe (no en modo ruta) */}
              {!routeMode && hotelFull?.lat && hotelFull?.lng && (
                <button
                  className="hotel-chip"
                  aria-label={`Hotel: ${hotelFull.name}`}
                  onClick={flyToHotel}
                >
                  <div className="hotel-chip__name">{hotelFull.name}</div>
                  <div className="hotel-chip__type">Hotel</div>
                </button>
              )}

              {/* POIs */}
              {pois.map((poi, idx) => {
                const handleTap = () => {
                  if (onOpenPoi) { onOpenPoi(poi.id); return; }
                  if (poi.lat != null) flyToPoi(poi.lat, poi.lng, poi.name, poi.type, poi.note);
                };
                return (
                  <button
                    key={poi.id}
                    className="poi-chip"
                    aria-label={`POI: ${poi.name}`}
                    onClick={handleTap}
                  >
                    <div className="poi-chip__name">{routeMode ? `${idx + 1}. ${poi.name}` : poi.name}</div>
                    <div className="poi-chip__type">{poi.type}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
