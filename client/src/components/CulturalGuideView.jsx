import React, { useMemo, useState } from 'react';
import { useCulturalGuideData } from '../hooks/useCulturalGuideData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';

const STYLES = `
.culture-filters{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}.culture-filter{flex:none;border:1px solid var(--glass-border);border-radius:999px;padding:7px 11px;background:var(--bg-surface);color:var(--label-secondary);font:12px var(--font)}.culture-filter--active{border-color:var(--accent);color:#fff;background:var(--accent)}
.culture-card summary{display:flex;align-items:center;gap:12px;cursor:pointer;list-style:none}.culture-card summary::-webkit-details-marker{display:none}.culture-card__icon{font-size:28px}.culture-card__heading{flex:1}.culture-card__category{display:block;color:var(--accent);font-size:11px;font-weight:700;text-transform:uppercase}.culture-card__title{display:block;margin-top:2px;color:var(--label-primary);font-size:17px;font-weight:700}.culture-card__arrow{color:var(--accent);font-size:20px}.culture-card[open] .culture-card__arrow{transform:rotate(90deg)}
.culture-section{margin-top:14px}.culture-section h3{color:var(--label-primary);font-size:12px;text-transform:uppercase;letter-spacing:.5px}.culture-section p,.culture-section ul{margin-top:5px;color:var(--label-secondary);font-size:13px;line-height:1.5}.culture-section ul{padding-left:19px}.culture-section--avoid{padding:10px;border-radius:10px;background:rgba(232,0,45,.12)}.culture-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}.culture-tag{padding:5px 8px;border-radius:7px;background:var(--bg-secondary);color:var(--label-secondary);font-size:11px}.culture-source+.culture-source{margin-left:12px}
`;

export default function CulturalGuideView({ onBack }) {
  const { topics, sources, lastVerifiedAt, loading, error } = useCulturalGuideData();
  const [category, setCategory] = useState('Todas');
  const categories = useMemo(() => ['Todas', ...new Set(topics.map((topic) => topic.category))], [topics]);
  const sourceById = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);
  const visible = topics.filter((topic) => category === 'Todas' || topic.category === category);
  return <div className="travel-tool"><style>{TRAVEL_TOOL_STYLES}{STYLES}</style><nav className="travel-tool__nav"><button className="travel-tool__back" onClick={onBack}>‹ Volver</button><h1 className="travel-tool__title">Guía cultural</h1></nav><main className="travel-tool__body">
    <p className="travel-tool__intro">Contexto aplicado a este itinerario: qué mirar, cómo actuar y qué error evitar. Verificado {lastVerifiedAt ?? '—'}.</p>
    {loading && <div className="travel-loading">Cargando guía…</div>}{error && <div className="travel-warning">No se pudo cargar: {error}</div>}
    <div className="culture-filters">{categories.map((item) => <button key={item} className={`culture-filter ${category === item ? 'culture-filter--active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
    {visible.map((topic) => <details className="travel-card culture-card" key={topic.id}><summary><span className="culture-card__icon">{topic.icon}</span><span className="culture-card__heading"><span className="culture-card__category">{topic.category}</span><span className="culture-card__title">{topic.title}</span></span><span className="culture-card__arrow">›</span></summary>
      <section className="culture-section"><h3>Qué es</h3><p>{topic.what}</p></section><section className="culture-section"><h3>Por qué importa</h3><p>{topic.why}</p></section><section className="culture-section"><h3>Qué observar</h3><ul>{topic.observe.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="culture-section"><h3>Cómo comportarse</h3><ul>{topic.behave.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="culture-section culture-section--avoid"><h3>Error que evitar</h3><p>{topic.avoid}</p></section><section className="culture-section"><h3>Útil en</h3><div className="culture-tags">{topic.useful_on.map((item) => <span className="culture-tag" key={item}>{item}</span>)}</div></section><section className="culture-section"><h3>Fuentes</h3>{topic.source_ids.map((id) => { const source = sourceById.get(id); return source && <a className="travel-source culture-source" key={id} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>; })}</section>
    </details>)}
  </main></div>;
}
