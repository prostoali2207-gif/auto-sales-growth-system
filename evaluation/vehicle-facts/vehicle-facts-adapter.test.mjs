import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  AVAILABLE_STATUS,
  NEVER_DISCLOSED_FIELDS,
  assertNoWithheldFacts,
  hasValue,
  isOfferable,
  offerableVehicleFacts,
  resolveVehicle,
  toVerifiedAt,
  vehicleToVerifiedFacts
} from '../../adapters/inventory/vehicle-facts-adapter.mjs';

const { vehicles } = JSON.parse(
  fs.readFileSync(new URL('./synthetic-inventory.json', import.meta.url), 'utf8')
);

const SOURCE = 'am-motors-inventory-sheet';
const byId = (id) => vehicles.find((v) => v.vehicle_id === id);
const facts = (v) => vehicleToVerifiedFacts(v, { sourceSystem: SOURCE });

const REQUIRED_FACT_KEYS = [
  'fact_id', 'entity_type', 'entity_id', 'field',
  'value', 'source_system', 'verified_at', 'status'
];

/* -- the negotiation floor never leaves the adapter ---------------------- */

test('min_price_aed never reaches verified_facts, for any vehicle', () => {
  assert.ok(NEVER_DISCLOSED_FIELDS.includes('min_price_aed'));

  for (const vehicle of vehicles) {
    const emitted = facts(vehicle);
    assert.equal(
      emitted.filter((f) => f.field === 'min_price_aed').length, 0,
      `${vehicle.vehicle_id} leaked the negotiation floor as a fact`
    );
    // and its numeric value must not surface under any other field name
    if (vehicle.min_price_aed !== undefined) {
      for (const fact of emitted) {
        assert.notEqual(
          fact.value, vehicle.min_price_aed,
          `${vehicle.vehicle_id} leaked the floor value via ${fact.field}`
        );
      }
    }
  }
});

test('min_price_aed is withheld even when the source row is otherwise complete', () => {
  const emitted = facts(byId('AM-006'));
  assert.ok(emitted.length > 0, 'expected a complete row to produce facts');
  assert.ok(emitted.some((f) => f.field === 'price_aed'), 'public price should be emitted');
  assert.ok(!emitted.some((f) => f.field === 'min_price_aed'));
});

test('the guard throws rather than let a withheld field through', () => {
  assert.throws(
    () => assertNoWithheldFacts([{ field: 'min_price_aed', value: 1 }]),
    /withheld field leaked/
  );
});

test('internal notes are not emitted as facts', () => {
  assert.ok(NEVER_DISCLOSED_FIELDS.includes('notes'));
  assert.ok(byId('AM-002').notes, 'fixture should carry a note to make this meaningful');
  assert.ok(!facts(byId('AM-002')).some((f) => f.field === 'notes'));
});

/* -- absence produces no fact -------------------------------------------- */

test('missing, empty and placeholder cells produce no fact', () => {
  const sparse = byId('AM-005');
  const emitted = facts(sparse);
  const emittedFields = new Set(emitted.map((f) => f.field));

  for (const field of ['trim', 'color', 'engine', 'service_history']) {
    assert.ok(!emittedFields.has(field), `${field} was empty and must not produce a fact`);
  }
  // absent from the row entirely
  assert.ok(!emittedFields.has('fuel'));
  // present fields still work
  assert.ok(emittedFields.has('make') && emittedFields.has('mileage_km'));
});

test('hasValue treats blanks and placeholders as absence, and 0 as a value', () => {
  for (const blank of [null, undefined, '', '   ', '-', '—', NaN]) {
    assert.equal(hasValue(blank), false, `${String(blank)} should be absence`);
  }
  assert.equal(hasValue(0), true, 'zero is a real value, not absence');
  assert.equal(hasValue(false), true);
});

test('an unverifiable updated_at suppresses every fact for the row', () => {
  const undated = byId('AM-008');
  assert.equal(toVerifiedAt(undated.updated_at), null);
  assert.deepEqual(facts(undated), [], 'facts cannot be verified without a verification time');
});

/* -- every fact carries its provenance ----------------------------------- */

test('every emitted fact carries fact_id, source_system and verified_at', () => {
  const seenIds = new Set();

  for (const vehicle of vehicles) {
    for (const fact of facts(vehicle)) {
      for (const key of REQUIRED_FACT_KEYS) {
        assert.ok(key in fact, `${fact.field} is missing ${key}`);
      }
      assert.equal(fact.source_system, SOURCE);
      assert.equal(fact.entity_id, vehicle.vehicle_id);
      assert.match(fact.verified_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/);
      assert.ok(hasValue(fact.value), 'a fact must not carry an empty value');

      assert.ok(!seenIds.has(fact.fact_id), `duplicate fact_id ${fact.fact_id}`);
      seenIds.add(fact.fact_id);
    }
  }
  assert.ok(seenIds.size > 0);
});

test('a date-only updated_at is anchored at midnight in the business timezone', () => {
  assert.equal(toVerifiedAt('2026-08-24'), '2026-08-24T00:00:00+04:00');
  assert.equal(toVerifiedAt('24.08.2026'), '2026-08-24T00:00:00+04:00');
  assert.equal(toVerifiedAt('2026-08-24T09:30:00+04:00'), '2026-08-24T09:30:00+04:00');
});

test('a fact without a source system is refused', () => {
  assert.throws(() => vehicleToVerifiedFacts(byId('AM-006'), { sourceSystem: '' }), /source system/);
});

/* -- availability --------------------------------------------------------- */

