import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject } from './validate-data.mjs';
import { calculateDepartureCountdown } from '../client/src/hooks/useDepartureCountdown.js';

test('los datos del viaje mantienen todas sus invariantes', () => {
  const { errors } = validateProject();
  assert.deepEqual(errors, []);
});

test('la cuenta atrás usa días, horas y minutos exactos hasta el despegue', () => {
  const countdown = calculateDepartureCountdown(
    '2026-08-13T12:30:00+02:00',
    new Date('2026-07-15T14:29:00+02:00')
  );
  assert.deepEqual(
    { days: countdown.days, hours: countdown.hours, minutes: countdown.minutes },
    { days: 28, hours: 22, minutes: 1 }
  );
});
