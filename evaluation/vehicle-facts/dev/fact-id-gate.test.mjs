/**
 * DEV gate for the FACT and ID families. Deterministic, zero provider calls.
 *
 * This checks the turn INPUT the agent now receives -- that the data whose
 * absence caused the r10 failures is present, correct and provenanced, and
 * that the situations where the agent must not answer produce nothing to
 * answer with.
 *
 * It does NOT score agent replies. A scored verdict needs the sealed held-out
 * pack and a paid run. Nothing here may be reported as a qualification result.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  NEVER_DISCLOSED_FIELDS,
  answerability,
  assembleTurnInput,
  factFor
} from '../../../adapters/inventory/turn-input-assembler.mjs';

const suite = JSON.parse(fs.readFileSync(new URL('./fact-id-cases.json', import.meta.url), 'utf8'));
const turnSchema = JSON.parse(
  fs.readFileSync(new URL('../../../data-schemas/sales-lead-turn.schema.json', import.meta.url), 'utf8')
);

const SOURCE = 'am-motors-inventory-sheet';
const AT = '2026-08-26T09:00:00+04:00';

/** Groups that come from the channel, not from inventory. */
function shellFor(caseId, text) {
  return {
    run_context: {
      run_id: `dev-${caseId}`, occurred_at: AT, business_id: 'am-motors',
      timezone: 'Asia/Dubai', agent_version: 'dev', policy_version: 'dev',
      permitted_actions: ['DRAFT_MESSAGE', 'READ_FACTS', 'SEARCH_INVENTORY']
    },
    inquiry: {
      inquiry_id: `inq-${caseId}`, event_id: `evt-${caseId}`, channel: 'WHATSAPP',
      thread_id: `thr-${caseId}`, received_at: AT, direction: 'INBOUND', raw_text: text
    },
    attribution: {
      attribution_id: `att-${caseId}`, inquiry_channel: 'WHATSAPP', captured_at: AT,
      first_touch: {
        touch_id: `t-${caseId}`, occurred_at: AT, channel: 'WHATSAPP',
        source_type: 'DIRECT', evidence_type: 'DECLARED'
      },
      touches: [], confidence: 'SELF_REPORTED', sale_credit: 'NOT_APPLICABLE'
    },
    conversation_history: {
      messages: [{
        message_id: `m-${caseId}`, occurred_at: AT, direction: 'INBOUND',
        actor_type: 'CUSTOMER', text
      }],
      summary_source_event_ids: []
    }
  };
}

function assemble(testCase) {
  return assembleTurnInput({
    shell: shellFor(testCase.id, testCase.customer_text),
    leadSnapshot: null,
    inventory: suite.inventory,
    description: testCase.description,
    sourceSystem: SOURCE
  });
}

const byId = (id) => suite.inventory.find((v) => v.vehicle_id === id);

/* -- per-case behaviour ---------------------------------------------------- */

for (const testCase of suite.cases) {
  test(`${testCase.id} (${testCase.family}): ${testCase.why}`, () => {
    const { turn_input, resolution } = assemble(testCase);
    const expected = testCase.expect;

    assert.equal(resolution.resolution, expected.resolution, 'resolution');

    const verdict = answerability(turn_input, resolution, testCase.asks_about);
    assert.equal(verdict.action, expected.action, `action for ${testCase.asks_about}`);

    if (expected.action === 'ANSWER') {
      const fact = factFor(turn_input, expected.vehicle_id, testCase.asks_about);
      assert.ok(fact, 'a verified fact must exist');
      assert.equal(fact.value, expected.value, 'the answer must be the inventory value');
      // provenance the agent is required to cite
      assert.equal(fact.source_system, SOURCE);
      assert.equal(fact.entity_id, expected.vehicle_id);
      assert.match(fact.verified_at, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/);
      assert.ok(fact.fact_id.length > 0);
      assert.equal(fact.status, 'CONFIRMED');
      assert.deepEqual(turn_input.lead_snapshot, null);
    }

    if (expected.action === 'CONFIRM') {
      assert.equal(verdict.reason, expected.reason);
      assert.equal(factFor(turn_input, expected.vehicle_id ?? '', testCase.asks_about), null,
        'nothing may be quotable when the agent must ask for confirmation');
    }

    if (expected.action === 'ASK') {
      assert.deepEqual(turn_input.verified_facts, [],
        'an ambiguous match must leave the agent nothing to quote');
      assert.deepEqual(
        resolution.candidates.map((c) => c.vehicle_id).sort(),
        [...expected.candidate_ids].sort()
      );
      for (const field of expected.distinguishing_fields) {
        assert.ok(resolution.distinguishing_fields.includes(field),
          `${field} should be offered as a way to tell them apart`);
      }
    }
  });
}

/* -- invariants across every case ------------------------------------------ */

