import React, { useState, useEffect, useRef } from 'react';

/* ---------------------------------------------------------------
   POIDetailView
   Pantalla push de detalle de un punto de interés. Overlay fijo
   sobre toda la app (igual patrón que MapView / TicketsView).
   --------------------------------------------------------------- */

const STYLES = `
.poi-view {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  overflow-y: auto;
}

.poi-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 56px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
}

.poi-nav__back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--accent);
  font-size: 17px;
  font-family: var(--font);
  cursor: pointer;
  padding: 8px 0;
  -webkit-tap-highlight-color: transparent;
}

.poi-nav__map-btn {
  background: var(--bg-surface-2);
  color: var(--label-primary);
  border: none;
  border-radius: var(--radius-btn);
  padding: 8px 14px;
  font-size: 14px;
  font-family: var(--font);
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* ---- Hero ---- */
.poi-hero {
  position: relative;
  width: 100%;
  height: 220px;
  flex-shrink: 0;
  background: var(--bg-surface);
  overflow: hidden;
}

.poi-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.poi-hero__fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, var(--bg-surface-2), var(--bg-secondary));
  color: var(--label-tertiary);
}

.poi-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,8,20,0) 40%, rgba(8,8,20,0.92) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px 20px;
}

.poi-hero__name-ja {
  font-size: 14px;
  color: var(--label-secondary);
  margin-bottom: 2px;
}

.poi-hero__name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--label-primary);
  line-height: 1.1;
  margin-bottom: 8px;
}

.poi-chip-category {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-chip);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  background: var(--accent-soft);
  color: var(--accent);
  width: fit-content;
}

/* ---- Body ---- */
.poi-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--gap-card);
}

.poi-section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.poi-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  padding: 20px;
}

.poi-significance {
  background: var(--accent-soft);
  border-radius: var(--radius-card);
  padding: 16px 18px;
  font-size: 15px;
  font-weight: 500;
  color: var(--label-primary);
  line-height: 1.5;
  border: 1px solid var(--glass-border);
}

.poi-description p {
  font-size: 15px;
  color: var(--label-primary);
  line-height: 1.6;
  margin-bottom: 12px;
}
.poi-description p:last-child { margin-bottom: 0; }

/* ---- Grid info práctica ---- */
.poi-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.poi-info-item__label {
  font-size: 12px;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.poi-info-item__value {
  font-size: 15px;
  color: var(--label-primary);
  font-weight: 500;
  line-height: 1.4;
}

/* ---- Listas (tips, restricciones) ---- */
.poi-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.poi-list-item {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: var(--label-primary);
  line-height: 1.45;
}

.poi-list-item__bullet {
  flex-shrink: 0;
  color: var(--accent);
  font-weight: 700;
}

.poi-note {
  font-size: 13px;
  color: var(--label-secondary);
  margin-top: 10px;
  line-height: 1.4;
}

.poi-website-btn {
  display: block;
  width: 100%;
  text-align: center;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-btn);
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.poi-source {
  font-size: 12px;
  color: var(--label-tertiary);
  text-align: center;
  padding: 4px 0 12px;
}

.poi-not-found {
  padding: var(--page-padding);
  color: var(--label-secondary);
  font-size: 15px;
  text-align: center;
  margin-top: 40px;
}
`;

const CATEGORY_LABELS = {
  temple: 'Templo',
  shrine: 'Santuario',
  park: 'Parque',
  neighborhood: 'Barrio',
  market: 'Mercado',
  museum: 'Museo',
  viewpoint: 'Mirador',
  memorial: 'Memorial',
  garden: 'Jardín',
  castle: 'Castillo',
  transit: 'Transporte',
};

function CategoryFallbackIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

// El JSON de fallbacks se pide una sola vez por sesión, y solo si alguna
// imagen local llega a fallar.
let fallbackUrlsPromise = null;
function getFallbackUrls() {
  if (!fallbackUrlsPromise) {
    fallbackUrlsPromise = fetch('/pois/fallback-urls.json')
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}));
  }
  return fallbackUrlsPromise;
}

function ImageWithFallback({ imageUrl, poiId, altText }) {
  const [source, setSource] = useState(imageUrl);
  const [failed, setFailed] = useState(false);
  const triedFallback = useRef(false);

  // Resetear estado si el componente se reutiliza para otro POI.
  useEffect(() => {
    setSource(imageUrl);
    setFailed(false);
    triedFallback.current = false;
  }, [imageUrl, poiId]);

  const handleError = async () => {
    if (!triedFallback.current) {
      triedFallback.current = true;
      const urls = await getFallbackUrls();
      const remote = urls[poiId];
      if (remote && remote !== imageUrl) {
        setSource(remote);
        return;
      }
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div className="poi-hero__fallback">
        <CategoryFallbackIcon />
      </div>
    );
  }

  return (
    <img
      className="poi-hero__img"
      src={source}
      alt={altText}
      onError={handleError}
    />
  );
}

