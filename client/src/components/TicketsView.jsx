import React, { useState, useCallback } from 'react';
import { useTripData } from '../hooks/useTripData.js';
import Icon from './ui/Icon.jsx';

/* ---------------------------------------------------------------
   TicketsView
   Pantalla completa con scroll que muestra tres secciones:
   Vuelos, Hoteles y Trenes. Se presenta como pantalla push.
   --------------------------------------------------------------- */

const STYLES = `
.tickets-view {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
}

.tickets-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  min-height: 56px;
}

.tickets-back {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-family: var(--font);
  font-size: 17px;
  color: var(--accent);
  cursor: pointer;
  padding: 6px 4px;
  -webkit-tap-highlight-color: transparent;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-btn);
}

.tickets-back:active {
  opacity: 0.6;
}

.tickets-nav-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  flex: 1;
  text-align: center;
}

.tickets-nav-spacer {
  min-width: 44px;
}

.tickets-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px var(--page-padding) calc(40px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Section headers */
.tickets-section-header {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--label-secondary);
  text-transform: uppercase;
  padding: 0 4px 8px 4px;
}

.tickets-cards {
  display: flex;
  flex-direction: column;
  gap: var(--gap-card);
}

/* ---- Flight card ---- */
.flight-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.flight-card__header {
  background: var(--bg-secondary);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flight-card__airline {
  font-size: 13px;
  font-weight: 600;
  color: var(--label-secondary);
  letter-spacing: 0.3px;
}

.flight-card__number {
  font-size: 20px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: 1px;
}

.flight-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.flight-route {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flight-route__airport {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.flight-route__code {
  font-size: 28px;
  font-weight: 700;
  color: var(--label-primary);
  line-height: 1;
}

.flight-route__terminal {
  font-size: 12px;
  color: var(--label-secondary);
  font-weight: 500;
  margin-top: 2px;
}

.flight-route__time {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  margin-top: 4px;
}

.flight-route__date-label {
  font-size: 12px;
  color: var(--label-secondary);
  margin-top: 1px;
}

.flight-route__arrow {
  flex: 0 0 auto;
  color: var(--label-tertiary);
  font-size: 20px;
  font-weight: 300;
}

.flight-separator {
  height: 1px;
  background: var(--separator);
}

.flight-refs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flight-ref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.flight-ref-label {
  font-size: 13px;
  color: var(--label-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.flight-ref-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: 1.5px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s var(--ease);
  text-align: right;
}

.flight-ref-value:active {
  background: var(--accent-soft);
}

.flight-ref-value--copied {
  color: #34C759;
  background: rgba(52,199,89,0.1);
}

.flight-fare-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-chip);
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-secondary);
  color: var(--label-secondary);
  letter-spacing: 0.2px;
  align-self: flex-start;
}

/* ---- Hotel card ---- */
.hotel-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hotel-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.hotel-card__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--label-primary);
  line-height: 1.3;
  flex: 1;
}

.hotel-card__city {
  font-size: 13px;
  color: var(--label-secondary);
  font-weight: 500;
  margin-top: 2px;
}

.hotel-active-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-chip);
  font-size: 12px;
  font-weight: 600;
  background: var(--accent-soft);
  color: var(--accent);
  white-space: nowrap;
  flex-shrink: 0;
}

.hotel-address {
  font-size: 14px;
  color: var(--label-secondary);
  line-height: 1.4;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  padding: 4px 0;
  transition: color 0.15s var(--ease);
}

.hotel-address:active {
  color: var(--accent);
}

.hotel-separator {
  height: 1px;
  background: var(--separator);
}

.hotel-dates {
  display: flex;
  gap: 0;
}

.hotel-dates__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hotel-dates__item + .hotel-dates__item {
  border-left: 1px solid var(--separator);
  padding-left: 12px;
}

.hotel-dates__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.hotel-dates__value {
  font-size: 16px;
  font-weight: 700;
  color: var(--label-primary);
}

.hotel-dates__time {
  font-size: 13px;
  color: var(--label-secondary);
  font-weight: 500;
}

.hotel-locator-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hotel-locator-label {
  font-size: 13px;
  color: var(--label-secondary);
  font-weight: 500;
}

.hotel-locator-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: 1px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s var(--ease);
}

.hotel-locator-value:active {
  background: var(--accent-soft);
}

.hotel-locator-value--copied {
  color: #34C759;
  background: rgba(52,199,89,0.1);
}

.hotel-phone {
  font-size: 14px;
  color: var(--accent);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.hotel-notes {
  font-size: 13px;
  color: var(--label-secondary);
  line-height: 1.5;
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 10px 12px;
}

/* ---- Train card ---- */
.train-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.train-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.train-route {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.train-route__line {
  font-size: 17px;
  font-weight: 700;
  color: var(--label-primary);
  line-height: 1.2;
}

.train-route__arrow {
  color: var(--accent);
}

.train-route__meta {
  font-size: 13px;
  color: var(--label-secondary);
  font-weight: 500;
}

.train-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-chip);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.train-status-chip--pending {
  background: rgba(255,149,0,0.12);
  color: #FF9500;
}

.train-status-chip--reserved {
  background: rgba(52,199,89,0.12);
  color: #34C759;
}

.train-separator {
  height: 1px;
  background: var(--separator);
}

.train-pending-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.train-window-text {
  font-size: 14px;
  font-weight: 600;
  color: #FF9500;
  line-height: 1.4;
}

.train-reserve-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--radius-btn);
  font-size: 15px;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s var(--ease);
}

.train-reserve-link:active {
  opacity: 0.8;
}

.train-reserved-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.train-reserved-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.train-reserved-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.train-reserved-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--label-primary);
}

.train-notes {
  font-size: 13px;
  color: var(--label-secondary);
  line-height: 1.5;
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 10px 12px;
}

.tickets-loading {
  font-size: 15px;
  color: var(--label-secondary);
  text-align: center;
  padding: 40px 0;
}
.tickets-view{max-width:var(--shell-max);background:var(--ink-950)}.tickets-nav{min-height:calc(56px + env(safe-area-inset-top));padding:env(safe-area-inset-top) var(--page-padding) 0;border-bottom:1px solid var(--separator);background:rgb(13 14 16 / 94%);backdrop-filter:none;-webkit-backdrop-filter:none}.tickets-back{gap:6px;color:var(--paper-100);font-size:13px;font-weight:650}.tickets-nav-title{font-family:var(--font-display);font-weight:600}
.tickets-scroll{gap:38px;padding-top:24px}.tickets-intro{padding-bottom:4px}.tickets-intro__eyebrow{color:var(--torii-500);font-size:10px;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.tickets-intro h1{margin-top:7px;font-size:38px;letter-spacing:-.05em}.tickets-intro p{margin-top:8px;color:var(--stone-500);font-size:14px}.tickets-section-header{padding:0 0 10px;color:var(--paper-300);font-size:10px;font-weight:750;letter-spacing:.13em}.tickets-cards{gap:0;border-top:1px solid var(--separator)}
.flight-card,.hotel-card,.train-card{position:relative;padding:20px 0;border:0!important;border-bottom:1px solid var(--separator)!important;border-radius:0;background:transparent;box-shadow:none}.flight-card{overflow:visible}.flight-card__header{padding:0 0 16px;background:transparent}.flight-card__body{padding:0}.flight-card__number,.flight-route__code,.hotel-card__name,.train-route__line{font-family:var(--font-display);font-weight:600}.flight-route__code{font-size:32px}.flight-ref-value,.hotel-locator-value,.train-reserved-value{font-variant-numeric:tabular-nums}.flight-fare-chip,.hotel-active-chip,.train-status-chip{padding:0;background:transparent}.hotel-active-chip,.train-status-chip--reserved{color:var(--moss-500)}.train-status-chip--pending,.train-window-text{color:var(--amber-500)}.hotel-notes,.train-notes{padding:12px 0;border-top:1px solid var(--separator);border-radius:0;background:transparent}.train-reserve-link{border:1px solid var(--paper-100);background:transparent;color:var(--paper-100)}
.ticket-document--featured{margin:0 -10px 18px;padding:22px 18px;border:1px solid rgb(167 163 155 / 40%)!important;border-radius:var(--radius-card);background:linear-gradient(145deg,var(--ink-850),var(--ink-900));box-shadow:var(--shadow-card-lg)}.ticket-document--featured::before{display:block;margin-bottom:14px;color:var(--titanium-400);font-size:9px;font-weight:750;letter-spacing:.14em;text-transform:uppercase;content:"Próximo documento"}
`;

