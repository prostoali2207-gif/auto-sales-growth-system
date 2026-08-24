// Deterministic staleness/conflict gate for verified business facts.
//
// Pure functions only: given a fact pool, a policy config, a query, and an explicit "now",
// resolveFact() always returns the same result. No I/O, no LLM, no wall-clock reads inside
// this module — the caller supplies `nowIso` so tests (and any future audit) are reproducible.
//
// See evaluation/business-facts/eval-plan.md for the reasoning behind the reason-code
// priority order and the expiry-boundary/policy-fallback semantics below.

export const REASON_CODES = Object.freeze({
  MISSING_FACT: 'MISSING_FACT',
  REVOKED_FACT: 'REVOKED_FACT',
  CONFLICTING_FACT_STATUS: 'CONFLICTING_FACT_STATUS',
  STALE_FACT_STATUS: 'STALE_FACT_STATUS',
  CONFLICTING_DUPLICATES: 'CONFLICTING_DUPLICATES',
  EXPIRED_FACT: 'EXPIRED_FACT',
  POLICY_UNSET: 'POLICY_UNSET'
});

function toEpochMs(isoString) {
  const ms = Date.parse(isoString);
  if (Number.isNaN(ms)) {
    throw new TypeError(`not a parseable RFC3339 date-time: ${JSON.stringify(isoString)}`);
  }
  return ms;
}

function valuesEqual(a, b) {
  // Fact `value` is an arbitrary JSON value (schema leaves it unconstrained). Structural
  // JSON equality is sufficient and deterministic for the CONFIRMED-duplicate check.
  return JSON.stringify(a) === JSON.stringify(b);
}

function resolveWindowSeconds(field, policy) {
  const perField = policy?.per_field_freshness_windows_seconds ?? {};
  const override = perField[field];
  if (override !== null && override !== undefined) return override;

  const fallback = policy?.default_freshness_window_seconds;
  return fallback === null || fallback === undefined ? null : fallback;
}

/**
 * @param {{entityType: string, entityId: string, field: string}} query
 * @param {Array<object>} facts - schema-valid business-fact records (see adapter.mjs)
 * @param {object} policy - parsed config/business-facts-policy.json
 * @param {string} nowIso - RFC3339 instant to evaluate against
 * @returns {{available: true, fact: object} | {available: false, reason_code: string, fact_id?: string, fact_ids?: string[]}}
 */
export function resolveFact(query, facts, policy, nowIso) {
  const nowMs = toEpochMs(nowIso);
  const candidates = facts.filter(
    (f) =>
      f.entity_type === query.entityType &&
      f.entity_id === query.entityId &&
      f.field === query.field
  );

  if (candidates.length === 0) {
    return { available: false, reason_code: REASON_CODES.MISSING_FACT };
  }

  // Priority order below is fixed and documented in eval-plan.md: a revocation is
  // authoritative over any other candidate for the same key, a self-declared conflict is
  // next, staleness is the softest explicit signal. This guarantees exactly one reason code
  // per query even when multiple records exist.
  const revoked = candidates.find((f) => f.status === 'REVOKED');
  if (revoked) {
    return { available: false, reason_code: REASON_CODES.REVOKED_FACT, fact_id: revoked.fact_id };
  }

  const conflicting = candidates.find((f) => f.status === 'CONFLICTING');
  if (conflicting) {
    return {
      available: false,
      reason_code: REASON_CODES.CONFLICTING_FACT_STATUS,
      fact_id: conflicting.fact_id
    };
  }

  const stale = candidates.find((f) => f.status === 'STALE');
  if (stale) {
    return { available: false, reason_code: REASON_CODES.STALE_FACT_STATUS, fact_id: stale.fact_id };
  }

  // Every remaining candidate is CONFIRMED (the only other enum value), by elimination.
  const confirmed = candidates;

  const distinctValues = [];
  for (const f of confirmed) {
    if (!distinctValues.some((v) => valuesEqual(v, f.value))) distinctValues.push(f.value);
  }
  if (distinctValues.length > 1) {
    return {
      available: false,
      reason_code: REASON_CODES.CONFLICTING_DUPLICATES,
      fact_ids: confirmed.map((f) => f.fact_id)
    };
  }

  // All confirmed candidates agree on value (possibly just one record); the most recently
  // verified one is canonical for the expiry/policy check below.
  const canonical = confirmed.reduce((latest, f) =>
    toEpochMs(f.verified_at) > toEpochMs(latest.verified_at) ? f : latest
  );

  if (canonical.expires_at != null) {
    // Boundary is inclusive: the exact instant of expiry counts as already expired. This is
    // the conservative reading of "fail closed" and is exercised by the exp-boundary fixture.
    if (nowMs >= toEpochMs(canonical.expires_at)) {
      return { available: false, reason_code: REASON_CODES.EXPIRED_FACT, fact_id: canonical.fact_id };
    }
    return { available: true, fact: canonical };
  }

  // No explicit per-record expiry: fall back to the policy-configured freshness window for
  // this field (or the policy default). Today every window in config/business-facts-policy.json
  // is null, so this branch always returns POLICY_UNSET until Ali sets real values.
  const windowSeconds = resolveWindowSeconds(query.field, policy);
  if (windowSeconds === null || windowSeconds === undefined) {
    return { available: false, reason_code: REASON_CODES.POLICY_UNSET, fact_id: canonical.fact_id };
  }

  const ageSeconds = (nowMs - toEpochMs(canonical.verified_at)) / 1000;
  if (ageSeconds >= windowSeconds) {
    return { available: false, reason_code: REASON_CODES.EXPIRED_FACT, fact_id: canonical.fact_id };
  }

  return { available: true, fact: canonical };
}
