const { Router } = require('express');
const { query, pool } = require('../db');

const router = Router();

const VALID_STATUSES = ['empty', 'assigned', 'reserved', 'cancelled'];
const VALID_MEAL_SLOTS = ['lunch', 'dinner'];
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

// Express 4 no captura promesas rechazadas: sin esto, cualquier error de BD
// tumba el proceso entero (API + frontend).
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

let tableReady = false;
async function ensureTable() {
  if (tableReady || !pool) return;
  await query(`
    CREATE TABLE IF NOT EXISTS planner_slots (
      day_date            DATE NOT NULL,
      meal_slot           TEXT NOT NULL CHECK (meal_slot IN ('lunch', 'dinner')),
      restaurant_id       TEXT,
      status              TEXT NOT NULL DEFAULT 'empty' CHECK (status IN ('empty', 'assigned', 'reserved', 'cancelled')),
      confirmation_number TEXT,
      reserved_for        TEXT,
      reserved_time       TEXT,
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (day_date, meal_slot)
    );
  `);
  tableReady = true;
}

/**
 * GET /api/planner
 * Returns all saved slots (shared between both travelers). If Postgres
 * is not configured, returns an empty list — the client falls back to
 * localStorage so the planner keeps working locally.
 */
router.get('/', asyncHandler(async (_req, res) => {
  if (!pool) return res.json({ slots: [], persisted: false });
  await ensureTable();
  const result = await query('SELECT * FROM planner_slots ORDER BY day_date, meal_slot');
  res.json({ slots: result?.rows ?? [], persisted: true });
}));

/**
 * PUT /api/planner/:day/:slot
 * Upserts one day+slot. Body: { restaurant_id, status, confirmation_number, reserved_for, reserved_time }
 */
router.put('/:day/:slot', asyncHandler(async (req, res) => {
  const { day, slot } = req.params;
  const { restaurant_id = null, status = 'assigned', confirmation_number = null, reserved_for = null, reserved_time = null } = req.body ?? {};

  if (!DAY_RE.test(day)) {
    return res.status(400).json({ error: `day_date inválido: ${day} (formato YYYY-MM-DD)` });
  }
  if (!VALID_MEAL_SLOTS.includes(slot)) {
    return res.status(400).json({ error: `meal_slot inválido: ${slot}` });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status inválido: ${status}` });
  }
  if (!pool) {
    return res.status(503).json({ error: 'DATABASE_URL no configurada — usa almacenamiento local en el cliente.' });
  }

  await ensureTable();
  const result = await query(
    `INSERT INTO planner_slots (day_date, meal_slot, restaurant_id, status, confirmation_number, reserved_for, reserved_time, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
     ON CONFLICT (day_date, meal_slot)
     DO UPDATE SET restaurant_id = $3, status = $4, confirmation_number = $5, reserved_for = $6, reserved_time = $7, updated_at = now()
     RETURNING *`,
    [day, slot, restaurant_id, status, confirmation_number, reserved_for, reserved_time]
  );
  res.json({ slot: result?.rows?.[0] ?? null });
}));

/**
 * DELETE /api/planner/:day/:slot
 * Resets a slot back to empty (undo an assignment/reservation).
 */
router.delete('/:day/:slot', asyncHandler(async (req, res) => {
  const { day, slot } = req.params;
  if (!DAY_RE.test(day) || !VALID_MEAL_SLOTS.includes(slot)) {
    return res.status(400).json({ error: 'day o slot inválidos' });
  }
  if (!pool) {
    return res.status(503).json({ error: 'DATABASE_URL no configurada — usa almacenamiento local en el cliente.' });
  }
  await ensureTable();
  await query('DELETE FROM planner_slots WHERE day_date = $1 AND meal_slot = $2', [day, slot]);
  res.json({ ok: true });
}));

module.exports = router;
