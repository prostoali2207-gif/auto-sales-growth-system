import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readText = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const readJson = (relative) => JSON.parse(readText(relative));

const binding = readText('../../agents/analytics-core-binding.md');
const strategy = readJson('../../data-schemas/strategy-experiment.schema.json');
const observation = readJson('../../data-schemas/analytics-observation.schema.json');
const decision = readJson('../../data-schemas/analytics-decision.schema.json');

const CORE = {
  version: '1.2.0',
  artifactDigest: 'sha256:95e743815d93841fb43051ab116613f5108f1683b96584a193d86c5fbd037f7d',
  assemblyDigest: 'sha256:d57001f6820cc346098397432bc247d05eb529c1611b785dc978552010b25629',
  outputBlob: '6cc6c50ae82954569a5562fe5f8b03c5ded5ea57',
  recommendation: ['CONTINUE', 'ITERATE', 'SCALE', 'KILL', 'INCONCLUSIVE'],
  causalStatus: ['IDENTIFIED', 'UNRESOLVED', 'NOT_APPLICABLE'],
  claimScope: ['REGISTERED_ESTIMAND', 'INTERIM_OUTCOME'],
  claimCeiling: ['NONE', 'DESCRIPTIVE_ASSOCIATION', 'DIRECTIONAL_ASSOCIATION', 'INCREMENTAL_CAUSAL'],
  decisiveMetric: ['MATURE_DOWNSTREAM_ECONOMICS', 'REGISTERED_PRIMARY_KPI', 'ACQUISITION_COST', 'GUARDRAIL', 'CAPACITY', 'NONE_DECIDABLE'],
  decisionBasis: ['REGISTERED_PRIMARY_KPI', 'MATURE_DOWNSTREAM_ECONOMICS', 'ACQUISITION_COST_DIAGNOSTIC', 'MATERIALITY', 'REVERSIBILITY', 'COST_OF_WAITING', 'CONFOUNDER_ACTION_RELEVANCE', 'GUARDRAIL_BREACH', 'CAPACITY_CONSTRAINT', 'INSUFFICIENT_EVIDENCE'],
  scaleState: ['BLOCKED', 'ELIGIBLE'],
  scaleReasons: ['UNIDENTIFIED_CAUSAL_EFFECT', 'MEASUREMENT_INTEGRITY_UNRESOLVED', 'IMMATURE_OUTCOMES', 'INSUFFICIENT_SAMPLE', 'NO_CREDIBLE_COUNTERFACTUAL', 'CAPACITY_OR_SATURATION_UNKNOWN', 'GUARDRAIL_UNVERIFIED', 'NOT_BLOCKED']
};

const enumAt = (obj, ...path) => path.reduce((value, key) => value[key], obj).enum;

test('binding pins the exact released 1.2.0 artifact and preserves runtime boundary', () => {
  assert.ok(binding.includes('version: `1.2.0`'));
  assert.ok(binding.includes(CORE.artifactDigest));
  assert.ok(binding.includes(CORE.assemblyDigest));
  assert.ok(binding.includes(CORE.outputBlob));
  assert.match(binding, /runtime-family scoped/i);
  assert.match(binding, /model family outside the qualified runtime boundary/i);
});

test('experiment identity makes comparison and arm scope explicit before Analytics runs', () => {
  assert.ok(strategy.required.includes('experiment_version'));
  assert.ok(strategy.required.includes('variant_ids'));
  assert.equal(strategy.properties.variant_ids.minItems, 1);
  assert.equal(strategy.properties.variant_ids.uniqueItems, true);
  assert.match(strategy.properties.experiment_id.description, /comparison as a whole/i);
  assert.ok(observation.required.includes('variant_id'));
  assert.match(observation.properties.variant_id.description, /arm identifier/i);
});

test('application decision handoff carries the qualified three-channel decision record unchanged', () => {
  for (const field of ['identification_ledger', 'decision_record', 'business_scale_gate']) {
    assert.ok(decision.required.includes(field), `missing required compatibility field: ${field}`);
  }

  assert.deepEqual(decision.properties.recommendation.enum, CORE.recommendation);
  const record = decision.properties.decision_record;
  assert.deepEqual(record.required, ['causal', 'operational', 'scale_readiness']);
  assert.deepEqual(enumAt(record, 'properties', 'causal', 'properties', 'status'), CORE.causalStatus);
  assert.deepEqual(enumAt(record, 'properties', 'causal', 'properties', 'claim_scope'), CORE.claimScope);
  assert.deepEqual(enumAt(record, 'properties', 'causal', 'properties', 'claim_ceiling'), CORE.claimCeiling);
  assert.deepEqual(enumAt(record, 'properties', 'operational', 'properties', 'action'), CORE.recommendation);
  assert.deepEqual(enumAt(record, 'properties', 'operational', 'properties', 'decisive_metric'), CORE.decisiveMetric);
  assert.deepEqual(enumAt(record, 'properties', 'operational', 'properties', 'decision_basis', 'items'), CORE.decisionBasis);
  assert.deepEqual(enumAt(record, 'properties', 'scale_readiness', 'properties', 'state'), CORE.scaleState);
  assert.deepEqual(enumAt(record, 'properties', 'scale_readiness', 'properties', 'blocking_reasons', 'items'), CORE.scaleReasons);
});

test('identification ledger is structurally forced before outcome-count reasoning', () => {
  const ledger = decision.properties.identification_ledger;
  assert.equal(ledger.properties.recorded_before_outcome_counts.const, true);
  for (const field of [
    'assignment_defect',
    'exposure_or_instrumentation_defect',
    'comparability_defect',
    'blocking_confounder_defect',
    'registered_window_incomplete'
  ]) {
    assert.ok(ledger.required.includes(field), `missing ledger question: ${field}`);
    assert.equal(ledger.properties[field].$ref, '#/$defs/ledgerCheck');
  }
});

test('Showroom 171 SCALE cannot silently pass on platform metrics alone', () => {
  const gate = decision.properties.business_scale_gate;
  assert.deepEqual(gate.required, ['marginal_business_value', 'delegated_authority', 'operational_capacity', 'scale_allowed', 'evidence_refs']);
  for (const field of ['marginal_business_value', 'delegated_authority', 'operational_capacity']) {
    assert.deepEqual(gate.properties[field].enum, ['PASS', 'FAIL', 'UNKNOWN']);
  }
  assert.match(gate.description, /SCALE is valid only when all three statuses are PASS/i);
  assert.match(gate.description, /missing business facts remain UNKNOWN rather than invented/i);
  assert.match(binding, /Prices, margins, inventory, capacity, budget authority, leads and sales remain live business facts/i);
});

test('project target mapping preserves v1.2 action scope instead of guessing from labels', () => {
  assert.match(binding, /experiment_id.*registered comparison as a whole/is);
  assert.match(binding, /Arm-specific actions may target only an immutable arm identifier declared/is);
  assert.match(binding, /MUST NOT invent one/is);
  assert.match(binding, /Before reading outcome counts.*identification ledger/is);
  assert.match(binding, /Outcome sparsity.*must not retroactively change the identification verdict/is);
});
