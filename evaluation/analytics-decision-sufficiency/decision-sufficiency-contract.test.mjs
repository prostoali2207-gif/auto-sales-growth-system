import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const gate = readFileSync(new URL('../../agents/analytics-causal-evidence-gates.md', import.meta.url), 'utf8');
const schema = JSON.parse(readFileSync(new URL('../../data-schemas/analytics-decision.schema.json', import.meta.url), 'utf8'));

test('causal uncertainty cannot mechanically become operational paralysis', () => {
  assert.match(gate, /low causal confidence.*MUST NOT.*insufficient evidence for any operational decision/is);
  assert.match(gate, /confounder.*blocks.*hook X caused the difference.*does not automatically require continued funding/is);
  assert.match(gate, /reversible pause\/stop.*is not a causal claim/is);
});

test('guard preserves no-dumb-threshold and fixed-horizon safeguards', () => {
  assert.match(gate, /Do not create a universal rule.*cost differs by X%.*KILL/is);
  assert.match(gate, /fixed-horizon experiment.*interim cost gap alone does not authorize an early KILL/is);
  assert.match(gate, /verified mature downstream economics reverse an upstream cost comparison/is);
  assert.match(gate, /`?SCALE`? remains stricter than a bounded reversible stop/is);
});

test('decision schema requires separate causal and operational records', () => {
  assert.ok(schema.required.includes('causal_claim'));
  assert.ok(schema.required.includes('operational_assessment'));
  assert.notEqual(schema.properties.causal_claim, schema.properties.operational_assessment);

  const operational = schema.properties.operational_assessment;
  for (const field of [
    'conclusion',
    'evidence_strength',
    'materiality',
    'reversibility',
    'cost_of_waiting_or_continuing',
    'confounder_decision_relevance',
    'evidence_that_would_change_action'
  ]) {
    assert.ok(operational.required.includes(field), `missing required operational field: ${field}`);
  }
});

test('confounder relevance is evaluated against the operational action explicitly', () => {
  const item = schema.properties.operational_assessment.properties.confounder_decision_relevance.items;
  assert.deepEqual(item.required, ['confounder', 'can_plausibly_change_operational_action', 'rationale']);
  assert.equal(item.properties.can_plausibly_change_operational_action.type, 'boolean');
});