/* ---- Utility: copy to clipboard with brief feedback ---- */
function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = useCallback((key, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
      }).catch(() => {});
    }
  }, []);
  return [copiedKey, copy];
}

/* ---- Date formatters ---- */
function fmtDateShort(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  });
}

function fmtDateLong(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'long',
  });
}

function fmtWindowDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  }) + ' (hora Japón)';
}

/* ---- Is hotel currently active? ---- */
function isHotelActive(hotel) {
  // Fecha local del dispositivo, no UTC: en Japón (UTC+9) toISOString()
  // marcaría el hotel del día anterior entre las 00:00 y las 09:00.
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return today >= hotel.dates.from && today < hotel.dates.to;
}

/* ---- FlightCard ---- */
function FlightCard({ flight, label, featured = false }) {
  const [copiedKey, copy] = useCopy();

  return (
    <div className={`flight-card${featured ? ' ticket-document--featured' : ''}`}>
      <div className="flight-card__header">
        <div>
          <div className="flight-card__airline">{flight.airline} · {label}</div>
          <div className="flight-card__number">{flight.flight}</div>
        </div>
      </div>
      <div className="flight-card__body">
        {/* Route */}
        <div className="flight-route">
          <div className="flight-route__airport">
            <div className="flight-route__code">{flight.departure.airport}</div>
            <div className="flight-route__terminal">{flight.departure.terminal}</div>
            <div className="flight-route__time">{flight.departure.time}</div>
            <div className="flight-route__date-label">{fmtDateShort(flight.date)}</div>
          </div>
          <div className="flight-route__arrow">→</div>
          <div className="flight-route__airport">
            <div className="flight-route__code">{flight.arrival.airport}</div>
            <div className="flight-route__terminal">{flight.arrival.terminal}</div>
            <div className="flight-route__time">{flight.arrival.time}</div>
            <div className="flight-route__date-label">{fmtDateShort(flight.arrival.date_arrival)}</div>
          </div>
        </div>

        <div className="flight-separator" />

        {/* Refs */}
        <div className="flight-refs">
          <div className="flight-ref-row">
            <span className="flight-ref-label">Localizador (PNR)</span>
            <span
              className={`flight-ref-value${copiedKey === 'pnr' ? ' flight-ref-value--copied' : ''}`}
              onClick={() => copy('pnr', flight.booking_ref)}
              title="Toca para copiar"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && copy('pnr', flight.booking_ref)}
              aria-label={`Localizador ${flight.booking_ref}, toca para copiar`}
              aria-live="polite"
            >
              {copiedKey === 'pnr' ? '¡Copiado!' : flight.booking_ref}
            </span>
          </div>
          <div className="flight-ref-row">
            <span className="flight-ref-label">Nº billete</span>
            <span
              className={`flight-ref-value${copiedKey === 'ticket' ? ' flight-ref-value--copied' : ''}`}
              onClick={() => copy('ticket', flight.ticket_number)}
              title="Toca para copiar"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && copy('ticket', flight.ticket_number)}
              aria-label={`Número de billete ${flight.ticket_number}, toca para copiar`}
              aria-live="polite"
            >
              {copiedKey === 'ticket' ? '¡Copiado!' : flight.ticket_number}
            </span>
          </div>
        </div>

        {flight.fare && (
          <span className="flight-fare-chip">{flight.fare}</span>
        )}
      </div>
    </div>
  );
}

