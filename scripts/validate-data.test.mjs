import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject } from './validate-data.mjs';

test('los datos del viaje mantienen todas sus invariantes', () => {
  const { errors } = validateProject();
  assert.deepEqual(errors, []);
});
