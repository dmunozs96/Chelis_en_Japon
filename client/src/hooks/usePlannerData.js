import { useState, useEffect, useCallback } from 'react';

/**
 * usePlannerData
 *
 * Planificador de comidas compartido (F8a). Cada día del viaje tiene
 * dos slots: 'lunch' y 'dinner'. Intenta persistir en Postgres vía
 * /api/planner (compartido entre los dos viajeros); si el servidor no
 * tiene DATABASE_URL configurada, cae a localStorage para que el
 * planificador siga funcionando en local.
 *
 * Slot shape: { restaurant_id, status, confirmation_number, reserved_for, reserved_time }
 * status: 'empty' | 'assigned' | 'reserved' | 'cancelled'
 */

const LOCAL_KEY = 'planner_slots_local';
const WEEKDAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function slotKey(dayDate, mealSlot) {
  return `${dayDate}_${mealSlot}`;
}

export function weekdayEnglish(dayDate) {
  const [y, m, d] = dayDate.split('-').map(Number);
  return WEEKDAY_EN[new Date(y, m - 1, d).getDay()];
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocal(slots) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(slots));
  } catch {}
}

export function usePlannerData() {
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/planner');
        const json = await res.json();
        if (cancelled) return;
        if (json.persisted && Array.isArray(json.slots)) {
          const map = {};
          for (const row of json.slots) {
            const dayDate = typeof row.day_date === 'string' ? row.day_date.slice(0, 10) : row.day_date;
            map[slotKey(dayDate, row.meal_slot)] = {
              restaurant_id: row.restaurant_id,
              status: row.status,
              confirmation_number: row.confirmation_number,
              reserved_for: row.reserved_for,
              reserved_time: row.reserved_time,
            };
          }
          setSlots(map);
          setPersisted(true);
        } else {
          setSlots(loadLocal());
          setPersisted(false);
        }
      } catch {
        if (!cancelled) {
          setSlots(loadLocal());
          setPersisted(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const saveSlot = useCallback(async (dayDate, mealSlot, patch) => {
    const key = slotKey(dayDate, mealSlot);
    const next = { restaurant_id: null, status: 'assigned', confirmation_number: null, reserved_for: null, reserved_time: null, ...slots[key], ...patch };

    setSlots((prev) => {
      const merged = { ...prev, [key]: next };
      if (!persisted) saveLocal(merged);
      return merged;
    });

    if (persisted) {
      try {
        await fetch(`/api/planner/${dayDate}/${mealSlot}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        });
      } catch {
        // El estado local ya se actualizó de forma optimista; se reintentará en el próximo guardado.
      }
    }
  }, [slots, persisted]);

  const clearSlot = useCallback(async (dayDate, mealSlot) => {
    const key = slotKey(dayDate, mealSlot);
    setSlots((prev) => {
      const merged = { ...prev };
      delete merged[key];
      if (!persisted) saveLocal(merged);
      return merged;
    });

    if (persisted) {
      try {
        await fetch(`/api/planner/${dayDate}/${mealSlot}`, { method: 'DELETE' });
      } catch {}
    }
  }, [persisted]);

  function getSlot(dayDate, mealSlot) {
    return slots[slotKey(dayDate, mealSlot)] ?? { restaurant_id: null, status: 'empty', confirmation_number: null, reserved_for: null, reserved_time: null };
  }

  return { slots, getSlot, saveSlot, clearSlot, loading, persisted };
}

/**
 * getSlotConflicts
 * Devuelve avisos de conflicto para un slot dado un restaurante asignado.
 */
export function getSlotConflicts(dayDate, mealSlot, restaurant, slotStatus) {
  if (!restaurant) return [];
  const warnings = [];

  const weekday = weekdayEnglish(dayDate);
  if (restaurant.closed_days?.includes(weekday)) {
    warnings.push(`Cerrado los ${weekday === 'Sunday' ? 'domingos' : 'este día (' + weekday + ')'}.`);
  }

  if (restaurant.meal_types && !restaurant.meal_types.includes(mealSlot)) {
    warnings.push(mealSlot === 'lunch' ? 'No sirve almuerzo.' : 'No sirve cena.');
  }

  if (restaurant.must_book_in_advance && slotStatus !== 'reserved') {
    warnings.push('Requiere reserva con antelación — resérvalo cuanto antes.');
  }

  return warnings;
}
