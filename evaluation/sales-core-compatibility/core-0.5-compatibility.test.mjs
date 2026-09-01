import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const readText = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const readJson = (relative) => JSON.parse(readText(relative));
const gitBlobSha = (text) => createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0${text}`).digest('hex');

const entrypoint = readText('../../agents/sales-lead-conversion.md');
const binding = readText('../../agents/sales-lead-conversion-core-binding.md');
const specialization = readText('../../agents/sales-lead-conversion-uae-specialization.md');
const turn = readJson('../../data-schemas/sales-lead-turn.schema.json');
const lead = readJson('../../data-schemas/sales-lead.schema.json');
const events = readJson('../../data-schemas/sales-funnel-event.schema.json');

const CORE = {
  version: '0.5.0',
  digest: 'sha256:0e7b46f186269968df12d09f64d48c88e173196a8b59f69a4e1ba1a049f4f1d9',
  releaseCommit: 'bbb19e815845f8957430d3944894c3115ab9458c',
  manifestBlob: '6e8cf7d37a54343f9bf66e8c19ca222f2a0bf6ce',
  modelBlob: '46ee21802d4299397fac7c55a23fee7c85887c0a',
  evidenceBlob: 'c61faa34d219d15719a3d705886fb3edbe5d13d1',
  identityBlob: '9b38537404130b02d6fd694cb79cbea962e77486',
  appointmentBlob: '141a6b960ed80000ba7f930bb36003fe5055a321',
  qualificationBlob: '75eaa4e575e0397b3d574d01a1dd8b7d3f1215b7',
  specializationBlob: '538af0889c9e0acea9da79623162c00cda14ad64'
};

const turnInput = turn.$defs.turnInput;
const turnOutput = turn.$defs.turnOutput;
const qualification = lead.$defs.qualification;

test('entrypoint loads binding before the byte-preserved UAE specialization', () => {
  const bindingPos = entrypoint.indexOf('agents/sales-lead-conversion-core-binding.md');
  const specializationPos = entrypoint.indexOf('agents/sales-lead-conversion-uae-specialization.md');
  assert.ok(bindingPos >= 0);
  assert.ok(specializationPos > bindingPos);
  assert.match(entrypoint, /Do not bypass the binding/i);
  assert.equal(gitBlobSha(specialization), CORE.specializationBlob);
});

test('binding pins the exact qualified Sales 0.5 assembly and qualification evidence', () => {
  for (const value of Object.values(CORE).filter((v) => v !== CORE.specializationBlob)) {
    assert.ok(binding.includes(value), `missing qualified binding value: ${value}`);
  }
  assert.match(binding, /lifecycle: `qualified`/i);
  assert.match(binding, /manifest and digest define the qualified assembly/i);
  assert.match(binding, /MUST NOT claim to be running the qualified Sales composition/i);
});

test('existing schemas expose the authority readiness confirmation and event fields needed by the core', () => {
  const permitted = turnInput.properties.run_context.properties.permitted_actions.items.enum;
  assert.ok(permitted.includes('CREATE_APPOINTMENT'));
  assert.ok(permitted.includes('PROPOSE_APPOINTMENT'));
  assert.ok(permitted.includes('REQUEST_HANDOFF'));
  assert.ok(qualification.required.includes('appointment_readiness'));

  const appointment = lead.properties.appointment.oneOf[1];
  assert.ok(appointment.properties.status.enum.includes('PROPOSED'));
  assert.ok(appointment.properties.status.enum.includes('SET'));
  assert.ok(Object.hasOwn(appointment.properties, 'booking_confirmation_id'));
  assert.ok(events.properties.event_type.enum.includes('APPOINTMENT_PROPOSED'));
  assert.ok(events.properties.event_type.enum.includes('APPOINTMENT_SET'));
  assert.equal(events.properties.payload.additionalProperties, true);

  assert.ok(turnOutput.properties.decision.enum.includes('CREATE_APPOINTMENT'));
  assert.ok(turnOutput.properties.decision.enum.includes('PROPOSE_APPOINTMENT'));
  assert.ok(turnOutput.properties.decision.enum.includes('HANDOFF'));
});

test('appointment mapping keeps readiness commitment authority attempt and confirmation distinct', () => {
  assert.match(binding, /readiness -> `lead_snapshot\.qualification\.appointment_readiness`/i);
  assert.match(binding, /buyer commitment -> explicit buyer evidence/i);
  assert.match(binding, /action authority -> `run_context\.permitted_actions`/i);
  assert.match(binding, /execution request -> output `decision = CREATE_APPOINTMENT`/i);
  assert.match(binding, /operational confirmation -> authoritative appointment-system result/i);
  assert.match(binding, /Requested, queued, pending, accepted-for-processing, timed-out, failed, or ambiguous tool results are \*\*not\*\* `SET`/i);
  assert.match(binding, /non-null `booking_confirmation_id`/i);
  assert.match(binding, /must not simultaneously claim that booking succeeded/i);
});

test('valid trusted booking delegation is not weakened into blanket refusal', () => {
  assert.match(binding, /If explicit trusted deployment authority exists.*do not blanket-refuse/is);
  assert.match(binding, /This binding does not itself grant SEND_MESSAGE, CREATE_APPOINTMENT/is);
  assert.match(binding, /tool availability is not booking authority/i);
});

test('identity mapping fails closed without turning normalized contact into universal person proof', () => {
  const identity = lead.properties.identities.items.properties.verification_status.enum;
  assert.deepEqual(identity, ['VERIFIED', 'UNVERIFIED', 'AMBIGUOUS']);
  assert.ok(Object.hasOwn(lead.properties, 'deduplication_candidates'));
  assert.match(binding, /Normalized phone\/email or a shared contact value proves reachability\/linkage, not universally same-person identity/i);
  assert.match(binding, /Ambiguous identity stays separate\/reviewable/i);
  assert.match(binding, /Trusted strong person-level identifiers establishing different people resolve the records as distinct/i);
});

test('UAE specialization preserves stronger commercial truth and operational completion rules', () => {
  assert.match(specialization, /Non-negotiable truth boundary/i);
  assert.match(specialization, /must use only confirmed, current business facts/i);
  assert.match(specialization, /Content is an acquisition artifact, not the system of record/i);
  assert.match(specialization, /appointment is `SET` only after the buyer explicitly accepts a specific verified slot and the booking tool confirms it/i);
  assert.match(specialization, /Never mark a test drive completed without an operational event/i);
  assert.match(binding, /absence of evidence is not negative proof/i);
});

test('composition stays inside current project schemas instead of inventing a parallel appointment subsystem', () => {
  assert.match(binding, /No new state subsystem is required/i);
  assert.match(binding, /existing project schemas already carry/i);
  assert.ok(turn.required.includes('input'));
  assert.ok(turn.required.includes('output'));
  assert.equal(lead.additionalProperties, false);
});
