import React, { useState, useMemo, useEffect } from 'react';
import { useRestaurantsData, distanceKm } from '../hooks/useRestaurantsData.js';

/* ---------------------------------------------------------------
   RestaurantsView
   Sugeridor espontáneo offline (F8b): lista filtrable de la
   restaurantes curados, ordenable por distancia si el navegador
   comparte ubicación. Cada tarjeta se expande para ver el detalle
   completo con justificación (why_special / good_for).
   --------------------------------------------------------------- */

const STYLES = `
.rest-view {
  padding: var(--page-padding);
  padding-top: 16px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rest-planner-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-card);
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  width: 100%;
}

.rest-filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rest-filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.rest-filter-row::-webkit-scrollbar { display: none; }

.rest-filter-label {
  font-size: 11px;
  color: var(--label-secondary);
  font-weight: 700;
  letter-spacing: .45px;
  text-transform: uppercase;
  margin: 2px 2px -3px;
}

.rest-chip {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: var(--radius-chip);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  background: var(--bg-surface);
  color: var(--label-secondary);
  border: 1.5px solid var(--glass-border);
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.rest-chip--active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.rest-count {
  font-size: 13px;
  color: var(--label-secondary);
  padding: 0 2px;
}
.rest-count strong { color: var(--label-primary); }
.rest-reset { margin-left: 8px; padding: 0; border: 0; background: none; color: var(--accent); font: 600 12px var(--font); cursor: pointer; }

.rest-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-card);
}

.rest-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  padding: 16px;
  cursor: pointer;
}

.rest-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.rest-card__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--label-primary);
  line-height: 1.3;
}

.rest-card__meta {
  font-size: 13px;
  color: var(--label-secondary);
  margin-top: 3px;
}

.rest-card__price {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
  white-space: nowrap;
}

.rest-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.rest-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--radius-chip);
  background: var(--accent-soft);
  color: var(--accent);
}

.rest-card__body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--separator);
  font-size: 14px;
  color: var(--label-primary);
  line-height: 1.55;
}

.rest-card__why {
  font-weight: 500;
  margin-bottom: 10px;
}
.rest-card__order { margin-top: 14px; }
.rest-card__order-title { color: var(--label-primary); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .45px; }
.rest-card__dish { margin-top: 8px; padding: 10px; border-radius: 10px; background: var(--bg-secondary); }
.rest-card__dish strong { display: block; color: var(--label-primary); font-size: 14px; }
.rest-card__dish span { display: block; margin-top: 3px; color: var(--label-secondary); font-size: 12px; line-height: 1.4; }

.rest-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.rest-info-item__label {
  font-size: 11px;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.rest-info-item__value {
  font-size: 14px;
  color: var(--label-primary);
  font-weight: 500;
}

.rest-card__link {
  display: inline-block;
  margin-top: 4px;
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.rest-empty {
  font-size: 15px;
  color: var(--label-secondary);
  text-align: center;
  padding: 40px 0;
}

.rest-loading {
  font-size: 15px;
  color: var(--label-secondary);
  text-align: center;
  padding: 40px 0;
}

/* ---- V2.5 editorial discovery ---- */
.rest-view { gap: 0; padding-top: 24px; }
.rest-header { padding-bottom: 24px; }
.rest-header__eyebrow { color:var(--torii-500); font-size:10px; font-weight:750; letter-spacing:.14em; text-transform:uppercase; }
.rest-header h1 { margin-top:7px; font-size:38px; letter-spacing:-.05em; }
.rest-header p { max-width:36ch; margin-top:9px; color:var(--stone-500); font-size:14px; line-height:1.5; }
.rest-planner-btn {
  margin-bottom: 24px;
  padding: 13px 0;
  border: 0;
  border-block: 1px solid var(--separator);
  border-radius: 0;
  background: transparent;
  color: var(--paper-100);
}
.rest-filter-primary {
  display:grid;
  grid-template-columns:1fr 1fr auto;
  gap:8px;
  padding-bottom:12px;
}
.rest-filter-primary > details { display:contents; }
.rest-select,
.rest-filter-more {
  min-width:0;
  min-height:40px;
  padding:8px 10px;
  border:1px solid var(--separator);
  border-radius:var(--radius-chip);
  background:var(--ink-900);
  color:var(--paper-100);
  font:600 12px var(--font);
}
.rest-filter-more { display:flex; align-items:center; cursor:pointer; list-style:none; }
.rest-filter-more::-webkit-details-marker { display:none; }
.rest-advanced { grid-column:1/-1; padding:12px 0 16px; border-top:1px solid var(--separator); }
.rest-advanced .rest-filter-label { margin:10px 0 7px; }
.rest-count { padding:14px 0 18px; border-top:1px solid var(--separator); }
.rest-list { gap:0; border-top:1px solid var(--separator); }
.rest-card {
  padding:18px 0;
  border:0;
  border-bottom:1px solid var(--separator);
  border-radius:0;
  background:transparent;
  box-shadow:none;
}
.rest-card__name { font-family:var(--font-display); font-size:19px; font-weight:600; }
.rest-card__price { color:var(--paper-300); font-size:11px; }
.rest-card__tags { margin-top:8px; }
.rest-tag { padding:0; background:transparent; color:var(--stone-500); font-size:10px; letter-spacing:.05em; text-transform:uppercase; }
.rest-tag + .rest-tag::before { margin-right:6px; content:"/"; color:var(--stone-700); }
.rest-card__body { margin-top:16px; padding-top:16px; color:var(--paper-300); }
.rest-card__dish { padding:10px 0; border-bottom:1px solid var(--separator); border-radius:0; background:transparent; }
.rest-michelin { margin-left:6px; color:var(--paper-300); font-size:10px; font-weight:750; letter-spacing:.08em; text-transform:uppercase; }
@media (max-width:350px) {
  .rest-filter-primary { grid-template-columns:1fr 1fr; }
  .rest-filter-more { grid-column:1/-1; justify-content:center; }
}
`;

