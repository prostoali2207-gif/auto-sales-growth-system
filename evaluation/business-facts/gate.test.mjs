import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveFact, REASON_CODES } from '../../adapters/business-facts/gate.mjs';

const cases = JSON.parse(
  readFileSync(new URL('./fixtures/gate-cases.json', import.meta.url), 'utf8')
);

const ALL_REASON_CODES = [
  'MISSING_FACT',
  'REVOKED_FACT',
  'CONFLICTING_FACT_STATUS',
  'STALE_FACT_STATUS',
  'CONFLICTING_DUPLICATES',
  'EXPIRED_FACT',
  'POLICY_UNSET'
];

test('REASON_CODES exposes exactly the seven documented, distinct codes', () => {
  assert.deepEqual(Object.keys(REASON_CODES).sort(), [...ALL_REASON_CODES].sort());
  assert.equal(new Set(Object.values(REASON_CODES)).size, 7);
});

for (const c of cases) {
  test(`${c.id}: ${c.description}`, () => {
    const result = resolveFact(c.query, c.facts, c.policy, c.now);

    assert.equal(result.available, c.expected.available, `unexpected availability for ${c.id}`);

    if (c.expected.available) {
      assert.equal(result.fact.fact_id, c.expected.fact_id, `unexpected canonical fact for ${c.id}`);
    } else {
      assert.equal(result.reason_code, c.expected.reason_code, `unexpected reason_code for ${c.id}`);
      if (c.expected.fact_id) {
        assert.equal(result.fact_id, c.expected.fact_id, `unexpected implicated fact_id for ${c.id}`);
      }
      if (c.expected.fact_ids) {
        assert.deepEqual(
          [...result.fact_ids].sort(),
          [...c.expected.fact_ids].sort(),
          `unexpected implicated fact_ids for ${c.id}`
        );
      }
    }
  });
}

test('every one of the six required failure classes plus POLICY_UNSET is exercised by a fixture', () => {
  const seen = new Set(
    cases.filter((c) => !c.expected.available).map((c) => c.expected.reason_code)
  );
  for (const code of ALL_REASON_CODES) {
    assert.ok(seen.has(code), `no gate fixture exercises reason_code ${code}`);
  }
});

test('resolveFact never falls back to a silently-picked winner across a genuine conflict', () => {
  const conflict = cases.find((c) => c.id === 'dup-conflict-different-values');
  const result = resolveFact(conflict.query, conflict.facts, conflict.policy, conflict.now);
  assert.equal(result.available, false);
  assert.equal(result.fact, undefined);
});
