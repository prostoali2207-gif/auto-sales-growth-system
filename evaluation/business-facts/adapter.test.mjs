import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadFactsFromFile } from '../../adapters/business-facts/adapter.mjs';
import { resolveFact } from '../../adapters/business-facts/gate.mjs';

const fixturePath = (name) =>
  fileURLToPath(new URL(`./fixtures/source-files/${name}`, import.meta.url));

test('loadFactsFromFile: valid source file emits exactly its schema-valid records', () => {
  const { facts, invalidRecords, malformed } = loadFactsFromFile(fixturePath('valid.json'));
  assert.equal(malformed, false);
  assert.equal(invalidRecords.length, 0);
  assert.equal(facts.length, 2);
  assert.ok(facts.every((f) => typeof f.fact_id === 'string'));
});

test('loadFactsFromFile: a schema-invalid record is excluded, not emitted, and reported', () => {
  const { facts, invalidRecords, malformed } = loadFactsFromFile(
    fixturePath('mixed-valid-and-invalid.json')
  );
  assert.equal(malformed, false);
  assert.equal(facts.length, 1);
  assert.equal(facts[0].fact_id, 'fact-price-veh002-2026-08-20');
  assert.equal(invalidRecords.length, 1);
  assert.equal(invalidRecords[0].index, 1);
  assert.ok(invalidRecords[0].errors.length > 0);
});

test('loadFactsFromFile: invalid JSON syntax fails closed to an empty pool, never throws', () => {
  assert.doesNotThrow(() => loadFactsFromFile(fixturePath('malformed-syntax.json')));
  const { facts, malformed, malformedDetail } = loadFactsFromFile(fixturePath('malformed-syntax.json'));
  assert.equal(malformed, true);
  assert.deepEqual(facts, []);
  assert.match(malformedDetail, /invalid JSON/i);
});

test('loadFactsFromFile: valid JSON with the wrong top-level shape fails closed to an empty pool', () => {
  const { facts, malformed, malformedDetail } = loadFactsFromFile(fixturePath('wrong-shape.json'));
  assert.equal(malformed, true);
  assert.deepEqual(facts, []);
  assert.match(malformedDetail, /top-level JSON array/i);
});

test('loadFactsFromFile: missing file fails closed to an empty pool, never throws', () => {
  assert.doesNotThrow(() => loadFactsFromFile(fixturePath('does-not-exist.json')));
  const { facts, malformed } = loadFactsFromFile(fixturePath('does-not-exist.json'));
  assert.equal(malformed, true);
  assert.deepEqual(facts, []);
});

test('end-to-end: any unusable source file resolves every query to MISSING_FACT, never a crash or a guess', () => {
  const policy = { default_freshness_window_seconds: null, per_field_freshness_windows_seconds: {} };
  for (const name of ['malformed-syntax.json', 'wrong-shape.json', 'does-not-exist.json']) {
    const { facts } = loadFactsFromFile(fixturePath(name));
    const result = resolveFact(
      { entityType: 'PRICE', entityId: 'veh-001', field: 'price' },
      facts,
      policy,
      '2026-08-24T10:00:00Z'
    );
    assert.equal(result.available, false, `expected fail-closed for ${name}`);
    assert.equal(result.reason_code, 'MISSING_FACT', `expected MISSING_FACT for ${name}`);
  }
});