const CITY_OPTIONS = ['Todas', 'Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Hakone'];
const CITY_LABELS_ES = { Tokyo: 'Tokio', Kyoto: 'Kioto', Osaka: 'Osaka', Hiroshima: 'Hiroshima', Hakone: 'Hakone' };
const PRICE_TIER_LABELS = {
  1: 'Hasta ¥1.500',
  2: '¥1.500–4.000',
  3: '¥4.000–8.000',
  4: '¥8.000–20.000',
  5: 'Más de ¥20.000',
};
const CUISINE_FILTERS = [
  { id: 'sushi', label: 'Sushi', tags: ['sushi', 'kaiten_zushi', 'tachigui_zushi', 'omakase', 'kaisendon'] },
  { id: 'ramen', label: 'Ramen y fideos', tags: ['ramen', 'soba', 'udon', 'hiroshima_tsukemen'] },
  { id: 'izakaya', label: 'Izakaya', tags: ['izakaya', 'yakitori', 'kushiyaki'] },
  { id: 'meat', label: 'Carne', tags: ['yakiniku', 'tonkatsu', 'shabu_shabu', 'pork', 'beef'] },
  { id: 'local', label: 'Especialidad local', tags: ['osaka_specialty', 'hiroshima_specialty', 'local_specialty', 'kyoto_cuisine', 'tokyo_specialty', 'okonomiyaki', 'takoyaki'] },
  { id: 'quick', label: 'Sobre la marcha', goodFor: ['sobre_la_marcha', 'quick_bite', 'quick_meal', 'street_food', 'takeaway', 'takeout'] },
  { id: 'special', label: 'Cena especial', goodFor: ['special_occasion'] },
  { id: 'dessert', label: 'Café y dulce', tags: ['wagashi', 'matcha', 'dessert', 'cafe', 'kissaten', 'taiyaki'] },
];

