import React, { useState, useMemo, useEffect } from 'react';
import { useRestaurantsData, distanceKm } from '../hooks/useRestaurantsData.js';

/* ---------------------------------------------------------------
   RestaurantsView
   Sugeridor espontáneo offline (F8b): lista filtrable de los 32
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
`;

const CITY_OPTIONS = ['Todas', 'Tokyo', 'Kyoto', 'Osaka', 'Hiroshima'];
const CITY_LABELS_ES = { Tokyo: 'Tokio', Kyoto: 'Kioto', Osaka: 'Osaka', Hiroshima: 'Hiroshima' };
const PRICE_TIER_LABELS = { 1: '¥', 2: '¥¥', 3: '¥¥¥', 4: '¥¥¥¥' };

export default function RestaurantsView({ onOpenPlanner }) {
  const { restaurants, loading, error } = useRestaurantsData();
  const [city, setCity] = useState('Todas');
  const [priceTiers, setPriceTiers] = useState([]);
  const [noReservation, setNoReservation] = useState(false);
  const [occasion, setOccasion] = useState(null);
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

  const occasionOptions = useMemo(() => {
    const set = new Set();
    restaurants.forEach((r) => (r.good_for ?? []).forEach((g) => set.add(g)));
    return [...set].sort();
  }, [restaurants]);

  function togglePriceTier(tier) {
    setPriceTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]));
  }

  const filtered = useMemo(() => {
    let list = restaurants;
    if (city !== 'Todas') list = list.filter((r) => r.city === city);
    if (priceTiers.length > 0) list = list.filter((r) => priceTiers.includes(r.price_tier));
    if (noReservation) list = list.filter((r) => r.reservation_required === false);
    if (occasion) list = list.filter((r) => (r.good_for ?? []).includes(occasion));

    const withDistance = list.map((r) => ({
      ...r,
      _distanceKm: coords ? distanceKm(coords[0], coords[1], r.lat, r.lng) : null,
    }));

    if (coords) {
      withDistance.sort((a, b) => (a._distanceKm ?? Infinity) - (b._distanceKm ?? Infinity));
    } else {
      withDistance.sort((a, b) => a.name.localeCompare(b.name));
    }
    return withDistance;
  }, [restaurants, city, priceTiers, noReservation, occasion, coords]);

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
        <button className="rest-planner-btn" onClick={onOpenPlanner}>
          <span>📅 Planificador de comidas</span>
          <span>→</span>
        </button>

        <div className="rest-filters">
          <div className="rest-filter-row">
            {CITY_OPTIONS.map((c) => (
              <button
                key={c}
                className={`rest-chip${city === c ? ' rest-chip--active' : ''}`}
                onClick={() => setCity(c)}
              >
                {c === 'Todas' ? 'Todas' : CITY_LABELS_ES[c]}
              </button>
            ))}
          </div>
          <div className="rest-filter-row">
            {[1, 2, 3, 4].map((tier) => (
              <button
                key={tier}
                className={`rest-chip${priceTiers.includes(tier) ? ' rest-chip--active' : ''}`}
                onClick={() => togglePriceTier(tier)}
              >
                {PRICE_TIER_LABELS[tier]}
              </button>
            ))}
            <button
              className={`rest-chip${noReservation ? ' rest-chip--active' : ''}`}
              onClick={() => setNoReservation((v) => !v)}
            >
              Sin reserva
            </button>
          </div>
          {occasionOptions.length > 0 && (
            <div className="rest-filter-row">
              {occasionOptions.map((o) => (
                <button
                  key={o}
                  className={`rest-chip${occasion === o ? ' rest-chip--active' : ''}`}
                  onClick={() => setOccasion((v) => (v === o ? null : o))}
                >
                  {o.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rest-count">{filtered.length} restaurante{filtered.length === 1 ? '' : 's'}{coords ? ' · ordenados por distancia' : ''}</div>

        <div className="rest-list">
          {filtered.map((r) => {
            const isOpen = expandedId === r.id;
            return (
              <div
                key={r.id}
                className="rest-card"
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="rest-card__head">
                  <div>
                    <div className="rest-card__name">
                      {r.name} {r.michelin_stars > 0 && '⭐'.repeat(r.michelin_stars)}
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
                          {r.reservation_required === false ? 'No necesaria' : r.reservation_required === 'recommended' ? 'Recomendada' : 'Obligatoria'}
                        </div>
                      </div>
                      <div>
                        <div className="rest-info-item__label">Cerrado</div>
                        <div className="rest-info-item__value">{r.closed_days?.length ? r.closed_days.join(', ') : 'Ningún día'}</div>
                      </div>
                    </div>
                    {r.phone && <div>📞 {r.phone}</div>}
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
