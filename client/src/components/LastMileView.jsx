import React from 'react';
import { useTripData } from '../hooks/useTripData.js';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';

export default function LastMileView({ onBack }) {
  const { hotels, loading: tripLoading } = useTripData();
  const { data, loading: toolsLoading, error } = useTravelToolsData();
  const uniqueHotels = hotels.filter((hotel, index) => hotels.findIndex((item) => item.name === hotel.name) === index);

  return (
    <>
      <style>{TRAVEL_TOOL_STYLES}</style>
      <div className="travel-tool" role="main" aria-label="Cómo llegar a los hoteles">
        <nav className="travel-tool__nav">
          <button className="travel-tool__back" onClick={onBack}>← Volver</button>
          <div className="travel-tool__title">Llegar al hotel</div>
        </nav>
        {(tripLoading || toolsLoading) && <div className="travel-loading">Cargando rutas…</div>}
        {error && <div className="travel-loading">No se pudieron cargar las rutas: {error}</div>}
        {data && !tripLoading && (
          <div className="travel-tool__body">
            <div className="travel-tool__intro">Guía del último tramo con equipaje. Las rutas están disponibles offline; abre el mapa solo si tienes conexión.</div>
            {uniqueHotels.map((hotel) => {
              const access = data.hotel_access.find((item) => item.hotel_ids.includes(hotel.id));
              if (!access) return null;
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`;
              return (
                <section className="travel-card" key={hotel.id}>
                  <div className="travel-card__eyebrow">{hotel.city} · desde {access.from_station}</div>
                  <div className="travel-card__title">{hotel.name}</div>
                  <div className="travel-card__text">{access.summary}</div>
                  <ol className="travel-steps">{access.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  {access.shuttle && <div className="travel-warning">🚌 {access.shuttle}</div>}
                  {access.needs_confirmation && <div className="travel-warning">⚠️ Confirma este servicio directamente con el alojamiento antes de usarlo.</div>}
                  <a className="travel-call travel-call--secondary" href={mapUrl} target="_blank" rel="noreferrer"><span>Abrir ubicación</span><span>↗</span></a>
                  <a className="travel-source" href={access.source} target="_blank" rel="noreferrer">Fuente oficial ↗</a>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
