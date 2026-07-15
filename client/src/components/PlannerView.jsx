import React, { useState } from 'react';
import { useTripData } from '../hooks/useTripData.js';
import { useRestaurantsData, CITY_ES_TO_EN } from '../hooks/useRestaurantsData.js';
import { usePlannerData, getSlotConflicts } from '../hooks/usePlannerData.js';

/* ---------------------------------------------------------------
   PlannerView
   Planificador de comidas pre-viaje (F8a). Overlay a pantalla
   completa con los 13 días del viaje x 2 slots (mediodía/noche).
   Permite asignar un restaurante de la ciudad del día, marcarlo
   como reservado con nº de confirmación, o quitarlo. Detecta
   conflictos (cierre semanal, reserva obligatoria) en tiempo real.
   --------------------------------------------------------------- */

const STYLES = `
.planner-view {
  position: fixed;
  inset: 0;
  z-index: 260;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  overflow-y: auto;
}

.planner-nav {
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
  padding: 0 16px;
  flex-shrink: 0;
}

.planner-nav__back {
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
}

.planner-nav__title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--label-primary);
  margin-right: 40px;
}

.planner-body {
  padding: var(--page-padding);
  display: flex;
  flex-direction: column;
  gap: var(--gap-card);
}

.planner-notice {
  font-size: 13px;
  color: var(--label-secondary);
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: 10px 14px;
}

.planner-notice--error {
  color: #fff;
  background: rgba(232, 0, 45, 0.22);
  border: 1px solid rgba(232, 0, 45, 0.5);
}

.planner-day-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  padding: 16px;
}

.planner-day-card__header {
  font-size: 15px;
  font-weight: 700;
  color: var(--label-primary);
  margin-bottom: 12px;
}

.planner-day-card__city {
  color: var(--label-secondary);
  font-weight: 500;
}

.planner-slot {
  padding: 12px 0;
  border-top: 1px solid var(--separator);
}
.planner-slot:first-of-type { border-top: none; padding-top: 0; }

.planner-slot__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--label-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.planner-slot__restaurant {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
}

.planner-status-chip {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: var(--radius-chip);
  margin-left: 8px;
  vertical-align: middle;
}
.planner-status-chip--assigned { background: var(--accent-soft); color: var(--accent); }
.planner-status-chip--reserved { background: #1e6b3a33; color: #34C759; }
.planner-status-chip--cancelled { background: #E8002D22; color: #E8002D; }

.planner-slot__warning {
  font-size: 13px;
  color: #FF9500;
  margin-top: 4px;
}

.planner-slot__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.planner-slot__btn {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  padding: 6px 12px;
  border-radius: var(--radius-chip);
  border: 1.5px solid var(--glass-border);
  background: var(--bg-surface-2);
  color: var(--label-primary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.planner-slot__btn--primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.planner-empty-slot {
  font-size: 14px;
  color: var(--label-tertiary);
  font-style: italic;
}

/* Picker overlay interno */
.planner-picker {
  position: fixed;
  inset: 0;
  z-index: 270;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  overflow-y: auto;
}

.planner-picker-list {
  padding: var(--page-padding);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.planner-picker-item {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--glass-border);
  padding: 14px 16px;
  cursor: pointer;
}

.planner-picker-item__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--label-primary);
}

.planner-picker-item__meta {
  font-size: 13px;
  color: var(--label-secondary);
  margin-top: 2px;
}

.planner-reserve-form {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.planner-reserve-form input {
  font-family: var(--font);
  font-size: 14px;
  padding: 8px 10px;
  border-radius: var(--radius-chip);
  border: 1.5px solid var(--glass-border);
  background: var(--bg-surface-2);
  color: var(--label-primary);
}
`;

const CITY_LABELS_ES = { Tokyo: 'Tokio', Kyoto: 'Kioto', Osaka: 'Osaka', Hiroshima: 'Hiroshima' };
const MEAL_LABELS = { lunch: 'Mediodía', dinner: 'Noche' };