export default function RestaurantsView({ onOpenPlanner }) {
  const { restaurants, loading, error } = useRestaurantsData();
  const [city, setCity] = useState('Todas');
  const [priceTiers, setPriceTiers] = useState([]);
  const [noReservation, setNoReservation] = useState(false);
  const [cuisine, setCuisine] = useState(null);
  const [lateNight, setLateNight] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { timeout: 5000 }
    );
  }, []);

  function togglePriceTier(tier) {
    setPriceTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]));
  }

  const filtered = useMemo(() => {
    let list = restaurants;
    if (city !== 'Todas') list = list.filter((r) => r.city === city);
    if (priceTiers.length > 0) list = list.filter((r) => priceTiers.includes(r.price_tier));
    if (noReservation) list = list.filter((r) => r.reservation_required === false);
    if (cuisine) {
      const filter = CUISINE_FILTERS.find((item) => item.id === cuisine);
      list = list.filter((r) =>
        (filter?.tags ?? []).some((tag) => (r.cuisine_tags ?? []).includes(tag))
        || (filter?.goodFor ?? []).some((tag) => (r.good_for ?? []).includes(tag))
      );
    }
    if (lateNight) list = list.filter((r) => (r.good_for ?? []).includes('late_night') || /23:|24:|medianoche/i.test(r.hours ?? ''));

    const withDistance = list.map((r) => ({
      ...r,
      _distanceKm: coords && (r.verified_fields ?? []).includes('location')
        ? distanceKm(coords[0], coords[1], r.lat, r.lng)
        : null,
    }));

    if (coords) {
      withDistance.sort((a, b) => (a._distanceKm ?? Infinity) - (b._distanceKm ?? Infinity));
    } else {
      withDistance.sort((a, b) => a.name.localeCompare(b.name));
    }
    return withDistance;
  }, [restaurants, city, priceTiers, noReservation, cuisine, lateNight, coords]);

  const filtersActive = city !== 'Todas' || priceTiers.length > 0 || noReservation || cuisine || lateNight;
  function resetFilters() {
    setCity('Todas');
    setPriceTiers([]);
    setNoReservation(false);
    setCuisine(null);
    setLateNight(false);
  }

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="rest-loading">Cargando restaurantes…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="rest-loading" style={{ color: 'var(--accent)' }}>Error cargando restaurantes: {error}</div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="rest-view">
        <header className="rest-header">
          <div className="rest-header__eyebrow">Selección / {restaurants.length} lugares</div>
          <h1>Comer en Japón</h1>
          <p>Una guía curada para elegir bien, desde un bocado rápido hasta una cena especial.</p>
        </header>

        <button className="rest-planner-btn" onClick={onOpenPlanner}>
          <span>Planificador de comidas</span>
          <span>→</span>
        </button>

        <div className="rest-filters">
          <div className="rest-filter-primary">
            <select className="rest-select" value={city} onChange={(event) => setCity(event.target.value)} aria-label="Ciudad">
              {CITY_OPTIONS.map((option) => <option value={option} key={option}>{option === 'Todas' ? 'Todas las ciudades' : CITY_LABELS_ES[option]}</option>)}
            </select>
            <select className="rest-select" value={cuisine ?? ''} onChange={(event) => setCuisine(event.target.value || null)} aria-label="Tipo de cocina">
              <option value="">Cualquier cocina</option>
              {CUISINE_FILTERS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
            </select>
            <details>
              <summary className="rest-filter-more">Ajustes{priceTiers.length + Number(noReservation) + Number(lateNight) > 0 ? ` · ${priceTiers.length + Number(noReservation) + Number(lateNight)}` : ''}</summary>
              <div className="rest-advanced">
                <div className="rest-filter-label">Precio por persona</div>
                <div className="rest-filter-row">
                  {[1, 2, 3, 4, 5].map((tier) => (
                    <button key={tier} className={`rest-chip${priceTiers.includes(tier) ? ' rest-chip--active' : ''}`} onClick={() => togglePriceTier(tier)}>{PRICE_TIER_LABELS[tier]}</button>
                  ))}
                </div>
                <div className="rest-filter-row">
                  <button className={`rest-chip${noReservation ? ' rest-chip--active' : ''}`} onClick={() => setNoReservation((v) => !v)}>Sin reserva</button>
                  <button className={`rest-chip${lateNight ? ' rest-chip--active' : ''}`} onClick={() => setLateNight((value) => !value)}>Abierto tarde</button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className="rest-count">
          <strong>{filtered.length}</strong>{filtersActive ? ` de ${restaurants.length}` : ''} restaurante{filtered.length === 1 ? '' : 's'}
          {coords ? ' · por distancia' : ''}
          {filtersActive && <button className="rest-reset" onClick={resetFilters}>Limpiar filtros</button>}
        </div>

        <div className="rest-list">
          {filtered.map((r) => {
            const isOpen = expandedId === r.id;
            return (
              <div
                key={r.id}
                className="rest-card"
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setExpandedId(isOpen ? null : r.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="rest-card__head">
                  <div>
                    <div className="rest-card__name">
                      {r.name} {r.michelin_stars > 0 && <span className="rest-michelin">Michelin · {r.michelin_stars}</span>}
                    </div>
                    <div className="rest-card__meta">
                      {CITY_LABELS_ES[r.city] ?? r.city} · {r.neighborhood}
                      {r._distanceKm != null ? ` · ${r._distanceKm.toFixed(1)} km` : ''}
                    </div>
                  </div>
                  <div className="rest-card__price">{PRICE_TIER_LABELS[r.price_tier] ?? ''}</div>
                </div>

                <div className="rest-card__tags">
                  {(r.cuisine_tags ?? []).slice(0, 4).map((t) => (
                    <span className="rest-tag" key={t}>{t.replace(/_/g, ' ')}</span>
                  ))}
                </div>

                {isOpen && (
                  <div className="rest-card__body">
                    {r.why_special && <div className="rest-card__why">{r.why_special}</div>}
                    {r.what_to_order?.length > 0 && <div className="rest-card__order"><div className="rest-card__order-title">Qué pedir</div>{r.what_to_order.map((item) => <div className="rest-card__dish" key={item.dish}><strong>{item.dish}</strong><span>{item.why}</span></div>)}</div>}
                    <div className="rest-info-grid">
                      <div>
                        <div className="rest-info-item__label">Precio</div>
                        <div className="rest-info-item__value">{r.price_per_person_yen ?? '—'}</div>
                      </div>
                      <div>
                        <div className="rest-info-item__label">Horario</div>
                        <div className="rest-info-item__value">{r.hours ?? '—'}</div>
                      </div>
                      <div>
                        <div className="rest-info-item__label">Reserva</div>
                        <div className="rest-info-item__value">
                          {r.reservation_required === false
                            ? 'No necesaria'
                            : r.reservation_required === 'recommended'
                              ? 'Recomendada'
                              : r.reservation_required === true
                                ? 'Obligatoria'
                                : 'Pendiente de confirmar'}
                        </div>
                      </div>
                      <div>
                        <div className="rest-info-item__label">Cerrado</div>
                        <div className="rest-info-item__value">{r.closed_days?.length ? r.closed_days.join(', ') : 'Ningún día'}</div>
                      </div>
                    </div>
                    {r.phone && <div>Tel. {r.phone}</div>}
                    {r.reservation_url && (
                      <a className="rest-card__link" href={r.reservation_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        Reservar online →
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rest-empty">Ningún restaurante coincide con estos filtros.</div>
          )}
        </div>
      </div>
    </>
  );
}
