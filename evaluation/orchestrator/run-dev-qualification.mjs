import assert from 'node:assert/strict';
import {
  canTransition,
  validateRevision,
  validateTaskAuthority,
  retryDirective,
  requiresReconciliation,
  validateApproval,
  validateArtifactJoin,
  routeInquiry,
  unknownExceptionDirective
} from '../../scripts/orchestrator-policy.mjs';

const results = [];
const artifact = (id, experimentVersion = '1', status = 'VALID', hash = `sha-${id}`) => ({
  artifact_id: id,
  version: '1.0.0',
  sha256_or_revision: hash,
  experiment_id: 'E1',
  experiment_version: experimentVersion,
  validation_status: status
});

function check(id, fn) {
  try {
    fn();
    results.push({ id, result: 'PASS' });
  } catch (error) {
    results.push({ id, result: 'FAIL', error: error.message });
  }
}

check('WC-ST-01 legal edge', () => {
  assert.equal(canTransition('ANALYTICS_IN_PROGRESS', 'STRATEGIST_DECISION_REQUIRED').ok, true);
});

check('WC-ST-02 illegal direct scale', () => {
  assert.deepEqual(canTransition('ANALYTICS_IN_PROGRESS', 'SCALED'), { ok: false, code: 'ILLEGAL_TRANSITION' });
});

check('WC-ST-03 terminal protection', () => {
  assert.equal(canTransition('KILLED', 'CONTENT_ANALYSIS_REQUIRED').ok, false);
});

check('WC-ST-04 blocked cannot resume with open blocker', () => {
  const r = canTransition('BLOCKED', 'READY_TO_PUBLISH', {
    blockedFromState: 'READY_TO_PUBLISH',
    blockers: [{ status: 'OPEN' }]
  });
  assert.equal(r.code, 'BLOCKER_STILL_OPEN');
});

check('WC-ST-05 blocked resumes exact prior state after resolution', () => {
  const r = canTransition('BLOCKED', 'READY_TO_PUBLISH', {
    blockedFromState: 'READY_TO_PUBLISH',
    blockers: [{ status: 'RESOLVED' }]
  });
  assert.equal(r.ok, true);
});

check('WC-ST-06 blocked cannot resume to different state', () => {
  const r = canTransition('BLOCKED', 'PUBLISHING', {
    blockedFromState: 'READY_TO_PUBLISH',
    blockers: [{ status: 'RESOLVED' }]
  });
  assert.equal(r.code, 'INVALID_BLOCKED_RESUME');
});

check('WC-ST-07 parked requires explicit reopen trigger', () => {
  assert.equal(canTransition('PARKED', 'STRATEGY_REQUIRED').code, 'PARKED_REOPEN_TRIGGER_REQUIRED');
  assert.equal(canTransition('PARKED', 'STRATEGY_REQUIRED', { reopenTrigger: 'STRATEGIST' }).ok, true);
});

check('WC-CT-01 version mismatch', () => {
  assert.equal(validateArtifactJoin([artifact('A', '1'), artifact('B', '2')]).code, 'EXPERIMENT_VERSION_MISMATCH');
});

check('WC-CT-02 stale artifact', () => {
  assert.equal(validateArtifactJoin([artifact('A', '1', 'STALE')]).code, 'INVALID_OR_STALE_ARTIFACT');
});

check('WC-CT-03 incomplete immutable identity rejected', () => {
  const x = artifact('A');
  delete x.sha256_or_revision;
  assert.equal(validateArtifactJoin([x]).code, 'ARTIFACT_IDENTITY_INCOMPLETE');
});

check('WC-CT-04 valid join', () => {
  assert.equal(validateArtifactJoin([artifact('A', '3'), artifact('B', '3')]).ok, true);
});

check('WC-AU-01 controller cannot design experiment', () => {
  const r = validateTaskAuthority('ORCHESTRATOR', 'DESIGN_EXPERIMENT');
  assert.equal(r.ok, false);
  assert.equal(r.expectedOwner, 'STRATEGIST');
});

check('WC-AU-02 analytics cannot decide portfolio', () => {
  const r = validateTaskAuthority('ANALYTICS', 'DECIDE_PORTFOLIO');
  assert.equal(r.ok, false);
  assert.equal(r.expectedOwner, 'STRATEGIST');
});