test('every assembled turn validates against $defs.turnInput', () => {
  const definition = turnSchema.$defs.turnInput;
  const allowed = new Set(Object.keys(definition.properties));

  for (const testCase of suite.cases) {
    const { turn_input } = assemble(testCase);
    for (const key of definition.required) {
      assert.ok(key in turn_input, `${testCase.id}: missing group ${key}`);
    }
    for (const key of Object.keys(turn_input)) {
      assert.ok(allowed.has(key), `${testCase.id}: ${key} is not allowed by the contract`);
    }
    assert.ok(Array.isArray(turn_input.verified_facts));
  }
});

test('emitted facts satisfy $defs.verifiedFact', () => {
  const definition = turnSchema.$defs.verifiedFact;
  const allowed = new Set(Object.keys(definition.properties));
  const entityTypes = new Set(definition.properties.entity_type.enum);
  const statuses = new Set(definition.properties.status.enum);
  let seen = 0;

  for (const testCase of suite.cases) {
    for (const fact of assemble(testCase).turn_input.verified_facts) {
      seen += 1;
      for (const key of definition.required) assert.ok(key in fact, `missing ${key}`);
      for (const key of Object.keys(fact)) assert.ok(allowed.has(key), `${key} not allowed`);
      assert.ok(entityTypes.has(fact.entity_type));
      assert.ok(statuses.has(fact.status));
    }
  }
  assert.ok(seen > 0, 'the suite must actually produce facts');
});

test('the negotiation floor and internal notes never reach a turn', () => {
  for (const testCase of suite.cases) {
    const { turn_input, resolution } = assemble(testCase);
    const blob = JSON.stringify({ turn_input, resolution });

    for (const field of NEVER_DISCLOSED_FIELDS) {
      assert.ok(!turn_input.verified_facts.some((f) => f.field === field),
        `${testCase.id} leaked ${field} as a fact`);
      assert.ok(!blob.includes(`"${field}"`), `${testCase.id} leaked the ${field} key`);
    }
    // and no floor VALUE, under any key
    for (const vehicle of suite.inventory) {
      if (vehicle.min_price_aed === undefined) continue;
      assert.ok(!blob.includes(String(vehicle.min_price_aed)),
        `${testCase.id} leaked ${vehicle.vehicle_id}'s floor value`);
      if (vehicle.notes) {
        assert.ok(!blob.includes(vehicle.notes), `${testCase.id} leaked ${vehicle.vehicle_id}'s note`);
      }
    }
  }
});

test('a sold vehicle never appears in a turn', () => {
  const sold = byId('AM-004');
  assert.equal(sold.status, 'Продана');
  for (const testCase of suite.cases) {
    const { turn_input, resolution } = assemble(testCase);
    assert.ok(!turn_input.verified_facts.some((f) => f.entity_id === 'AM-004'));
    assert.ok(!(resolution.candidates ?? []).some((c) => c.vehicle_id === 'AM-004'));
  }
});

test('ambiguity is carried by matched ids plus empty facts, not by an invented field', () => {
  const ambiguous = suite.cases.find((c) => c.expect.resolution === 'AMBIGUOUS');
  const lead = {
    lead_id: 'L-1', created_at: AT, updated_at: AT,
    state: 'NEW', temperature: { level: 'WARM', reason_codes: [], evidence_event_ids: [], assessed_at: AT },
    identities: [], attribution_id: 'att-1', version: 1,
    qualification: {
      vehicle_need: { value: null, status: 'UNKNOWN' }, budget: { value: null, status: 'UNKNOWN' },
      payment_method: { value: null, status: 'UNKNOWN' }, intended_use: { value: null, status: 'UNKNOWN' },
      timeframe: { value: null, status: 'UNKNOWN' }, geography: { value: null, status: 'UNKNOWN' },
      trade_in: { value: null, status: 'UNKNOWN' }, appointment_readiness: { value: null, status: 'UNKNOWN' }
    },
    consent: { contact_allowed: true, marketing_opt_in: false, opt_out: false, policy_basis: 'dev' }
  };

  const { turn_input } = assembleTurnInput({
    shell: shellFor(ambiguous.id, ambiguous.customer_text),
    leadSnapshot: lead,
    inventory: suite.inventory,
    description: ambiguous.description,
    sourceSystem: SOURCE
  });

  assert.deepEqual(turn_input.verified_facts, []);
  assert.deepEqual(turn_input.lead_snapshot.requested_vehicle_ids.sort(),
    ['AM-002', 'AM-003', 'AM-006']);
});

test('the fixture set is dev-only and says so', () => {
  assert.match(suite._README, /NOT SEALED/);
  assert.match(suite._README, /NOT QUALIFICATION EVIDENCE/);
  assert.deepEqual(suite.family_scope, ['FACT', 'ID']);
});