/* ---- HotelCard ---- */
function HotelCard({ hotel, featured = false }) {
  const [copiedKey, copy] = useCopy();
  const active = isHotelActive(hotel);

  const openMaps = () => {
    const q = encodeURIComponent(hotel.address);
    window.open(`https://maps.google.com/?q=${q}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`hotel-card${featured ? ' ticket-document--featured' : ''}`}>
      <div className="hotel-card__header">
        <div>
          <div className="hotel-card__name">{hotel.name}</div>
          <div className="hotel-card__city">{hotel.city}</div>
        </div>
        {active && (
          <span className="hotel-active-chip">Estancia actual</span>
        )}
      </div>

      <div
        className="hotel-address"
        onClick={openMaps}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openMaps()}
        aria-label={`Dirección: ${hotel.address}. Toca para abrir en Maps`}
        title="Toca para abrir en Maps"
      >
        {hotel.address}
      </div>

      <div className="hotel-separator" />

      {/* Dates */}
      <div className="hotel-dates">
        <div className="hotel-dates__item">
          <span className="hotel-dates__label">Check-in</span>
          <span className="hotel-dates__value">{fmtDateShort(hotel.dates.from)}</span>
          <span className="hotel-dates__time">{hotel.checkin}</span>
        </div>
        <div className="hotel-dates__item">
          <span className="hotel-dates__label">Check-out</span>
          <span className="hotel-dates__value">{fmtDateShort(hotel.dates.to)}</span>
          <span className="hotel-dates__time">{hotel.checkout}</span>
        </div>
      </div>

      <div className="hotel-separator" />

      {/* CRS Locator */}
      <div className="hotel-locator-row">
        <span className="hotel-locator-label">CRS Locator</span>
        <span
          className={`hotel-locator-value${copiedKey === 'crs' ? ' hotel-locator-value--copied' : ''}`}
          onClick={() => copy('crs', hotel.crs_locator)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && copy('crs', hotel.crs_locator)}
          aria-label={`CRS Locator ${hotel.crs_locator}, toca para copiar`}
          title="Toca para copiar"
          aria-live="polite"
        >
          {copiedKey === 'crs' ? '¡Copiado!' : hotel.crs_locator}
        </span>
      </div>

      {hotel.confirmation && (
        <div className="hotel-locator-row">
          <span className="hotel-locator-label">Confirmación</span>
          <span
            className={`hotel-locator-value${copiedKey === 'conf' ? ' hotel-locator-value--copied' : ''}`}
            onClick={() => copy('conf', hotel.confirmation)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && copy('conf', hotel.confirmation)}
            aria-label={`Confirmación ${hotel.confirmation}, toca para copiar`}
            title="Toca para copiar"
            aria-live="polite"
          >
            {copiedKey === 'conf' ? '¡Copiado!' : hotel.confirmation}
          </span>
        </div>
      )}

      {hotel.phone && (
        <a className="hotel-phone" href={`tel:${hotel.phone}`} aria-label={`Teléfono: ${hotel.phone}`}>
          Tel. {hotel.phone}
        </a>
      )}

      {hotel.notes && (
        <div className="hotel-notes">{hotel.notes}</div>
      )}
    </div>
  );
}

/* ---- TrainCard ---- */
function TrainCard({ train, featured = false }) {
  const pending = train.status === 'pending';

  return (
    <div className={`train-card${featured ? ' ticket-document--featured' : ''}`}>
      <div className="train-card__header">
        <div className="train-route">
          <div className="train-route__line">
            {train.from} <span className="train-route__arrow">→</span> {train.to}
          </div>
          <div className="train-route__meta">
            {fmtDateLong(train.date)} · {train.operator} {train.service}
          </div>
          {train.duration_approx && (
            <div className="train-route__meta">Duración aprox. {train.duration_approx}</div>
          )}
        </div>
        <span className={`train-status-chip train-status-chip--${train.status}`}>
          {pending ? 'Pendiente' : 'Reservado'}
        </span>
      </div>

      {(pending || train.notes) && <div className="train-separator" />}

      {pending && (
        <div className="train-pending-info">
          {train.reservation_window_opens && (
            <div className="train-window-text">
              Ventana abre: {fmtWindowDate(train.reservation_window_opens)}
            </div>
          )}
          {train.reservation_url && (
            <a
              href={train.reservation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="train-reserve-link"
              aria-label={`Reservar ${train.from} → ${train.to}`}
            >
              Reservar →
            </a>
          )}
        </div>
      )}

      {!pending && (train.departure_time || train.locator || train.car || train.seat) && (
        <div className="train-reserved-info">
          {train.departure_time && (
            <div className="train-reserved-item">
              <span className="train-reserved-label">Salida</span>
              <span className="train-reserved-value">{train.departure_time}</span>
            </div>
          )}
          {train.arrival_time && (
            <div className="train-reserved-item">
              <span className="train-reserved-label">Llegada</span>
              <span className="train-reserved-value">{train.arrival_time}</span>
            </div>
          )}
          {train.locator && (
            <div className="train-reserved-item">
              <span className="train-reserved-label">Localizador</span>
              <span className="train-reserved-value">{train.locator}</span>
            </div>
          )}
          {train.car && (
            <div className="train-reserved-item">
              <span className="train-reserved-label">Coche</span>
              <span className="train-reserved-value">{train.car}</span>
            </div>
          )}
          {train.seat && (
            <div className="train-reserved-item">
              <span className="train-reserved-label">Asiento</span>
              <span className="train-reserved-value">{train.seat}</span>
            </div>
          )}
        </div>
      )}

      {train.notes && (
        <div className="train-notes">{train.notes}</div>
      )}
    </div>
  );
}

/* ---- Main TicketsView ---- */
export default function TicketsView({ onBack }) {
  const { flights, hotels, trains, loading, error } = useTripData();
  const datedDocuments = [
    ...(flights ? [
      { key: 'flight-outbound', date: flights.outbound?.date },
      { key: 'flight-return', date: flights.return?.date },
    ] : []),
    ...hotels.map((hotel) => ({ key: `hotel-${hotel.id}`, date: hotel.dates?.from })),
    ...trains.map((train) => ({ key: `train-${train.id}`, date: train.date })),
  ].filter((item) => item.date).sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toLocaleDateString('sv-SE');
  const featuredKey = (datedDocuments.find((item) => item.date >= today) ?? datedDocuments.at(-1))?.key;

  return (
    <>
      <style>{STYLES}</style>
      <div className="tickets-view">
        {/* Navigation bar */}
        <div className="tickets-nav">
          <button
            className="tickets-back"
            onClick={onBack}
            aria-label="Volver a Más"
          >
            <Icon name="back" size={20}/> Más
          </button>
          <div className="tickets-nav-title">Billetes</div>
          <div className="tickets-nav-spacer" aria-hidden="true" />
        </div>

        <div className="tickets-scroll">
          <header className="tickets-intro">
            <div className="tickets-intro__eyebrow">Documentos de viaje</div>
            <h1>Todo a mano</h1>
            <p>Localizadores, horarios y reservas disponibles también sin conexión.</p>
          </header>
          {loading && <div className="tickets-loading">Cargando datos…</div>}
          {error   && <div className="tickets-loading" style={{ color: 'var(--accent)' }}>Error: {error}</div>}

          {!loading && !error && (
            <>
              {/* Vuelos */}
              {flights && (
                <div>
                  <div className="tickets-section-header">Vuelos</div>
                  <div className="tickets-cards">
                    <FlightCard flight={flights.outbound} label="IDA" featured={featuredKey === 'flight-outbound'} />
                    <FlightCard flight={flights.return} label="VUELTA" featured={featuredKey === 'flight-return'} />
                  </div>
                </div>
              )}

              {/* Hoteles */}
              {hotels.length > 0 && (
                <div>
                  <div className="tickets-section-header">Hoteles</div>
                  <div className="tickets-cards">
                    {hotels.map((h) => (
                      <HotelCard key={h.id} hotel={h} featured={featuredKey === `hotel-${h.id}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Trenes */}
              {trains.length > 0 && (
                <div>
                  <div className="tickets-section-header">Trenes</div>
                  <div className="tickets-cards">
                    {trains.map((t) => (
                      <TrainCard key={t.id} train={t} featured={featuredKey === `train-${t.id}`} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