function formatDateES(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function PlannerView({ onBack }) {
  const { days, loading: loadingDays } = useTripData();
  const { restaurants, getRestaurantById, loading: loadingRest } = useRestaurantsData();
  const { getSlot, saveSlot, clearSlot, loading: loadingPlanner, persisted } = usePlannerData();
  const [picking, setPicking] = useState(null); // { dayDate, mealSlot, city }
  const [reservingKey, setReservingKey] = useState(null);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [saveError, setSaveError] = useState('');

  async function runSave(action) {
    setSaveError('');
    const saved = await action();
    if (!saved) {
      setSaveError('No se pudo sincronizar el cambio. Se ha restaurado el estado anterior; comprueba la conexión e inténtalo de nuevo.');
    }
    return saved;
  }

  const loading = loadingDays || loadingRest || loadingPlanner;

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="planner-view">
          <nav className="planner-nav">
            <button className="planner-nav__back" onClick={onBack}>← Volver</button>
          </nav>
          <div className="planner-body"><div className="planner-notice">Cargando planificador…</div></div>
        </div>
      </>
    );
  }

  if (picking) {
    const cityEn = CITY_ES_TO_EN[picking.city] ?? picking.city;
    const options = restaurants.filter((r) => r.city === cityEn);
    return (
      <>
        <style>{STYLES}</style>
        <div className="planner-picker">
          <nav className="planner-nav">
            <button className="planner-nav__back" onClick={() => setPicking(null)}>← Volver</button>
            <div className="planner-nav__title">{CITY_LABELS_ES[cityEn] ?? cityEn}</div>
          </nav>
          <div className="planner-picker-list">
            {options.length === 0 && (
              <div className="planner-notice">No hay restaurantes curados para esta ciudad todavía — improvisa sobre el terreno.</div>
            )}
            {options.map((r) => (
              <div
                key={r.id}
                className="planner-picker-item"
                onClick={async () => {
                  const saved = await runSave(() => saveSlot(picking.dayDate, picking.mealSlot, { restaurant_id: r.id, status: 'assigned', confirmation_number: null }));
                  if (saved) setPicking(null);
                }}
              >
                <div className="planner-picker-item__name">{r.name} {r.michelin_stars > 0 && '⭐'.repeat(r.michelin_stars)}</div>
                <div className="planner-picker-item__meta">{r.neighborhood} · {r.price_per_person_yen}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="planner-view" role="main" aria-label="Planificador de comidas">
        <nav className="planner-nav">
          <button className="planner-nav__back" onClick={onBack}>← Volver</button>
          <div className="planner-nav__title">Planificador de comidas</div>
        </nav>

        <div className="planner-body">
          {saveError && <div className="planner-notice planner-notice--error" role="alert">{saveError}</div>}
          {!persisted && (
            <div className="planner-notice">
              Guardado solo en este dispositivo porque no hay conexión con la base de datos compartida. Los cambios no se verán en el otro móvil hasta recuperar la conexión y guardarlos de nuevo.
            </div>
          )}

          {days.map((day) => {
            const hasCityMenu = !!CITY_ES_TO_EN[day.city];
            return (
              <div className="planner-day-card" key={day.date}>
                <div className="planner-day-card__header">
                  {formatDateES(day.date)} <span className="planner-day-card__city">· {day.city}</span>
                </div>

                {['lunch', 'dinner'].map((mealSlot) => {
                  const slot = getSlot(day.date, mealSlot);
                  const restaurant = getRestaurantById(slot.restaurant_id);
                  const conflicts = getSlotConflicts(day.date, mealSlot, restaurant, slot.status);
                  const key = `${day.date}_${mealSlot}`;

                  return (
                    <div className="planner-slot" key={mealSlot}>
                      <div className="planner-slot__label">{MEAL_LABELS[mealSlot]}</div>

                      {!restaurant && <div className="planner-empty-slot">Sin asignar — improvisar</div>}

                      {restaurant && (
                        <>
                          <span className="planner-slot__restaurant">{restaurant.name}</span>
                          <span className={`planner-status-chip planner-status-chip--${slot.status}`}>
                            {slot.status === 'reserved' ? 'Reservado' : slot.status === 'cancelled' ? 'Cancelado' : 'Asignado'}
                          </span>
                          {slot.status === 'reserved' && slot.confirmation_number && (
                            <div className="planner-slot__label" style={{ marginTop: 4, textTransform: 'none' }}>Confirmación: {slot.confirmation_number}</div>
                          )}
                          {conflicts.map((w, i) => <div className="planner-slot__warning" key={i}>⚠ {w}</div>)}
                        </>
                      )}

                      {reservingKey === key && (
                        <div className="planner-reserve-form">
                          <input
                            type="text"
                            placeholder="Nº de confirmación (opcional)"
                            value={confirmationInput}
                            onChange={(e) => setConfirmationInput(e.target.value)}
                          />
                          <div className="planner-slot__actions">
                            <button
                              className="planner-slot__btn planner-slot__btn--primary"
                              onClick={async () => {
                                const saved = await runSave(() => saveSlot(day.date, mealSlot, { status: 'reserved', confirmation_number: confirmationInput || null }));
                                if (saved) {
                                  setReservingKey(null);
                                  setConfirmationInput('');
                                }
                              }}
                            >
                              Confirmar reserva
                            </button>
                            <button className="planner-slot__btn" onClick={() => { setReservingKey(null); setConfirmationInput(''); }}>Cancelar</button>
                          </div>
                        </div>
                      )}

                      {reservingKey !== key && (
                        <div className="planner-slot__actions">
                          <button
                            className="planner-slot__btn"
                            onClick={() => setPicking({ dayDate: day.date, mealSlot, city: day.city })}
                            disabled={!hasCityMenu && false}
                          >
                            {restaurant ? 'Cambiar' : 'Elegir restaurante'}
                          </button>
                          {restaurant && slot.status !== 'reserved' && (
                            <button className="planner-slot__btn planner-slot__btn--primary" onClick={() => setReservingKey(key)}>
                              Marcar reservado
                            </button>
                          )}
                          {restaurant && (
                            <button className="planner-slot__btn" onClick={() => runSave(() => clearSlot(day.date, mealSlot))}>Quitar</button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