export default function POIDetailView({ poi, onBack, onOpenMap }) {
  if (!poi) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="poi-view">
          <nav className="poi-nav">
            <button className="poi-nav__back" onClick={onBack} aria-label="Volver">
              <svg width="10" height="17" viewBox="0 0 10 17" fill="none" aria-hidden="true">
                <path d="M9 1L1.5 8.5L9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Volver
            </button>
          </nav>
          <p className="poi-not-found">No hay información disponible para este lugar.</p>
        </div>
      </>
    );
  }

  const categoryLabel = CATEGORY_LABELS[poi.category] ?? poi.category;
  const descriptionParagraphs = (poi.description ?? '').split('\n\n').filter(Boolean);
  const hasCoords = poi.lat != null && poi.lng != null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="poi-view" role="main" aria-label={`Detalle de ${poi.name}`}>
        <nav className="poi-nav">
          <button className="poi-nav__back" onClick={onBack} aria-label="Volver">
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none" aria-hidden="true">
              <path d="M9 1L1.5 8.5L9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver
          </button>
          {hasCoords && onOpenMap && (
            <button className="poi-nav__map-btn" onClick={() => onOpenMap(poi)}>
              📍 Ver mapa
            </button>
          )}
        </nav>

        {/* Hero */}
        <div className="poi-hero">
          {poi.image_url ? (
            <ImageWithFallback imageUrl={poi.image_url} poiId={poi.id} altText={poi.name} />
          ) : (
            <div className="poi-hero__fallback">
              <CategoryFallbackIcon />
            </div>
          )}
          <div className="poi-hero__overlay">
            {poi.name_ja && <div className="poi-hero__name-ja">{poi.name_ja}{poi.name_ja_reading ? ` · ${poi.name_ja_reading}` : ''}</div>}
            <h1 className="poi-hero__name">{poi.name}</h1>
            <span className="poi-chip-category">{categoryLabel}</span>
          </div>
        </div>

        <div className="poi-body">
          {/* Significance */}
          {poi.significance && (
            <div className="poi-significance">{poi.significance}</div>
          )}

          {/* Descripción cultural */}
          {descriptionParagraphs.length > 0 && (
            <div className="poi-card">
              <div className="poi-section-label">Contexto</div>
              <div className="poi-description">
                {descriptionParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          )}

          {/* Info práctica */}
          <div className="poi-card">
            <div className="poi-section-label">Info práctica</div>
            <div className="poi-info-grid">
              <div>
                <div className="poi-info-item__label">Horario</div>
                <div className="poi-info-item__value">{poi.opening_hours?.grounds ?? poi.opening_hours?.main_hall ?? '—'}</div>
              </div>
              <div>
                <div className="poi-info-item__label">Precio</div>
                <div className="poi-info-item__value">
                  {poi.price?.free ? 'Gratis' : (poi.price?.adult ?? 'Consultar')}
                </div>
              </div>
              <div>
                <div className="poi-info-item__label">Duración</div>
                <div className="poi-info-item__value">{poi.duration_suggested ?? '—'}</div>
              </div>
              <div>
                <div className="poi-info-item__label">Acceso</div>
                <div className="poi-info-item__value">
                  {poi.access?.metro ?? '—'}
                  {poi.access?.walk_minutes ? ` · ${poi.access.walk_minutes} min a pie` : ''}
                </div>
              </div>
            </div>
            {poi.opening_hours?.notes && <div className="poi-note">{poi.opening_hours.notes}</div>}
            {poi.closed_days?.length > 0 && (
              <div className="poi-note">Cerrado: {poi.closed_days.join(', ')}</div>
            )}
            {poi.access?.notes && <div className="poi-note">{poi.access.notes}</div>}
          </div>

          {/* Restricciones */}
          {poi.restrictions?.length > 0 && (
            <div className="poi-card">
              <div className="poi-section-label">Restricciones</div>
              <div className="poi-list">
                {poi.restrictions.map((r, i) => (
                  <div className="poi-list-item" key={i}>
                    <span className="poi-list-item__bullet">·</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consejos */}
          {poi.tips?.length > 0 && (
            <div className="poi-card">
              <div className="poi-section-label">Consejos prácticos</div>
              <div className="poi-list">
                {poi.tips.map((t, i) => (
                  <div className="poi-list-item" key={i}>
                    <span className="poi-list-item__bullet">✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              {poi.best_time && <div className="poi-note">Mejor momento: {poi.best_time}</div>}
            </div>
          )}

          {/* Website */}
          {poi.website && (
            <a className="poi-website-btn" href={poi.website} target="_blank" rel="noopener noreferrer">
              Abrir website oficial
            </a>
          )}

          {poi.source && <div className="poi-source">Fuente: {poi.source}</div>}
        </div>
      </div>
    </>
  );
}
