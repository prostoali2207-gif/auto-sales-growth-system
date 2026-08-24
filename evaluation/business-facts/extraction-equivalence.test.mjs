import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { buildAjv } from './lib/ajv-schemas.mjs';

// Hard constraint 1 (task brief): "No semantic drift on extraction. The extracted schema
// must accept exactly the same instances as the inline definition it replaced." This test
// proves it by running one fixture set against both definitions.

const preExtraction = JSON.parse(
  readFileSync(
    new URL('./snapshots/sales-lead-turn.schema.pre-extraction.json', import.meta.url),
    'utf8'
  )
);
const oldVerifiedFactSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'old-inline-verified-fact',
  ...preExtraction.$defs.verifiedFact
};

const oldAjv = new Ajv2020({ allErrors: true, strict: false });
addFormats(oldAjv);
const validateOld = oldAjv.compile(oldVerifiedFactSchema);

const newAjv = buildAjv();
const validateNew = newAjv.getSchema('business-fact.schema.json');
assert.ok(validateNew, 'business-fact.schema.json must be registered and resolvable');

const cases = JSON.parse(
  readFileSync(
    new URL('../../data-schemas/fixtures/business-fact/cases.json', import.meta.url),
    'utf8'
  )
);

assert.ok(cases.length >= 12, 'expected the full fixture set to be present');

for (const c of cases) {
  test(`${c.id}: old inline def and new business-fact.schema.json agree`, () => {
    const oldResult = validateOld(c.instance);
    const newResult = validateNew(c.instance);

    assert.equal(
      oldResult,
      newResult,
      `extraction drift on "${c.id}": old=${oldResult} (${JSON.stringify(validateOld.errors)}) new=${newResult} (${JSON.stringify(validateNew.errors)})`
    );
    assert.equal(
      newResult,
      c.valid,
      `fixture "${c.id}" expected valid=${c.valid} but business-fact.schema.json returned ${newResult}: ${JSON.stringify(validateNew.errors)}`
    );
  });
}

test('every business-fact status enum value has both a valid and an invalid fixture', () => {
  const statuses = ['CONFIRMED', 'STALE', 'CONFLICTING', 'REVOKED'];
  for (const status of statuses) {
    const hasValid = cases.some((c) => c.status_under_test === status && c.valid === true);
    const hasInvalid = cases.some((c) => c.status_under_test === status && c.valid === false);
    assert.ok(hasValid, `missing a valid fixture for status ${status}`);
    assert.ok(hasInvalid, `missing an invalid fixture for status ${status}`);
  }
});
