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

check('WC-CT-01 version mismatch', () => {
  assert.equal(validateArtifactJoin([
    { experiment_id: 'E1', experiment_version: '1', validation_status: 'VALID' },
    { experiment_id: 'E1', experiment_version: '2', validation_status: 'VALID' }
  ]).code, 'EXPERIMENT_VERSION_MISMATCH');
});

check('WC-CT-02 stale artifact', () => {
  assert.equal(validateArtifactJoin([
    { experiment_id: 'E1', experiment_version: '1', validation_status: 'STALE' }
  ]).code, 'INVALID_OR_STALE_ARTIFACT');
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

check('WC-CC-02 superseded approval', () => {
  assert.equal(validateApproval({ status: 'APPROVED', approvedVersion: 'v1', currentVersion: 'v2' }).code, 'APPROVAL_VERSION_MISMATCH');
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

check('WC-AU-03 controller cannot handle lead', () => {
  assert.equal(validateTaskAuthority('ORCHESTRATOR', 'HANDLE_LEAD').code, 'CONTROLLER_SPECIALIST_OVERREACH');
});

check('WC-CT-03 valid join', () => {
  assert.equal(validateArtifactJoin([
    { experiment_id: 'E1', experiment_version: '3', validation_status: 'VALID' },
    { experiment_id: 'E1', experiment_version: '3', validation_status: 'VALID' }
  ]).ok, true);
});

for (const row of results) console.log(`${row.id}: ${row.result}${row.error ? ` — ${row.error}` : ''}`);

const failed = results.filter(x => x.result === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} development fixtures passed.`);
if (failed.length) process.exit(1);
