import React from 'react';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';

const CLIMATE_STYLES = `
.climate-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 13px; }
.climate-value { padding: 10px 5px; border-radius: 10px; background: var(--bg-secondary); text-align: center; }
.climate-value strong { display: block; color: var(--label-primary); font-size: 20px; }
.climate-value span { color: var(--label-secondary); font-size: 10px; text-transform: uppercase; }
`;

export default function ClimateView({ onBack }) {
  const { data, loading, error } = useTravelToolsData();
  const climate = data?.climate;
  return (
    <>
      <style>{TRAVEL_TOOL_STYLES}{CLIMATE_STYLES}</style>
      <div className="travel-tool" role="main" aria-label="Clima esperado por etapa">
        <nav className="travel-tool__nav"><button className="travel-tool__back" onClick={onBack}>← Volver</button><div className="travel-tool__title">Clima por etapa</div></nav>
        {loading && <div className="travel-loading">Cargando clima…</div>}
        {error && <div className="travel-loading">No se pudo cargar el clima: {error}</div>}
        {climate && <div className="travel-tool__body">
          <section className="travel-card travel-card--danger"><div className="travel-card__eyebrow">No es un pronóstico</div><div className="travel-card__title">Agosto será caluroso y húmedo</div><div className="travel-card__text">{climate.forecast_notice}</div><a className="travel-call" href="https://www.jma.go.jp/bosai/#lang=en" target="_blank" rel="noreferrer"><span>Abrir alertas JMA</span><span>↗</span></a></section>
          {climate.cities.map((city) => <section className="travel-card" key={city.city}>
            <div className="travel-card__eyebrow">{climate.period}</div><div className="travel-card__title">{city.city}</div>
            {city.mean_c !== null ? <div className="climate-values"><div className="climate-value"><strong>{city.max_c}°</strong><span>Máxima</span></div><div className="climate-value"><strong>{city.mean_c}°</strong><span>Media</span></div><div className="climate-value"><strong>{city.min_c}°</strong><span>Mínima</span></div></div> : <div className="travel-warning">Sin normal urbana comparable: se muestra orientación cualitativa.</div>}
            <div className="travel-card__text">{city.note}</div>
          </section>)}
          <section className="travel-card"><div className="travel-card__eyebrow">Todos los días</div><div className="travel-card__title">Kit contra el calor</div><ul className="travel-steps">{climate.essentials.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="travel-card"><div className="travel-card__eyebrow">Fuentes oficiales</div>{climate.sources.map((source) => <a className="travel-source" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</section>
        </div>}
      </div>
    </>
  );
}