check('WC-AU-03 controller cannot handle lead', () => {
  assert.equal(validateTaskAuthority('ORCHESTRATOR', 'HANDLE_LEAD').code, 'CONTROLLER_SPECIALIST_OVERREACH');
});

check('WC-AU-04 mechanical measurement collection may be controller-owned', () => {
  assert.equal(validateTaskAuthority('ORCHESTRATOR', 'COLLECT_MEASUREMENT').ok, true);
});

check('WC-AU-05 dynamic data repair requires explicit owner', () => {
  assert.equal(validateTaskAuthority('ANALYTICS', 'REPAIR_DATA').code, 'DYNAMIC_OWNER_REQUIRED');
  assert.equal(validateTaskAuthority('ANALYTICS', 'REPAIR_DATA', { dynamicOwner: 'ANALYTICS' }).ok, true);
});

check('WC-RT-01 transient bounded retry', () => {
  assert.equal(retryDirective('TRANSIENT_TOOL', 1).automatic, true);
  assert.equal(retryDirective('TRANSIENT_TOOL', 3).automatic, false);
});

check('WC-RT-02 data not ready waits', () => {
  assert.equal(retryDirective('DATA_NOT_READY', 1).directive, 'SCHEDULE_WAKEUP');
});

check('WC-RT-03 ambiguous publish reconciles', () => {
  assert.equal(requiresReconciliation('PUBLISH', false).required, true);
});

check('WC-CC-01 revision conflict', () => {
  assert.equal(validateRevision(7, 6).code, 'REVISION_CONFLICT');
});

check('WC-CC-02 superseded experiment approval rejected', () => {
  const approvalScope = {
    experiment_id: 'E1',
    experiment_version: '1',
    artifact_refs: [{ artifact_id: 'EXP', version: '1.0.0', sha256_or_revision: 'h1' }]
  };
  const currentScope = {
    experiment_id: 'E1',
    experiment_version: '2',
    artifact_refs: [{ artifact_id: 'EXP', version: '2.0.0', sha256_or_revision: 'h2' }]
  };
  assert.equal(validateApproval({ status: 'APPROVED', approvalScope, currentScope }).code, 'APPROVAL_EXPERIMENT_SCOPE_MISMATCH');
});

check('WC-CC-03 changed render invalidates creative approval', () => {
  const approvalScope = {
    experiment_id: 'E1',
    experiment_version: '1',
    artifact_refs: [{ artifact_id: 'RENDER', version: '1.0.0', sha256_or_revision: 'render-a' }]
  };
  const currentScope = {
    experiment_id: 'E1',
    experiment_version: '1',
    artifact_refs: [{ artifact_id: 'RENDER', version: '1.0.0', sha256_or_revision: 'render-b' }]
  };
  assert.equal(validateApproval({ status: 'APPROVED', approvalScope, currentScope }).code, 'APPROVAL_ARTIFACT_SCOPE_MISMATCH');
});

check('WC-CC-04 exact approval scope accepted', () => {
  const scope = {
    experiment_id: 'E1',
    experiment_version: '1',
    artifact_refs: [{ artifact_id: 'RENDER', version: '1.0.0', sha256_or_revision: 'render-a' }]
  };
  assert.equal(validateApproval({ status: 'APPROVED', approvalScope: scope, currentScope: scope }).ok, true);
});

check('WC-SP-01 inquiry routes during measurement', () => {
  const r = routeInquiry({ inquiryExists: true, currentExperimentState: 'MEASUREMENT_WAIT' });
  assert.equal(r.dispatch, true);
  assert.equal(r.targetOwner, 'SALES_LEAD_AGENT');
  assert.equal(r.preserveExperimentState, 'MEASUREMENT_WAIT');
});

check('WC-EX-01 unknown exception blocks', () => {
  assert.deepEqual(unknownExceptionDirective(), { action: 'BLOCK', targetOwner: 'HUMAN', code: 'UNKNOWN_EXCEPTION' });
});

for (const row of results) console.log(`${row.id}: ${row.result}${row.error ? ` — ${row.error}` : ''}`);

const failed = results.filter(x => x.result === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} development fixtures passed.`);
if (failed.length) process.exit(1);
