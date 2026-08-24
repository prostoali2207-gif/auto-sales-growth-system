// Composed entry point: file-backed load + policy load + deterministic gate.
// Individual pieces (adapter.mjs, gate.mjs) are exported separately for callers/tests that
// want to load once and query many times without re-reading files per call.

import { readFileSync } from 'node:fs';
import { loadFactsFromFile } from './adapter.mjs';
import { resolveFact, REASON_CODES } from './gate.mjs';

export { loadFactsFromFile } from './adapter.mjs';
export { resolveFact, REASON_CODES } from './gate.mjs';

export function loadPolicy(policyFilePath) {
  return JSON.parse(readFileSync(policyFilePath, 'utf8'));
}

/**
 * Convenience one-shot call: load the source file and policy, then resolve a single fact.
 * For repeated queries against the same snapshot, prefer loading once with
 * loadFactsFromFile()/loadPolicy() and calling resolveFact() directly per query.
 *
 * @returns {{available: true, fact: object} | {available: false, reason_code: string}}
 */
export function getVerifiedFact({ sourceFilePath, policyFilePath, entityType, entityId, field, nowIso }) {
  const { facts } = loadFactsFromFile(sourceFilePath);
  const policy = loadPolicy(policyFilePath);
  return resolveFact({ entityType, entityId, field }, facts, policy, nowIso);
}
