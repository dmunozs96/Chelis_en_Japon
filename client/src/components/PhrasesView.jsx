import React, { useMemo, useState } from 'react';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';
import Icon from './ui/Icon.jsx';

const PHRASE_STYLES = `
.phrase-categories { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 3px; scrollbar-width: none; }
.phrase-categories::-webkit-scrollbar { display: none; }
.phrase-chip { flex: 0 0 auto; padding: 8px 3px; border: 0; border-bottom: 1px solid transparent; border-radius: 0; background: transparent; color: var(--stone-500); font: 600 13px var(--font); }
.phrase-chip--active { background: transparent; border-color: var(--torii-500); color: var(--paper-100); }
.phrase-card { cursor: pointer; -webkit-tap-highlight-color: transparent; }
.phrase-card__es { color: var(--label-secondary); font-size: 14px; }
.phrase-card__ja { margin-top: 8px; color: var(--paper-100); font-family:var(--font-display); font-size: 29px; font-weight: 600; line-height: 1.3; }
.phrase-card__reading { margin-top: 5px; color: var(--accent); font-size: 15px; font-weight: 700; }
.phrase-card__hint { margin-top: 9px; color: var(--label-tertiary); font-size: 11px; }
`;

export default function PhrasesView({ onBack }) {
  const { data, loading, error } = useTravelToolsData();
  const [category, setCategory] = useState('courtesy');
  const [largePhrase, setLargePhrase] = useState(null);
  const phrases = data?.phrases;
  const visible = useMemo(() => phrases?.items.filter((item) => item.category === category) ?? [], [phrases, category]);

  return (
    <>
      <style>{TRAVEL_TOOL_STYLES}{PHRASE_STYLES}</style>
      <div className="travel-tool" role="main" aria-label="Frases japonesas">
        <nav className="travel-tool__nav">
          <button className="travel-tool__back" onClick={onBack}><Icon name="back" size={20}/> Volver</button>
          <div className="travel-tool__title">Frases japonesas</div>
        </nav>
        {loading && <div className="travel-loading">Cargando frases…</div>}
        {error && <div className="travel-loading">No se pudieron cargar las frases: {error}</div>}
        {phrases && (
          <div className="travel-tool__body">
            <div className="travel-tool__intro">La lectura está aproximada para hispanohablantes. Toca una frase para enseñarla en grande.</div>
            <div className="phrase-categories" role="tablist" aria-label="Categorías">
              {phrases.categories.map((item) => (
                <button key={item.id} className={`phrase-chip${category === item.id ? ' phrase-chip--active' : ''}`} onClick={() => { setCategory(item.id); setLargePhrase(null); }} role="tab" aria-selected={category === item.id}>
                  {item.label}
                </button>
              ))}
            </div>

            {largePhrase && (
              <section className="travel-card" style={{ textAlign: 'center', padding: '28px 16px', borderColor: 'var(--accent)' }} role="status">
                <div className="phrase-card__es">{largePhrase.es}</div>
                <div className="phrase-card__ja" style={{ fontSize: 38 }}>{largePhrase.ja}</div>
                <div className="phrase-card__reading">{largePhrase.reading}</div>
                <button className="travel-call travel-call--secondary" style={{ width: '100%', border: 0, justifyContent: 'center' }} onClick={() => setLargePhrase(null)}>Cerrar</button>
              </section>
            )}

            {!largePhrase && visible.map((phrase) => (
              <section className="travel-card phrase-card" key={phrase.ja} onClick={() => setLargePhrase(phrase)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setLargePhrase(phrase); }}>
                <div className="phrase-card__es">{phrase.es}</div>
                <div className="phrase-card__ja" lang="ja">{phrase.ja}</div>
                <div className="phrase-card__reading">{phrase.reading}</div>
                <div className="phrase-card__hint">Tocar para mostrar</div>
              </section>
            ))}

            {!largePhrase && <section className="travel-card"><div className="travel-card__eyebrow">Fuentes institucionales</div>{phrases.sources.map((source) => <a className="travel-source" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</section>}
          </div>
        )}
      </div>
    </>
  );
}
