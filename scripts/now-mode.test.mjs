import test from 'node:test';
import assert from 'node:assert/strict';
import { flattenTimedSteps, getNowState, minutesUntil } from '../client/src/lib/nowMode.js';

const day = {
  blocks: [
    { label: 'Mañana', steps: [
      { time: '09:00', title: 'Salir', duration_min: 20 },
      { time: '09:30', title: 'Tren' },
    ] },
    { label: 'Tarde', steps: [
      { time: '14:00', title: 'Visita', duration_min: 60 },
    ] },
  ],
};

function at(hours, minutes) {
  return new Date(2026, 7, 15, hours, minutes);
}

test('Modo Ahora ordena los subpasos y descarta horas editoriales', () => {
  const steps = flattenTimedSteps({
    blocks: [{ steps: [{ time: 'tarde', title: 'No computable' }, { time: '10:00', title: 'Válido' }] }],
  });
  assert.deepEqual(steps.map((step) => step.title), ['Válido']);
});

test('Modo Ahora distingue antes, durante y después del plan', () => {
  assert.equal(getNowState(day, at(8, 0)).phase, 'before_start');
  assert.equal(getNowState(day, at(9, 15)).current.title, 'Salir');
  assert.equal(getNowState(day, at(10, 0)).current.title, 'Tren');
  assert.equal(getNowState(day, at(15, 1)).phase, 'finished');
});

test('Modo Ahora calcula minutos hasta el siguiente paso', () => {
  const state = getNowState(day, at(8, 45));
  assert.equal(minutesUntil(state.next, at(8, 45)), 15);
});

