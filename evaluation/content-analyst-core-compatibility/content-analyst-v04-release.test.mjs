import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const json = (p) => JSON.parse(read(p));

const CORE_SHA = '5d440e1bf3e20fbd35c6ab276310a904e36cc06d';
const UAE_QUALIFIED_BLOB = '7f41c2d1ba40c3b4c59e3eba2fb264c04162c320';

test('production Content Analyst entrypoint loads qualified composition in order', () => {
  const s = read('agents/content-analyst.md');
  const core = s.indexOf('agents/content-analyst-core-binding.md');
  const uae = s.indexOf('agents/content-analyst-uae-specialization.md');
  const schema = s.indexOf('data-schemas/content-spec.schema.json');
  assert.ok(core >= 0 && uae > core && schema > uae);
  assert.match(s, /READY_FOR_CREATOR/);
  assert.doesNotMatch(s, /final script\/copy.*owns/i);
});

test('qualified binding pins exact released core and specialization evidence', () => {
  const s = read('agents/content-analyst-core-binding.md');
  assert.match(s, new RegExp(CORE_SHA));
  assert.match(s, new RegExp(UAE_QUALIFIED_BLOB));
  assert.match(s, /33617987020/);
  assert.match(s, /33623482450/);
  assert.match(s, /structural observability metadata only/i);
  assert.match(s, /Analytics owns event\/instrumentation design/i);
});

test('UAE specialization keeps commercial truth and authority boundaries', () => {
  const s = read('agents/content-analyst-uae-specialization.md');
  assert.match(s, new RegExp(CORE_SHA));
  assert.match(s, /model brochure.*does not establish unit-specific equipment/i);
  assert.match(s, /cannot publish, send buyer messages, change price\/offer/i);
  assert.match(s, /appointment\/test drive/);
});

test('canonical content-spec is v0.4 architecture contract, not legacy analytics contract', () => {
  const s = json('data-schemas/content-spec.schema.json');
  const req = new Set(s.required);
  for (const key of ['constraint_model','attention_contract','visual_communication_requirements','creator_handoff','structural_observability']) {
    assert.ok(req.has(key), `missing required ${key}`);
  }
  for (const legacy of ['experiment_lock','hook_specification','visual_requirements','analytics_handoff']) {
    assert.ok(!req.has(legacy), `legacy required field survived: ${legacy}`);
    assert.ok(!(legacy in s.properties), `legacy property survived: ${legacy}`);
  }
  assert.deepEqual(s.properties.status.enum, ['READY_FOR_CREATOR','BLOCKED_MISSING_INPUT','NEEDS_STRATEGIST_REVISION']);
  assert.equal(s.additionalProperties, false);
});

test('qualified Creator entrypoint loads the tested v0.4 compatibility bridge', () => {
  const entry = read('agents/content-creator.md');
  const bridgePath = 'agents/content-creator-content-analyst-v04-compatibility.md';
  assert.match(entry, new RegExp(bridgePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  const bridge = read(bridgePath);
  assert.match(bridge, /33623482450/);
  assert.match(bridge, /constraint_model/);
  assert.match(bridge, /structural_observability/);
  assert.match(bridge, /Do not synthesize KPI thresholds/i);
});
