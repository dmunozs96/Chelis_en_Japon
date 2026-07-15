import React from 'react';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';

const SECTIONS = [
  ['Comprar al llegar', 'purchase', '①'],
  ['Cómo usarla', 'use', '②'],
  ['Cómo recargar', 'recharge', '③'],
];

export default function IcCardGuideView({ onBack }) {
  const { data, loading, error } = useTravelToolsData();
  const guide = data?.ic_card;

  return (
    <>
      <style>{TRAVEL_TOOL_STYLES}</style>
      <div className="travel-tool" role="main" aria-label="Guía Suica e IC card">
        <nav className="travel-tool__nav">
          <button className="travel-tool__back" onClick={onBack}>← Volver</button>
          <div className="travel-tool__title">Suica / IC card</div>
        </nav>
        {loading && <div className="travel-loading">Cargando guía…</div>}
        {error && <div className="travel-loading">No se pudo cargar la guía: {error}</div>}
        {guide && (
          <div className="travel-tool__body">
            <section className="travel-card" style={{ borderColor: 'rgba(232,0,45,.45)' }}>
              <div className="travel-card__eyebrow">Recomendación para este viaje</div>
              <div className="travel-card__title">{guide.recommendation}</div>
              <div className="travel-card__text">{guide.why}</div>
            </section>

            {SECTIONS.map(([title, key, number]) => (
              <section className="travel-card" key={key}>
                <div className="travel-card__eyebrow">{number} Paso</div>
                <div className="travel-card__title">{title}</div>
                <ol className="travel-steps">{guide[key].map((item) => <li key={item}>{item}</li>)}</ol>
              </section>
            ))}

            <section className="travel-card travel-card--danger">
              <div className="travel-card__eyebrow">Importante</div>
              <div className="travel-card__title">Antes de cargar dinero</div>
              {guide.warnings.map((warning) => <div className="travel-warning" key={warning}>⚠️ {warning}</div>)}
            </section>

            <section className="travel-card">
              <div className="travel-card__eyebrow">Fuentes oficiales</div>
              {guide.sources.map((source) => <a className="travel-source" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