test('a vehicle whose status is not the available status is not offered', () => {
  const sold = byId('AM-004');
  assert.notEqual(sold.status, AVAILABLE_STATUS);
  assert.equal(isOfferable(sold), false);

  const result = offerableVehicleFacts(sold, { sourceSystem: SOURCE });
  assert.equal(result.offerable, false);
  assert.deepEqual(result.verified_facts, [], 'a sold car must not come with offerable facts');
  assert.equal(result.status, 'Продана');
});

test('an available vehicle is offered with its facts', () => {
  const result = offerableVehicleFacts(byId('AM-006'), { sourceSystem: SOURCE });
  assert.equal(result.offerable, true);
  assert.ok(result.verified_facts.length > 0);
});

test('resolution skips non-available vehicles by default', () => {
  const result = resolveVehicle(vehicles, { make: 'Toyota', model: 'Camry' }, { sourceSystem: SOURCE });
  assert.equal(result.resolution, 'NO_MATCH', 'a sold Camry must not resolve as available stock');
});

/* -- ambiguity ------------------------------------------------------------ */

test('three 2020 Elantras yield AMBIGUOUS with distinguishing candidates, not a pick', () => {
  const result = resolveVehicle(
    vehicles,
    { make: 'Hyundai', model: 'Elantra', year: 2020 },
    { sourceSystem: SOURCE }
  );

  assert.equal(result.resolution, 'AMBIGUOUS');
  assert.deepEqual(result.verified_facts, [], 'an ambiguous match must not answer with facts');

  assert.deepEqual(
    result.candidates.map((c) => c.vehicle_id).sort(),
    ['AM-002', 'AM-003', 'AM-006']
  );

  for (const key of ['trim', 'color', 'mileage_km']) {
    assert.ok(result.distinguishing_fields.includes(key), `${key} should be offered as a discriminator`);
  }
  for (const candidate of result.candidates) {
    assert.ok(hasValue(candidate.trim) && hasValue(candidate.color));
  }
  // the floor must not appear even in the disambiguation prompt
  assert.ok(!result.distinguishing_fields.includes('min_price_aed'));
  for (const candidate of result.candidates) {
    assert.ok(!('min_price_aed' in candidate));
  }
});

test('adding the distinguishing attribute resolves to exactly one vehicle', () => {
  const result = resolveVehicle(
    vehicles,
    { make: 'Hyundai', model: 'Elantra', year: 2020, color: 'White' },
    { sourceSystem: SOURCE }
  );
  assert.equal(result.resolution, 'RESOLVED');
  assert.equal(result.vehicle_id, 'AM-006');
  assert.ok(result.verified_facts.length > 0);
});

test('no match returns empty rather than the nearest vehicle', () => {
  const result = resolveVehicle(
    vehicles,
    { make: 'Hyundai', model: 'Elantra', year: 2015 },
    { sourceSystem: SOURCE }
  );
  assert.equal(result.resolution, 'NO_MATCH');
  assert.deepEqual(result.candidates, []);
  assert.deepEqual(result.verified_facts, []);
});

test('an empty description does not match the whole lot', () => {
  const result = resolveVehicle(vehicles, {}, { sourceSystem: SOURCE });
  assert.equal(result.resolution, 'NO_MATCH');
});

/* -- a sold vehicle stays out of everything --------------------------------- */

test('a "Продана" vehicle is never offered and never appears in a search', () => {
  const sold = byId('AM-004');
  assert.equal(sold.status, 'Продана');

  // not offerable
  assert.equal(isOfferable(sold), false);
  assert.deepEqual(offerableVehicleFacts(sold, { sourceSystem: SOURCE }).verified_facts, []);

  // not reachable by an exact description of itself
  const exact = resolveVehicle(
    vehicles,
    { make: sold.make, model: sold.model, year: sold.year, color: sold.color },
    { sourceSystem: SOURCE }
  );
  assert.equal(exact.resolution, 'NO_MATCH');
  assert.deepEqual(exact.verified_facts, []);

  // and never listed as a candidate when something else is ambiguous
  const ambiguous = resolveVehicle(
    vehicles,
    { make: 'Hyundai', model: 'Elantra', year: 2020 },
    { sourceSystem: SOURCE }
  );
  assert.ok(!ambiguous.candidates.some((c) => c.vehicle_id === 'AM-004'));
});

test('fixture VINs are valid, so the integrity check and the adapter agree', () => {
  for (const vehicle of vehicles) {
    assert.match(vehicle.vin, /^[A-HJ-NPR-Z0-9]{17}$/, `${vehicle.vehicle_id} has an invalid VIN`);
  }
});

/* -- contract conformance ------------------------------------------------- */

test('emitted facts satisfy the agent verifiedFact contract', () => {
  const turnSchema = JSON.parse(
    fs.readFileSync(new URL('../../data-schemas/sales-lead-turn.schema.json', import.meta.url), 'utf8')
  );
  const definition = turnSchema.$defs.verifiedFact;
  const allowed = new Set(Object.keys(definition.properties));
  const entityTypes = new Set(definition.properties.entity_type.enum);
  const statuses = new Set(definition.properties.status.enum);

  const emitted = vehicles.flatMap((v) => facts(v));
  assert.ok(emitted.length > 0);

  for (const fact of emitted) {
    for (const key of definition.required) assert.ok(key in fact, `missing required ${key}`);
    for (const key of Object.keys(fact)) {
      assert.ok(allowed.has(key), `${key} is not allowed by the contract`);
    }
    assert.ok(entityTypes.has(fact.entity_type), `bad entity_type ${fact.entity_type}`);
    assert.ok(statuses.has(fact.status), `bad status ${fact.status}`);
  }
});
