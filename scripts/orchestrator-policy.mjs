import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const policyPath = path.join(repoRoot, 'config', 'orchestrator-policy.json');

export const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));

export function expectedOwner(state, blockerOwner = null) {
  const node = policy.states[state];
  if (!node) return null;
  if (node.owner === 'DYNAMIC_BLOCKER_OWNER') return blockerOwner;
  return node.owner;
}

export function canTransition(from, to, { blockedFromState = null, blockers = [], reopenTrigger = null } = {}) {
  const node = policy.states[from];
  if (!node) return { ok: false, code: 'UNKNOWN_STATE' };
  if (!policy.states[to]) return { ok: false, code: 'UNKNOWN_TARGET_STATE' };

  if (from === 'BLOCKED') {
    if (!blockedFromState) return { ok: false, code: 'MISSING_BLOCKED_FROM_STATE' };
    if (blockers.some(b => b.status !== 'RESOLVED')) return { ok: false, code: 'BLOCKER_STILL_OPEN' };
    if (to !== blockedFromState) return { ok: false, code: 'INVALID_BLOCKED_RESUME' };
    return { ok: true, code: 'LEGAL_BLOCKED_RESUME' };
  }

  if (from === 'PARKED') {
    if (to !== 'STRATEGY_REQUIRED') return { ok: false, code: 'ILLEGAL_TRANSITION' };
    if (!['STRATEGIST', 'HUMAN'].includes(reopenTrigger)) {
      return { ok: false, code: 'PARKED_REOPEN_TRIGGER_REQUIRED' };
    }
    return { ok: true, code: 'LEGAL_PARKED_REOPEN' };
  }

  if (!node.next.includes(to)) return { ok: false, code: 'ILLEGAL_TRANSITION' };
  return { ok: true, code: 'LEGAL_TRANSITION' };
}

export function validateRevision(expectedRevision, submittedRevision) {
  if (!Number.isInteger(expectedRevision) || !Number.isInteger(submittedRevision)) {
    return { ok: false, code: 'INVALID_REVISION' };
  }
  if (expectedRevision !== submittedRevision) {
    return { ok: false, code: 'REVISION_CONFLICT' };
  }
  return { ok: true, code: 'REVISION_MATCH' };
}

export function validateTaskAuthority(actor, taskType, { dynamicOwner = null } = {}) {
  const expected = policy.task_owner[taskType];
  if (!expected) return { ok: false, code: 'UNKNOWN_TASK_TYPE' };

  if (actor === policy.controller_identifier && policy.controller_forbidden_tasks.includes(taskType)) {
    return { ok: false, code: 'CONTROLLER_SPECIALIST_OVERREACH', expectedOwner: expected };
  }

  if (expected.startsWith('DYNAMIC_')) {
    if (!dynamicOwner) return { ok: false, code: 'DYNAMIC_OWNER_REQUIRED' };
    if (actor !== dynamicOwner) return { ok: false, code: 'WRONG_TASK_OWNER', expectedOwner: dynamicOwner };
    return { ok: true, code: 'AUTHORIZED_DYNAMIC_TASK_OWNER', expectedOwner: dynamicOwner };
  }

  if (actor !== expected) {
    return { ok: false, code: 'WRONG_TASK_OWNER', expectedOwner: expected };
  }
  return { ok: true, code: 'AUTHORIZED_TASK_OWNER', expectedOwner: expected };
}

export function retryDirective(errorClass, attempt = 1) {
  const rule = policy.retry_policy[errorClass];
  if (!rule) return { automatic: false, directive: 'BLOCK_AND_ESCALATE', code: 'UNKNOWN_ERROR_CLASS' };
  if (!rule.automatic) return { automatic: false, directive: rule.directive, code: errorClass };
  const retriesUsed = Math.max(0, attempt - 1);
  const retriesRemaining = Math.max(0, rule.max_retries_after_first_attempt - retriesUsed);
  return {
    automatic: retriesRemaining > 0,
    directive: retriesRemaining > 0 ? 'RETRY_TRANSIENT' : 'EXHAUSTED_BLOCK',
    retriesRemaining,
    sameIdempotencyKey: rule.same_idempotency_key === true,
    code: errorClass
  };
}

export function requiresReconciliation(taskType, outcomeKnown) {
  const sideEffect = policy.side_effect_tasks.includes(taskType);
  if (!sideEffect) return { required: false, code: 'NO_SIDE_EFFECT_RECONCILIATION_REQUIRED' };
  if (outcomeKnown === true) return { required: false, code: 'SIDE_EFFECT_OUTCOME_KNOWN' };
  return { required: true, code: 'RECONCILE_BEFORE_RETRY' };
}

function normalizedArtifactScope(refs = []) {
  return refs
    .map(x => `${x.artifact_id}|${x.version}|${x.sha256_or_revision}`)
    .sort();
}

export function validateApproval({
  status,
  expired = false,
  approvalScope,
  currentScope
}) {
  if (status !== 'APPROVED') return { ok: false, code: 'APPROVAL_NOT_APPROVED' };
  if (expired) return { ok: false, code: 'APPROVAL_EXPIRED' };
  if (!approvalScope || !currentScope) return { ok: false, code: 'APPROVAL_SCOPE_MISSING' };

  if (approvalScope.experiment_id !== currentScope.experiment_id ||
      approvalScope.experiment_version !== currentScope.experiment_version) {
    return { ok: false, code: 'APPROVAL_EXPERIMENT_SCOPE_MISMATCH' };
  }

  const approvedArtifacts = normalizedArtifactScope(approvalScope.artifact_refs);
  const currentArtifacts = normalizedArtifactScope(currentScope.artifact_refs);
  if (approvedArtifacts.length !== currentArtifacts.length ||
      approvedArtifacts.some((value, index) => value !== currentArtifacts[index])) {
    return { ok: false, code: 'APPROVAL_ARTIFACT_SCOPE_MISMATCH' };
  }

  return { ok: true, code: 'APPROVAL_CURRENT' };
}

export function validateArtifactJoin(refs) {
  if (!Array.isArray(refs) || refs.length === 0) return { ok: false, code: 'NO_ARTIFACTS' };
  if (refs.some(x => !x.artifact_id || !x.version || !x.sha256_or_revision)) {
    return { ok: false, code: 'ARTIFACT_IDENTITY_INCOMPLETE' };
  }
  const experimentIds = new Set(refs.map(x => x.experiment_id).filter(Boolean));
  const versions = new Set(refs.map(x => x.experiment_version).filter(Boolean));
  if (experimentIds.size > 1) return { ok: false, code: 'EXPERIMENT_ID_MISMATCH' };
  if (versions.size > 1) return { ok: false, code: 'EXPERIMENT_VERSION_MISMATCH' };
  if (refs.some(x => x.validation_status && x.validation_status !== 'VALID')) {
    return { ok: false, code: 'INVALID_OR_STALE_ARTIFACT' };
  }
  return { ok: true, code: 'ARTIFACT_JOIN_VALID' };
}

export function routeInquiry({ inquiryExists, currentExperimentState }) {
  if (!inquiryExists) return { dispatch: false, code: 'NO_INQUIRY' };
  return {
    dispatch: true,
    targetOwner: 'SALES_LEAD_AGENT',
    preserveExperimentState: currentExperimentState,
    code: 'ROUTE_SALES_IN_PARALLEL'
  };
}

export function unknownExceptionDirective() {
  return { action: 'BLOCK', targetOwner: 'HUMAN', code: 'UNKNOWN_EXCEPTION' };
}
